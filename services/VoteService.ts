import { Vote, voteEntity } from "@/models/Vote.ts";
import { kv } from "@/utils/db.ts";
import { create, deleteKey, findMany, findUnique } from "@laclemen92/kvm";

export class VoteService {
  constructor() {
  }

  async createVote(vote: Vote) {
    vote.createdAt = new Date();
    const result = await create<Vote>(voteEntity, kv, vote);

    if (!result || !result?.value) throw new Error("Failed to create vote");
  }

  // can see if I vogted for a post, pass the postid and my userLogin. If I voted, return the vote, if not, return null
  async getVote(postId: string, userLogin: string) {
    const result = await findUnique<Vote>(voteEntity, kv, {
      postId,
      userLogin,
    });
    return result?.value;
  }

  async listVotedPostsForUser(
    userLogin: string,
    options?: Deno.KvListOptions,
  ) {
    return await findMany<string>(voteEntity, kv, {
      ...options,
      prefix: ["user", userLogin, "votes"], // how could I better do this? findManyBySecondaryIndex?
    });
  }

  async deleteVote(postId: string, userLogin: string) {
    await deleteKey<Vote>(voteEntity, kv, { postId, userLogin }, {
      cascadeDelete: true,
    });
    return;
  }

  async countVotesByPost(postId: string) {
    // probably won't work, I think list does 25 per page
    const votes = await findMany<Vote>(voteEntity, kv, {
      prefix: ["votes", postId],
    });

    return votes.length;
  }
}
