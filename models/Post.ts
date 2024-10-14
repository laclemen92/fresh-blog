import { KVMEntity, ValueType } from "@laclemen92/kvm";
import { z } from "zod";

const postSchema = z.object({
  id: z.string(),
  userLogin: z.string(),
  slug: z.string(),
  title: z.string(),
  url: z.string(),
  content: z.string(),
  deleted: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strict();

export const postEntity: KVMEntity<typeof postSchema.shape> = {
  name: "posts",
  primaryKey: [
    {
      name: "posts",
      key: "id",
    },
  ],
  secondaryIndexes: [
    {
      name: "posts_by_slug",
      key: [{
        name: "posts_by_slug",
        key: "slug",
      }],
      valueKey: "id",
      valueType: ValueType.KEY,
    },
    {
      name: "user",
      key: [{
        name: "user",
        key: "userLogin",
      }, {
        name: "posts",
        key: "id",
      }],
      valueKey: "id",
      valueType: ValueType.KEY,
    },
  ],
  schema: postSchema,
};

export type Post = z.infer<typeof postEntity.schema>;
