import { type Handlers } from "$fresh/server.ts";
import { STATUS_CODE } from "$std/http/status.ts";
import type { SignedInState } from "@/plugins/session.ts";
import { PostService } from "@/services/PostService.ts";
import { ulid } from "$std/ulid/mod.ts";
import { BadRequestError } from "@/utils/http.ts";
import { Post } from "@/models/Post.ts";

export const handler: Handlers<undefined, SignedInState> = {
  async DELETE(req, _ctx) {
    const body = await req.json();
    if (!body.slug) {
      throw new BadRequestError("Slug is required");
    }
    const postService = new PostService();
    await postService.deletePost(body.id);
    return new Response(null, { status: STATUS_CODE.NoContent });
  },

  async POST(req, ctx) {
    const body = await req.json();
    if (!body.title) {
      throw new BadRequestError("Title is required");
    }
    if (!body.url) {
      throw new BadRequestError("URL is required");
    }
    if (!body.slug) {
      throw new BadRequestError("Slug is required");
    }
    if (!body.content) {
      throw new BadRequestError("Content is required");
    }

    const post = {
      id: body.id || ulid(),
      userLogin: ctx.state.sessionUser.login,
      title: body.title,
      url: body.url,
      slug: body.slug,
      content: body.content,
    };

    const postService = new PostService();
    let dbPost: Post | null | undefined = await postService.getPost(post.id);
    if (body.id && dbPost) {
      if (dbPost.userLogin !== ctx.state.sessionUser.login) {
        return Response.json({ data: null, message: `Unauthorized` }, {
          status: STATUS_CODE.Unauthorized,
        });
      }
      dbPost = await postService.updatePost(post.id, post);
    } else {
      dbPost = await postService.createPost(post);
    }

    return Response.json(dbPost, { status: STATUS_CODE.Created });
  },
};
