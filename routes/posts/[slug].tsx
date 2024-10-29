import { Handlers, PageProps } from "$fresh/server.ts";
import { PostService } from "@/services/PostService.ts";
import Error404 from "@/routes/_404.tsx";
import type { SignedInState, State } from "@/plugins/session.ts";
import type { Post } from "@/models/Post.ts";
import PostView from "@/components/PostView.tsx";
import { VoteService } from "@/services/VoteService.ts";

interface Page {
  post: Post;
  voteCount: number;
  voted: boolean;
}

export const handler: Handlers<Page, SignedInState> = {
  async GET(_req, ctx) {
    const slug = ctx.params.slug;
    const postService = new PostService();
    const post = await postService.getPostBySlug(slug);

    if (post) {
      const voteService = new VoteService();
      const voteCount = await voteService.countVotesByPost(post.id);
      let voted = false;
      if (ctx.state.sessionUser?.login) {
        voted = await voteService.getVote(post.id, ctx.state.sessionUser.login)
          ? true
          : false;
      }
      return ctx.render({
        post,
        voteCount: voteCount || 0,
        voted,
      });
    }

    return ctx.render(undefined);
  },
};

export default function MarkdownPage({ data, state }: PageProps<Page | null>) {
  const { sessionUser }: State = state;

  if (!data) {
    return <Error404 />;
  }

  return (
    <>
      <PostView data={data} sessionUser={sessionUser} />
    </>
  );
}
