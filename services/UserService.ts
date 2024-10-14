import { User, UserAuthConfigs, UserRoles } from "@/models/User.ts";
import { kv } from "@/utils/db.ts";
import { ulid } from "$std/ulid/mod.ts";
import { create, findMany, findUnique, update } from "@laclemen92/kvm";
import { userEntity } from "@/models/User.ts";

export class UserService {
  constructor() {
  }

  /** For testing */
  randomUser(): User {
    return {
      id: ulid(),
      login: crypto.randomUUID(),
      sessionId: crypto.randomUUID(),
      role: UserRoles.USER,
      authConfig: UserAuthConfigs.GITHUB,
      accessToken: crypto.randomUUID(),
    };
  }

  async createUser(user: User) {
    user.id = ulid();
    user.createdAt = new Date();

    const result = await create<User>(userEntity, kv, user);

    if (!result || !result?.value) throw new Error("Failed to create user");
  }

  async updateUser(user: User) {
    user.updatedAt = new Date();
    const updated = await update<User>(userEntity, kv, user.id, user);

    if (!updated || !updated.value) throw new Error("Failed to update user");
  }

  // this is slightly complicated...
  // some things may just be manual
  async updateUserSession(user: User, sessionId: string) {
    const userKey = ["users", user.id];
    const oldUserBySessionKey = ["users_by_session", user.sessionId];
    const newUserBySessionKey = ["users_by_session", sessionId];
    const newUser: User = { ...user, sessionId };

    const atomicOp = kv.atomic()
      .set(userKey, newUser)
      .delete(oldUserBySessionKey)
      .check({ key: newUserBySessionKey, versionstamp: null })
      .set(newUserBySessionKey, user.id);

    const res = await atomicOp.commit();
    if (!res.ok) throw new Error("Failed to update user session");
  }

  async getUser(id: string) {
    const result = await findUnique<User>(userEntity, kv, id);
    return result?.value;
  }

  async getUserByLogin(login: string) {
    const user = await findUnique<User>(
      userEntity,
      kv,
      login,
      "users_by_login",
      true,
    );

    return user?.value;
  }

  async getUserBySession(sessionId: string) {
    const user = await findUnique<User>(
      userEntity,
      kv,
      sessionId,
      "users_by_session",
      true,
    );

    return user?.value;
  }

  listUsers(options?: Deno.KvListOptions) {
    return findMany<User>(userEntity, kv, options);
  }
}
