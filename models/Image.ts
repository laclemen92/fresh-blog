import { KVMEntity } from "@laclemen92/kvm";
import { z } from "zod";

const imageSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  url: z.string(),
  cid: z.string().optional(),
  createdAt: z.date().optional(),
}).strict();

export const imageEntity: KVMEntity<typeof imageSchema.shape> = {
  name: "images",
  primaryKey: [
    {
      name: "images",
      key: "id",
    },
  ],
  schema: imageSchema,
};

export type Image = z.infer<typeof imageEntity.schema>;
