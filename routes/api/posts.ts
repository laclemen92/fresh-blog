import { type Handlers } from "$fresh/server.ts";
import { STATUS_CODE } from "$std/http/status.ts";
import type { SignedInState } from "@/plugins/session.ts";
import { PostService } from "@/services/PostService.ts";
import { ulid } from "$std/ulid/mod.ts";
import { BadRequestError } from "@/utils/http.ts";

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
    if (body.id && await postService.getPost(post.id)) {
      await postService.updatePost(post.id, post);
    } else {
      await postService.createPost(post);
    }

    return new Response(null, { status: STATUS_CODE.Created });
  },
};
