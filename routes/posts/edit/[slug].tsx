import { Handlers, PageProps } from "$fresh/server.ts";
import { PostService } from "@/services/PostService.ts";
import Error404 from "@/routes/_404.tsx";
import type { Post } from "@/models/Post.ts";
import { Editor } from "@/islands/Editor.tsx";

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

export default function EditPostPage({ data }: PageProps<Page | null>) {
  if (!data) {
    return <Error404 />;
  }

  return (
    <>
      <Editor data={data.post} type={"post"} />
    </>
  );
}
