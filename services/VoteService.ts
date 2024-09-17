import { Vote } from "@/models/Vote.ts";
import { kv } from "@/utils/db.ts";

export class VoteService {
  constructor() {
  }

  async createVote(vote: Vote) {
    vote.createdAt = new Date();
    const votesKey = ["votes", vote.postId, vote.userLogin];
    const userVotesKey = ["user", vote.userLogin, "votes", vote.postId];

    const res = await kv.atomic()
      .check({ key: votesKey, versionstamp: null })
      .check({ key: userVotesKey, versionstamp: null })
      .set(votesKey, vote)
      .set(userVotesKey, vote.postId)
      .commit();

    if (!res.ok) throw new Error("Failed to create vote");
  }

  // can see if I vogted for a post, pass the postid and my userLogin. If I voted, return the vote, if not, return null
  async getVote(postId: string, userLogin: string) {
    const res = await kv.get<Vote>(["votes", postId, userLogin]);
    return res.value;
  }

  async listVotedPostsForUser(
    userLogin: string,
    options?: Deno.KvListOptions,
  ) {
    return await kv.list<string>(
      { prefix: ["user", userLogin, "votes"] },
      options,
    );
  }

  async deleteVote(postId: string, userLogin: string) {
    const votesKey = ["votes", postId, userLogin];
    const userVotesKey = ["user", userLogin, "votes", postId];

    await kv.delete(votesKey);
    await kv.delete(userVotesKey);
    return;
  }

  async countVotesByPost(postId: string) {
    const votesList = await kv.list<Vote>({ prefix: ["votes", postId] });
    const votes = [];
    for await (const vote of votesList) votes.push(vote);

    return votes.length;
  }
}
