// Copyright 2023-2024 the Deno authors. All rights reserved. MIT license.
import type { Plugin } from "$fresh/server.ts";
import {
  createGitHubOAuthConfig,
  handleCallback,
  signIn,
  signOut,
} from "kv_oauth/mod.ts";
import { UserService } from "@/services/UserService.ts";
import { type User, UserAuthConfigs, UserRoles } from "@/models/User.ts";
import { getGitHubUser } from "@/utils/github.ts";
import { getGoogleUser, googleOAuthConfig } from "@/utils/google.ts";

// Exported for mocking and spying in e2e tests
export const _internals = { handleCallback };

/**
 * This custom plugin centralizes all authentication logic using the
 * {@link https://deno.land/x/deno_kv_oauth|Deno KV OAuth} module.
 *
 * The implementation is based off Deno KV OAuth's own
 * {@link https://deno.land/x/deno_kv_oauth/src/fresh_plugin.ts?source|Fresh plugin}
 * implementation.
 */
export default {
  name: "kv-oauth",
  routes: [
    {
      path: "/signin/google",
      handler: async (req) => await signIn(req, googleOAuthConfig),
    },
    {
      path: "/signin/github",
      handler: async (req) => await signIn(req, createGitHubOAuthConfig()),
    },
    {
      path: "/callback/google",
      handler: async (req) => {
        const { response, tokens, sessionId } = await _internals.handleCallback(
          req,
          googleOAuthConfig,
        );

        const googleUser = await getGoogleUser(tokens.accessToken);

        const userService = new UserService();
        const user = await userService.getUserByLogin(googleUser.email);

        if (user === null) {
          const user: User = {
            id: "",
            login: googleUser.email,
            authConfig: UserAuthConfigs.GOOGLE,
            sessionId,
            role: UserRoles.USER,
            name: googleUser.name,
            accessToken: tokens.accessToken,
          };

          await userService.createUser(user);
        } else {
          if (googleUser.name) {
            user.name = googleUser.name;
          }
          await userService.updateUserSession(user, sessionId);
        }

        return response;
      },
    },
    {
      path: "/callback/github",
      handler: async (req) => {
        const { response, tokens, sessionId } = await _internals.handleCallback(
          req,
          createGitHubOAuthConfig(),
        );

        const githubUser = await getGitHubUser(tokens.accessToken);
        const userService = new UserService();
        const user = await userService.getUserByLogin(githubUser.login);

        if (user === null) {
          const user: User = {
            id: "",
            login: githubUser.login,
            authConfig: UserAuthConfigs.GITHUB,
            sessionId,
            role: UserRoles.USER,
            name: githubUser.name,
            accessToken: tokens.accessToken,
          };

          await userService.createUser(user);
        } else {
          if (githubUser.name) {
            user.name = githubUser.name;
          }
          await userService.updateUserSession(user, sessionId);
        }

        return response;
      },
    },
    {
      path: "/signout",
      handler: signOut,
    },
  ],
} as Plugin;
