import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { Post } from "@/models/Post.ts";
import PostList from "@/components/PostList.tsx";
import { PostService } from "@/services/PostService.ts";
import { VoteService } from "@/services/VoteService.ts";
import { SignedInState } from "@/plugins/session.ts";

interface Props {
  posts: Post[];
}

export const handler: Handlers<Props, SignedInState> = {
  async GET(_req, ctx) {
    const voteService = new VoteService();
    const iter = await voteService.listVotedPostsForUser(
      ctx.state.sessionUser.login,
      {
        reverse: true,
      },
    );
    const posts = [];

    const postService = new PostService();
    for await (const res of iter) {
      const post = await postService.getPost(res.value);
      if (post) {
        posts.push(post);
      }
    }

    if (posts) {
      return ctx.render({ posts });
    }

    return ctx.render(undefined);
  },
};

export default function Favorites({ data }: PageProps<Props | null>) {
  const posts = data?.posts;

  if (!posts) {
    return <h1>No Favorites</h1>;
  }

  return (
    <>
      <Head>
        <title>Favorites</title>
      </Head>
      <PostList posts={posts} />
    </>
  );
}
