import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { listPosts, Post } from "@/utils/db.ts";
import PostList from "@/islands/PostList.tsx";

interface Props {
  posts: Deno.KvEntry<Post>[];
}

export const handler: Handlers<Props> = {
  async GET(_req, ctx) {
    const iter = await listPosts();
    const posts = [];

    for await (const res of iter) posts.push(res);

    if (posts) {
      return ctx.render({ posts });
    }

    return ctx.render(undefined);
  },
};

export default function Home({ data }: PageProps<Props | null>) {
  const posts = data?.posts;

  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <PostList posts={posts} />
    </>
  );
}
