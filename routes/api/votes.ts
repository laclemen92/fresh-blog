import { type Handlers } from "$fresh/server.ts";
import { STATUS_CODE } from "$std/http/status.ts";
import type { SignedInState } from "@/plugins/session.ts";
import { VoteService } from "@/services/VoteService.ts";
import { BadRequestError } from "@/utils/http.ts";

export const handler: Handlers<undefined, SignedInState> = {
  async POST(req, ctx) {
    const body = await req.json();
    if (!body.postId) {
      throw new BadRequestError("PostId is required");
    }

    const vote = {
      postId: body.postId,
      userLogin: ctx.state.sessionUser.login,
    };

    const voteService = new VoteService();
    if (await voteService.getVote(vote.postId, vote.userLogin)) {
      await voteService.deleteVote(vote.postId, vote.userLogin);
    } else {
      await voteService.createVote(vote);
    }

    return new Response(null, { status: STATUS_CODE.OK });
  },
};
