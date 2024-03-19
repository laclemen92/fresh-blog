import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { listPosts, Post } from "@/utils/db.ts";

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

  if (!posts) {
    return <h1>No Posts</h1>;
  }

  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post.value.slug}
            class="bg-white shadow overflow-hidden sm:rounded-lg"
          >
            <a href={`/posts/${post.value.slug}`}>
              <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                  {post.value.title}
                </h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                  {post.value.userLogin}
                </p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
