// Copyright 2023-2024 the Deno authors. All rights reserved. MIT license.
import { Plugin, STATUS_CODE } from "$fresh/server.ts";
import type { FreshContext } from "$fresh/server.ts";
import { getSessionId } from "kv_oauth/mod.ts";
import { UserService } from "@/services/UserService.ts";
import type { User } from "@/models/User.ts";
import { UnauthorizedError } from "@/utils/http.ts";

export interface State {
  sessionUser?: User;
}

export type SignedInState = Required<State>;

export function assertSignedIn(
  ctx: { state: State },
): asserts ctx is { state: SignedInState } {
  if (ctx.state.sessionUser === undefined) {
    throw new UnauthorizedError("User must be signed in");
  }
}

async function setSessionState(
  req: Request,
  ctx: FreshContext<State>,
) {
  if (ctx.destination !== "route") return await ctx.next();

  // Initial state
  ctx.state.sessionUser = undefined;

  const sessionId = getSessionId(req);
  if (sessionId === undefined) return await ctx.next();
  const userService = new UserService();
  const user = await userService.getUserBySession(sessionId);
  if (user === null) return await ctx.next();

  ctx.state.sessionUser = user;

  return await ctx.next();
}

async function ensureSignedIn(
  _req: Request,
  ctx: FreshContext<State>,
): Promise<Response> {
  try {
    assertSignedIn(ctx);
    return await ctx.next();
  } catch (_e: any) {
    return new Response("", {
      status: STATUS_CODE.TemporaryRedirect,
      headers: { Location: "/" },
    });
  }
}

/**
 * Adds middleware to the defined routes that ensures the client is signed-in
 * before proceeding. The {@linkcode ensureSignedIn} middleware throws an error
 * equivalent to the
 * {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401|HTTP 401 Unauthorized}
 * error if `ctx.state.sessionUser` is `undefined`.
 *
 * The thrown error is then handled by {@linkcode handleWebPageErrors}, or
 * {@linkcode handleRestApiErrors}, if the request is made to a REST API
 * endpoint.
 *
 * @see {@link https://fresh.deno.dev/docs/concepts/plugins|Plugins documentation}
 * for more information on Fresh's plugin functionality.
 */
export default {
  name: "session",
  middlewares: [
    {
      path: "/",
      middleware: { handler: setSessionState },
    },
    {
      path: "/posts/new",
      middleware: { handler: ensureSignedIn },
    },
    {
      path: "/posts/edit/[slug]",
      middleware: { handler: ensureSignedIn },
    },
    {
      path: "/notes/new",
      middleware: { handler: ensureSignedIn },
    },
    {
      path: "/notes/[id]",
      middleware: { handler: ensureSignedIn },
    },
    {
      path: "/notes/edit/[id]",
      middleware: { handler: ensureSignedIn },
    },
    {
      path: "/notes",
      middleware: { handler: ensureSignedIn },
    },
  ],
} as Plugin<State>;
