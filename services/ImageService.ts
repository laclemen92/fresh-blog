import { Image, imageEntity } from "@/models/Image.ts";
import { kv } from "@/utils/db.ts";
import { create, findUnique } from "@laclemen92/kvm";

export class ImageService {
  constructor() {
  }

  async createImage(image: Image) {
    image.createdAt = new Date();
    const result = await create<Image>(imageEntity, kv, image);
    if (!result || !result?.value) throw new Error("Failed to create image");
  }

  async getImage(id: string) {
    const result = await findUnique<Image>(imageEntity, kv, id);
    return result?.value;
  }
}
