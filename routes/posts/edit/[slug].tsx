import { Handlers, PageProps } from "$fresh/server.ts";
import { PostService } from "@/services/PostService.ts";
import Error404 from "@/routes/_404.tsx";
import type { State } from "@/plugins/session.ts";
import type { Post } from "@/models/Post.ts";
import { PostEditor } from "@/islands/PostEditor.tsx";

interface Page {
  post: Post;
}

export const handler: Handlers<Page> = {
  async GET(_req, ctx) {
    const slug = ctx.params.slug;
    const postService = new PostService();
    const post = await postService.getPostBySlug(slug);

    if (post) {
      return ctx.render({
        post,
      });
    }

    return ctx.render(undefined);
  },
};

export default function EditPostPage({ data, state }: PageProps<Page | null>) {
  const { sessionUser }: State = state;

  if (!data) {
    return <Error404 />;
  }

  return (
    <>
      <PostEditor post={data.post} />
    </>
  );
}
