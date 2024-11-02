import { type Handlers } from "$fresh/server.ts";
import { STATUS_CODE } from "$std/http/status.ts";
import type { SignedInState } from "@/plugins/session.ts";
import { ImageService } from "@/services/ImageService.ts";
import { BadRequestError } from "@/utils/http.ts";
import { ulid } from "$std/ulid/mod.ts";
import aws from "npm:aws-sdk";

export const handler: Handlers<undefined, SignedInState> = {
  async POST(req, _ctx) {
    const formData = await req.formData();
    const blob: File | null = formData.get("blob") as File;
    if (!blob) {
      throw new BadRequestError("Blob is required");
    }

    const region = Deno.env.get("DIGITAL_OCEAN_SPACES_REGION") || "";
    const environment = Deno.env.get("APP_ENV") || "localhost";
    const space = Deno.env.get("DIGITAL_OCEAN_SPACE") || "";

    const spacesEndpoint = new aws.Endpoint(`${region}.digitaloceanspaces.com`); //"nyc3.digitaloceanspaces.com");
    const s3 = new aws.S3({
      endpoint: spacesEndpoint,
      accessKeyId: Deno.env.get("DIGITAL_OCEAN_SPACES_ACCESS_KEY"),
      secretAccessKey: Deno.env.get("DIGITAL_OCEAN_SPACES_SECRET_KEY"),
    });

    const imageId = ulid();
    const key = environment === "production"
      ? `${imageId}`
      : `${environment}/${imageId}`;

    const buffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);

    const params: aws.S3.Types.PutObjectRequest = {
      Bucket: space,
      ACL: "public-read",
      Key: key,
      Body: uint8Array,
    };

    await s3.putObject(params).promise();

    const imageUrl =
      `https://${space}.${region}.cdn.digitaloceanspaces.com/${key}`;
    const image = {
      id: imageId,
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
