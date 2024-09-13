// Copyright 2023-2024 the Deno authors. All rights reserved. MIT license.
import { createGoogleOAuthConfig } from "kv_oauth/mod.ts";
import { BadRequestError } from "@/utils/http.ts";

const scope = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

const DEFAULT_CALLBACK = "http://localhost:8000/callback/google";

export const googleOAuthConfig = createGoogleOAuthConfig({
  redirectUri: Deno.env.get(
    "GOOGLE_REDIRECT_URI",
  ) || DEFAULT_CALLBACK,
  scope,
});

export function isGoogleSetup() {
  try {
    createGoogleOAuthConfig({
      redirectUri: Deno.env.get(
        "GOOGLE_REDIRECT_URI",
      ) || DEFAULT_CALLBACK,
      scope,
    });
    return true;
  } catch {
    return false;
  }
}

interface GoogleUser {
  sub: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  email: string;
  email_verified: boolean;
}

/**
 * Returns the Google profile information of the user with the given access
 * token.
 */
export async function getGoogleUser(accessToken: string) {
  const resp = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { authorization: `Bearer ${accessToken}` },
  });
  if (!resp.ok) {
    const { message } = await resp.json();
    throw new BadRequestError(message);
  }
  return await resp.json() as Promise<GoogleUser>;
}
