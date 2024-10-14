import { KVMEntity, ValueType } from "@laclemen92/kvm";
import { z } from "zod";

const voteSchema = z.object({
  postId: z.string(),
  userLogin: z.string(),
  createdAt: z.date().optional(),
}).strict();

export const voteEntity: KVMEntity<typeof voteSchema.shape> = {
  name: "votes",
  primaryKey: [
    {
      name: "votes",
      key: "postId",
    },
    {
      key: "userLogin",
    },
  ],
  secondaryIndexes: [{
    name: "votes_by_user",
    key: [{
      key: "userLogin",
      name: "user",
    }, {
      key: "postId",
      name: "votes",
    }],
    valueType: ValueType.KEY,
    valueKey: "postId",
  }],
  schema: voteSchema,
};

export type Vote = z.infer<typeof voteEntity.schema>;
