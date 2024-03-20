import { type Handlers } from "$fresh/server.ts";
import { STATUS_CODE } from "$std/http/status.ts";
import type { SignedInState } from "@/plugins/session.ts";
import { createImage } from "@/utils/db.ts";
import { BadRequestError } from "@/utils/http.ts";

export const handler: Handlers<undefined, SignedInState> = {
  async POST(req, _ctx) {
    const body = await req.json();
    if (!body.postId) {
      throw new BadRequestError("PostId is required");
    }
    if (!body.id) {
      throw new BadRequestError("ID is required");
    }
    if (!body.type) {
      throw new BadRequestError("Type is required");
    }
    if (!body.name) {
      throw new BadRequestError("Name is required");
    }
    if (!body.url) {
      throw new BadRequestError("Url is required");
    }

    const image = {
      id: body.id,
      type: body.type,
      name: body.name,
      url: body.url,
    };

    await createImage(image);

    return new Response(null, { status: STATUS_CODE.Created });
  },
};
