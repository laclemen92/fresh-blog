import { type Handlers } from "$fresh/server.ts";
import { STATUS_CODE } from "$std/http/status.ts";
import type { SignedInState } from "@/plugins/session.ts";
import { createPost, getPost, updatePost } from "@/utils/db.ts";
import { ulid } from "$std/ulid/mod.ts";
import { BadRequestError } from "@/utils/http.ts";

export const handler: Handlers<undefined, SignedInState> = {
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

    const postId = ulid();
    const post = {
      id: postId,
      userLogin: ctx.state.sessionUser.login,
      title: body.title,
      url: body.url,
      slug: body.slug,
      content: body.content,
    };

    if (await getPost(post.slug)) {
      await updatePost(post.slug, post);
    } else {
      await createPost(post);
    }

    return new Response(null, { status: STATUS_CODE.Created });
  },
};
