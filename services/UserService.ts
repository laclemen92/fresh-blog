import { User, UserAuthConfigs, UserRoles } from "@/models/User.ts";
import { kv } from "@/utils/db.ts";

export class UserService {
  constructor() {
  }

  /** For testing */
  randomUser(): User {
    return {
      login: crypto.randomUUID(),
      sessionId: crypto.randomUUID(),
      role: UserRoles.USER,
      authConfig: UserAuthConfigs.GITHUB,
      accessToken: crypto.randomUUID(),
    };
  }

  async createUser(user: User) {
    user.createdAt = new Date();
    const usersKey = ["users", user.login];
    const usersBySessionKey = ["users_by_session", user.sessionId];

    const atomicOp = kv.atomic()
      .check({ key: usersKey, versionstamp: null })
      .check({ key: usersBySessionKey, versionstamp: null })
      .set(usersKey, user)
      .set(usersBySessionKey, user);

    const res = await atomicOp.commit();
    if (!res.ok) throw new Error("Failed to create user");
  }

  async updateUser(user: User) {
    user.updatedAt = new Date();
    const usersKey = ["users", user.login];
    const usersBySessionKey = ["users_by_session", user.sessionId];

    const atomicOp = kv.atomic()
      .set(usersKey, user)
      .set(usersBySessionKey, user);

    const res = await atomicOp.commit();
    if (!res.ok) throw new Error("Failed to update user");
  }

  async updateUserSession(user: User, sessionId: string) {
    const userKey = ["users", user.login];
    const oldUserBySessionKey = ["users_by_session", user.sessionId];
    const newUserBySessionKey = ["users_by_session", sessionId];
    const newUser: User = { ...user, sessionId };

    const atomicOp = kv.atomic()
      .set(userKey, newUser)
      .delete(oldUserBySessionKey)
      .check({ key: newUserBySessionKey, versionstamp: null })
      .set(newUserBySessionKey, newUser);

    const res = await atomicOp.commit();
    if (!res.ok) throw new Error("Failed to update user session");
  }

  async getUser(login: string) {
    const res = await kv.get<User>(["users", login]);
    return res.value;
  }

  async getUserBySession(sessionId: string) {
    const key = ["users_by_session", sessionId];
    const eventualRes = await kv.get<User>(key, {
      consistency: "eventual",
    });
    if (eventualRes.value !== null) return eventualRes.value;
    const res = await kv.get<User>(key);
    return res.value;
  }

  listUsers(options?: Deno.KvListOptions) {
    return kv.list<User>({ prefix: ["users"] }, options);
  }
}
