import { Image } from "@/models/Image.ts";
import { kv } from "@/utils/db.ts";

export class ImageService {
  constructor() {
  }

  async createImage(image: Image) {
    image.createdAt = new Date();
    const res = await kv.set(["images", image.id], image);
    if (!res.ok) throw new Error("Failed to create image");
  }

  async getImage(id: string) {
    const res = await kv.get<Image>(["images", id]);
    return res.value;
  }
}
