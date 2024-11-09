import { type Handlers } from "$fresh/server.ts";
import { STATUS_CODE } from "$std/http/status.ts";
import type { SignedInState } from "@/plugins/session.ts";
import { ImageService } from "@/services/ImageService.ts";
import { BadRequestError } from "@/utils/http.ts";
import { ulid } from "$std/ulid/mod.ts";
import { FleekSdk, PersonalAccessTokenService } from "npm:@fleekxyz/sdk@1.3.3";

export const handler: Handlers<undefined, SignedInState> = {
  async POST(req, _ctx) {
    const formData = await req.formData();
    const blob: File | null = formData.get("blob") as File;
    if (!blob) {
      throw new BadRequestError("Blob is required");
    }

    const patService = new PersonalAccessTokenService({
      personalAccessToken: Deno.env.get("FLEEK_API_TOKEN") || "",
      projectId: Deno.env.get("FLEEK_API_PROJECT_ID"),
    });

    const fleekSdk = new FleekSdk({
      accessTokenService: patService,
    });

    const result = await fleekSdk.storage().uploadFile({
      file: blob,
      onUploadProgress(uploadProgress) {
        console.error("uploadProgress", uploadProgress);
      },
    });

    const imageUrl = `https://cdn.lukeclement.xyz/ipfs/${result.pin.cid}`;
    const image = {
      id: ulid(),
      cid: result.pin.cid,
      type: blob.type,
      name: blob.name,
      url: imageUrl,
    };

    const imageService = new ImageService();
    await imageService.createImage(image);

    return new Response(
      JSON.stringify({
        imageUrl,
      }),
      {
        status: STATUS_CODE.Created,
      },
    );
  },
};
