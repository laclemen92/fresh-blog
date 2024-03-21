import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { listPosts, Post } from "@/utils/db.ts";
import PostList from "@/islands/PostList.tsx";
import { getPost, listVotedPostsForUser } from "@/utils/db.ts";
import { SignedInState } from "@/plugins/session.ts";

interface Props {
  posts: Post[];
}

export const handler: Handlers<Props, SignedInState> = {
  async GET(_req, ctx) {
    const iter = await listVotedPostsForUser(ctx.state.sessionUser.login, {
      reverse: true,
    });
    const posts = [];

    for await (const res of iter) {
      const post = await getPost(res.value);
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
