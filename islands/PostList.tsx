import { Post } from "@/utils/db.ts";

export default function PostList(
  props: { posts: Deno.KvEntry<Post>[] | undefined },
) {
  const { posts } = props;

  if (!posts) {
    return <h1>No Posts</h1>;
  }

  return (
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        !post.value.deleted
          ? (
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
          )
          : null
      ))}
    </div>
  );
}
