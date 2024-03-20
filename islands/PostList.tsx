import { Post } from "@/utils/db.ts";
import IconUserCircle from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/user-circle.tsx";

export default function PostList(
  props: { posts: Deno.KvEntry<Post>[] | undefined },
) {
  const { posts } = props;

  if (!posts) {
    return <h1>No Posts</h1>;
  }

  return (
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {posts.map((post) => (
        !post.value.deleted
          ? (
            <div
              key={post.value.id}
              class="border border-gray-300/70 hover:border-gray-900 hover:bg-gray-50 rounded-lg shadow-md shadow-gray-400/20 overflow-hidden"
            >
              <a href={`/posts/${post.value.slug}`}>
                <div class="px-4 py-5 sm:px-6">
                  <h3 class="text-lg font-medium leading-6 text-gray-900">
                    {post.value.title}
                  </h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">
                    <IconUserCircle class="h-4 w-4 mr-1 inline" />
                    {post.value.userLogin}
                  </p>
                </div>
              </a>
            </div>
          )
          : null
      ))}
    </div>
  );
}
