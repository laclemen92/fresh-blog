import { Post } from "@/models/Post.ts";
import { ulid } from "$std/ulid/mod.ts";
import { kv } from "@/utils/db.ts";

export class PostService {
  constructor() {
  }

  /** For testing */
  randomPost(): Post {
    return {
      id: ulid(),
      userLogin: crypto.randomUUID(),
      title: crypto.randomUUID(),
      url: `http://${crypto.randomUUID()}.com`,
      content: crypto.randomUUID(),
      slug: crypto.randomUUID(),
    };
  }

  async createPost(post: Post) {
    post.createdAt = new Date();
    const postsKey = ["posts", post.id];
    const postsBySlugKey = ["posts_by_slug", post.slug];
    const postsUserKey = ["user", post.userLogin, "posts", post.id];

    const res = await kv.atomic()
      .check({ key: postsKey, versionstamp: null })
      .check({ key: postsBySlugKey, versionstamp: null })
      .check({ key: postsUserKey, versionstamp: null })
      .set(postsKey, post)
      .set(postsBySlugKey, post.id)
      .set(postsUserKey, post.id)
      .commit();

    if (!res.ok) throw new Error("Failed to create post");
  }

  async getPost(id: string) {
    const res = await kv.get<Post>(["posts", id]);
    return res.value;
  }

  async getPostBySlug(slug: string) {
    const { value: postId } = await kv.get<string>(["posts_by_slug", slug]);
    if (!postId) {
      return null;
    }
    const res = await kv.get<Post>(["posts", postId]);

    return res.value;
  }

  async updatePost(id: string, post: Post) {
    post.updatedAt = new Date();
    const postsKey = ["posts", id];
    const postsBySlugKey = ["posts_by_slug", post.slug];
    const postsUserKey = ["user", post.userLogin, "posts", post.id];

    const res = await kv.atomic()
      .set(postsKey, post)
      .set(postsUserKey, post.id)
      .set(postsBySlugKey, post.id)
      .commit();

    if (!res.ok) throw new Error("Failed to update post");
  }

  async deletePost(id: string) {
    const post = await this.getPost(id);
    if (post === null) return;

    const postsKey = ["posts", id];
    const postsBySlugKey = ["posts_by_slug", post.slug];
    const postsUserKey = ["user", post.userLogin, "posts", post.id];

    await kv.delete(postsKey);
    await kv.delete(postsBySlugKey);
    await kv.delete(postsUserKey);
    return;
  }

  listPosts(options?: Deno.KvListOptions) {
    return kv.list<Post>({ prefix: ["posts"] }, options);
  }

  listPostsByUser(
    userLogin: string,
    options?: Deno.KvListOptions,
  ) {
    return kv.list<Post>({ prefix: ["user", userLogin, "posts"] }, options);
  }
}
