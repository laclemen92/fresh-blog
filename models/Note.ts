import { KVMEntity, ValueType } from "@laclemen92/kvm";
import { z } from "zod";

const noteSchema = z.object({
  id: z.string(),
  userLogin: z.string(),
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()).optional(),
  deleted: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  deletedAt: z.date().optional(),
}).strict();

export const noteEntity: KVMEntity<typeof noteSchema.shape> = {
  name: "notes",
  primaryKey: [
    {
      name: "notes",
      key: "id",
    },
  ],
  secondaryIndexes: [
    {
      name: "user",
      key: [{
        name: "user",
        key: "userLogin",
      }, {
        name: "notes",
        key: "id",
      }],
      valueKey: "id",
      valueType: ValueType.KEY,
    },
  ],
  schema: noteSchema,
};

export type Note = z.infer<typeof noteEntity.schema>;
