export enum UserRoles {
  USER = "user",
  ADMIN = "admin",
}

export enum UserAuthConfigs {
  GITHUB = "github",
  GOOGLE = "google",
}

// User
export interface User {
  // AKA username
  id: string;
  login: string;
  sessionId: string;
  role: UserRoles;
  name?: string;
  authConfig: UserAuthConfigs;
  accessToken: string;
  createdAt?: Date;
  updatedAt?: Date;
}
