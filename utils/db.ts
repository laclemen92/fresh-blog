import { ulid } from "$std/ulid/mod.ts";

const DENO_KV_PATH_KEY = "DENO_KV_PATH";
let path = undefined;
if (
  (await Deno.permissions.query({ name: "env", variable: DENO_KV_PATH_KEY }))
    .state === "granted"
) {
  path = Deno.env.get(DENO_KV_PATH_KEY);
}
export const kv = await Deno.openKv(path);

// Post
export interface Post {
  id: string;
  userLogin: string;
  title: string;
  url: string;
  slug: string;
  content: string;
  deleted?: boolean;
}

/** For testing */
export function randomPost(): Post {
  return {
    id: ulid(),
    userLogin: crypto.randomUUID(),
    title: crypto.randomUUID(),
    url: `http://${crypto.randomUUID()}.com`,
    content: crypto.randomUUID(),
    slug: crypto.randomUUID(),
  };
}

export async function createPost(post: Post) {
  const postsKey = ["posts", post.id];
  const postsBySlugKey = ["posts_by_slug", post.slug];
  const postsUserKey = ["user", post.userLogin, "posts", post.id];

  const res = await kv.atomic()
    .check({ key: postsKey, versionstamp: null })
    .check({ key: postsBySlugKey, versionstamp: null })
    .check({ key: postsUserKey, versionstamp: null })
    .set(postsKey, post)
    .set(postsBySlugKey, post)
    .set(postsUserKey, post)
    .commit();

  console.error(res);
  if (!res.ok) throw new Error("Failed to create post");
}

export async function getPost(id: string) {
  const res = await kv.get<Post>(["posts", id]);
  return res.value;
}

export async function getPostBySlug(slug: string) {
  const res = await kv.get<Post>(["posts_by_slug", slug]);
  return res.value;
}

export async function updatePost(id: string, post: Post) {
  const postsKey = ["posts", id];
  const postsBySlugKey = ["posts_by_slug", post.slug];
  const postsUserKey = ["user", post.userLogin, "posts", post.id];

  const res = await kv.atomic()
    .set(postsKey, post)
    .set(postsUserKey, post)
    .set(postsBySlugKey, post)
    .commit();

  if (!res.ok) throw new Error("Failed to update post");
}

export async function deletePost(id: string) {
  const post = await getPost(id);
  if (post === null) return;
  post.deleted = true;
  await updatePost(id, post);
}

export function listPosts(options?: Deno.KvListOptions) {
  return kv.list<Post>({ prefix: ["posts"] }, options);
}

export function listPostsByUser(
  userLogin: string,
  options?: Deno.KvListOptions,
) {
  return kv.list<Post>({ prefix: ["user", userLogin, "posts"] }, options);
}

type UserRoles = "user" | "admin";

// User
export interface User {
  // AKA username
  login: string;
  sessionId: string;
  role: UserRoles;
}

/** For testing */
export function randomUser(): User {
  return {
    login: crypto.randomUUID(),
    sessionId: crypto.randomUUID(),
    role: "user",
  };
}

export async function createUser(user: User) {
  const usersKey = ["users", user.login];
  const usersBySessionKey = ["users_by_session", user.sessionId];

  const atomicOp = kv.atomic()
    .check({ key: usersKey, versionstamp: null })
    .check({ key: usersBySessionKey, versionstamp: null })
    .set(usersKey, user)
    .set(usersBySessionKey, user);

  const res = await atomicOp.commit();
  if (!res.ok) throw new Error("Failed to create user");
}

export async function updateUser(user: User) {
  const usersKey = ["users", user.login];
  const usersBySessionKey = ["users_by_session", user.sessionId];

  const atomicOp = kv.atomic()
    .set(usersKey, user)
    .set(usersBySessionKey, user);

  const res = await atomicOp.commit();
  if (!res.ok) throw new Error("Failed to update user");
}

export async function updateUserSession(user: User, sessionId: string) {
  const userKey = ["users", user.login];
  const oldUserBySessionKey = ["users_by_session", user.sessionId];
  const newUserBySessionKey = ["users_by_session", sessionId];
  const newUser: User = { ...user, sessionId };

  const atomicOp = kv.atomic()
    .set(userKey, newUser)
    .delete(oldUserBySessionKey)
    .check({ key: newUserBySessionKey, versionstamp: null })
    .set(newUserBySessionKey, newUser);

  const res = await atomicOp.commit();
  if (!res.ok) throw new Error("Failed to update user session");
}

export async function getUser(login: string) {
  const res = await kv.get<User>(["users", login]);
  return res.value;
}

export async function getUserBySession(sessionId: string) {
  const key = ["users_by_session", sessionId];
  const eventualRes = await kv.get<User>(key, {
    consistency: "eventual",
  });
  if (eventualRes.value !== null) return eventualRes.value;
  const res = await kv.get<User>(key);
  return res.value;
}

export function listUsers(options?: Deno.KvListOptions) {
  return kv.list<User>({ prefix: ["users"] }, options);
}
