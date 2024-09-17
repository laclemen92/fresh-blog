import { User, UserAuthConfigs, UserRoles } from "@/models/User.ts";
import { kv } from "@/utils/db.ts";
import { ulid } from "$std/ulid/mod.ts";

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
    const usersKey = ["users", user.id];
    const usersByLoginKey = ["users_by_login", user.login];
    const usersBySessionKey = ["users_by_session", user.sessionId];

    const atomicOp = kv.atomic()
      .check({ key: usersKey, versionstamp: null })
      .check({ key: usersBySessionKey, versionstamp: null })
      .check({ key: usersByLoginKey, versionstamp: null })
      .set(usersKey, user)
      .set(usersBySessionKey, user.id)
      .set(usersByLoginKey, user.id);

    const res = await atomicOp.commit();
    if (!res.ok) throw new Error("Failed to create user");
  }

  async updateUser(user: User) {
    user.updatedAt = new Date();
    const usersKey = ["users", user.id];

    const atomicOp = kv.atomic()
      .set(usersKey, user);

    const res = await atomicOp.commit();
    if (!res.ok) throw new Error("Failed to update user");
  }

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
    const res = await kv.get<User>(["users", id]);
    return res.value;
  }

  async getUserByLogin(login: string) {
    const { value: userId } = await kv.get<string>(["users_by_login", login]);
    if (!userId) {
      return null;
    }
    const user = await kv.get<User>(["users", userId]);

    return user.value;
  }

  async getUserBySession(sessionId: string) {
    const key = ["users_by_session", sessionId];
    const eventualRes = await kv.get<User>(key, {
      consistency: "eventual",
    });
    if (eventualRes.value !== null) {
      const { value: userId } = await kv.get<string>(key);
      if (!userId) {
        return null;
      }
      const user = await kv.get<User>(["users", userId]);

      return user.value;
    }
    const { value: userId } = await kv.get<string>(key);
    if (!userId) {
      return null;
    }
    const user = await kv.get<User>(["users", userId]);

    return user.value;
  }

  listUsers(options?: Deno.KvListOptions) {
    return kv.list<User>({ prefix: ["users"] }, options);
  }
}
