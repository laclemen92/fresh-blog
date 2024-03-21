import { Handlers, PageProps } from "$fresh/server.ts";
import { getPostBySlug, getVote } from "@/utils/db.ts";
import Error404 from "@/routes/_404.tsx";
import type { SignedInState, State } from "@/plugins/session.ts";
import type { Post } from "@/utils/db.ts";
import PostView from "@/islands/PostView.tsx";
import { countVotesByPost } from "@/utils/db.ts";

interface Page {
  post: Post;
  voteCount: number;
  voted: boolean;
}

export const handler: Handlers<Page, SignedInState> = {
  async GET(_req, ctx) {
    const slug = ctx.params.slug;
    const post = await getPostBySlug(slug);

    if (post) {
      const voteCount = await countVotesByPost(post.id);
      let voted = false;
      if (ctx.state.sessionUser?.login) {
        voted = await getVote(post.id, ctx.state.sessionUser.login)
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
