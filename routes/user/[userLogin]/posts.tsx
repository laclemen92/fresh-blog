import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { Post } from "@/models/Post.ts";
import { PostService } from "@/services/PostService.ts";
import PostList from "@/islands/PostList.tsx";

interface Props {
  posts: Deno.KvEntry<Post>[];
}

export const handler: Handlers<Props> = {
  async GET(_req, ctx) {
    const login = ctx.params.userLogin;
    const postService = new PostService();
    const iter = await postService.listPostsByUser(login, { reverse: true });
    const posts = [];

    for await (const res of iter) posts.push(res);

    if (posts) {
      return ctx.render({ posts });
    }

    return ctx.render(undefined);
  },
};

export default function Posts({ data }: PageProps<Props | null>) {
  const posts = data?.posts;

  if (!posts) {
    return <h1>No Posts</h1>;
  }

  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <PostList posts={posts} />
    </>
  );
}
