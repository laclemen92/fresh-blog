import { Post, postEntity } from "@/models/Post.ts";
import { Vote, voteEntity } from "@/models/Vote.ts";
import { ulid } from "$std/ulid/mod.ts";
import { kv } from "@/utils/db.ts";
import { create, deleteKey, findMany, findUnique } from "@laclemen92/kvm";

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

    const result = await create<Post>(postEntity, kv, post);
    if (!result || !result?.value) throw new Error("Failed to create post");
  }

  async getPost(id: string) {
    const result = await findUnique<Post>(postEntity, kv, id);
    return result?.value;
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
    await deleteKey<Post>(postEntity, kv, id, {
      cascadeDelete: true,
    });
    // also delete the votes for this post
    const votes = await findMany<Vote>(voteEntity, kv, {
      prefix: [voteEntity.name, id],
    });
    votes.forEach(async (vote) => {
      await deleteKey<Vote>(voteEntity, kv, {
        postId: vote.value.postId,
        userLogin: vote.value.userLogin,
      });
    });
    return;
  }

  listPosts(options?: Deno.KvListOptions) {
    return findMany<Post>(postEntity, kv, options);
  }

  async listPostsByUser(
    userLogin: string,
    options?: Deno.KvListOptions,
  ) {
    const postIds = await findMany<string>(postEntity, kv, {
      ...options,
      prefix: ["user", userLogin, "posts"],
    });

    return await Promise.all(postIds.map(async (postId) => {
      return await findUnique<Post>(postEntity, kv, postId?.value);
    }));
  }
}
