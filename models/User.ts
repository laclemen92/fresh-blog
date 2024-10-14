import { KVMEntity, ValueType } from "@laclemen92/kvm";
import { z } from "zod";

export enum UserRoles {
  USER = "user",
  ADMIN = "admin",
}

export enum UserAuthConfigs {
  GITHUB = "github",
  GOOGLE = "google",
}

const userSchema = z.object({
  id: z.string(),
  login: z.string(),
  sessionId: z.string(),
  role: z.nativeEnum(UserRoles),
  name: z.string().optional(),
  authConfig: z.nativeEnum(UserAuthConfigs),
  accessToken: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
}).strict();

export const userEntity: KVMEntity<typeof userSchema.shape> = {
  name: "users",
  primaryKey: [
    {
      name: "users",
      key: "id",
    },
  ],
  secondaryIndexes: [
    {
      name: "users_by_login",
      key: [{
        name: "users_by_login",
        key: "login",
      }],
      valueType: ValueType.KEY,
      valueKey: "id",
    },
    {
      name: "users_by_session",
      key: [{
        name: "users_by_session",
        key: "sessionId",
      }],
      valueType: ValueType.KEY,
    },
  ],
  schema: userSchema,
};

export type User = z.infer<typeof userEntity.schema>;
