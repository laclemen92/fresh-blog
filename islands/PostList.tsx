import { Post } from "@/models/Post.ts";
import IconUserCircle from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/user-circle.tsx";

const formatPostDate = (postDate: Date) => {
  return `${
    postDate.getMonth() + 1
  }/${postDate.getDate()}/${postDate.getFullYear()}`;
};

function isDenoPost(
  post: Post | Deno.KvEntry<Post>,
): post is Deno.KvEntry<Post> {
  return (post as Deno.KvEntry<Post>).value !== undefined;
}

export default function PostList(
  props: { posts: Deno.KvEntry<Post>[] | Post[] | undefined },
) {
  const { posts } = props;

  if (!posts) {
    return <h1>No Posts</h1>;
  }

  return (
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {posts.map((post) => {
        post = isDenoPost(post) ? post.value : post;

        return (!post.deleted
          ? (
            <div
              key={post.id}
              class="border border-gray-300/70 hover:border-gray-900 hover:bg-gray-50 rounded-lg shadow-md shadow-gray-400/20 overflow-hidden"
            >
              <a
                href={`/posts/${post.slug}`}
              >
                <div class="px-4 py-5 sm:px-6">
                  <h3 class="text-lg font-medium leading-6 text-gray-900">
                    {post.title}
                  </h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">
                    {post && post?.createdAt
                      ? formatPostDate(post.createdAt)
                      : null}
                  </p>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500">
                    <IconUserCircle class="h-4 w-4 mr-1 inline" />
                    {post.userLogin}
                  </p>
                </div>
              </a>
            </div>
          )
          : null);
      })}
    </div>
  );
}
