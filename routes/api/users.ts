import { type Handlers } from "$fresh/server.ts";
import { STATUS_CODE } from "$std/http/status.ts";
import { getUser, updateUser } from "@/utils/db.ts";
import { BadRequestError } from "@/utils/http.ts";

export const handler: Handlers<undefined> = {
  async PUT(req, _ctx) {
    const body = await req.json();
    const headers = await req.headers;
    const token = headers.get("authorization");

    if (token !== `Bearer ${Deno.env.get("API_TOKEN")}`) {
      console.error("token: ", token, "API_TOKEN: ", Deno.env.get("API_TOKEN"));
      return new Response(null, { status: STATUS_CODE.Unauthorized });
    }

    const login = body.login;
    const user = await getUser(login);

    if (user) {
      if (body.role) {
        user.role = body.role;
      }

      await updateUser(user);
      return new Response(null, { status: STATUS_CODE.OK });
    } else {
      return new Response(null, { status: STATUS_CODE.NotFound });
    }
  },
};
