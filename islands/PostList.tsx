import { Post } from "@/utils/db.ts";
import IconUserCircle from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/user-circle.tsx";

export default function PostList(
  props: { posts: Deno.KvEntry<Post>[] | Post[] | undefined },
) {
  const { posts } = props;

  if (!posts) {
    return <h1>No Posts</h1>;
  }

  return (
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {posts.map((post) => (
        !(("value" in post) ? post.value.deleted : post.deleted)
          ? (
            <div
              key={("value" in post) ? post.value.id : post.id}
              class="border border-gray-300/70 hover:border-gray-900 hover:bg-gray-50 rounded-lg shadow-md shadow-gray-400/20 overflow-hidden"
            >
              <a
                href={`/posts/${
                  ("value" in post) ? post.value.slug : post.slug
                }`}
              >
                <div class="px-4 py-5 sm:px-6">
                  <h3 class="text-lg font-medium leading-6 text-gray-900">
                    {("value" in post) ? post.value.title : post.title}
                  </h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">
                    <IconUserCircle class="h-4 w-4 mr-1 inline" />
                    {("value" in post) ? post.value.userLogin : post.userLogin}
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
