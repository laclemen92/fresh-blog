import { Handlers, PageProps } from "$fresh/server.ts";
import { getPost } from "@/utils/db.ts";
import Error404 from "@/routes/_404.tsx";
import type { State } from "@/plugins/session.ts";
import type { Post } from "@/utils/db.ts";
import PostView from "@/islands/PostView.tsx";

interface Page {
  post: Post;
}

export const handler: Handlers<Page> = {
  async GET(_req, ctx) {
    const slug = ctx.params.slug;
    const post = await getPost(slug);

    if (post) {
      return ctx.render({
        post,
      });
    }

    return ctx.render(undefined);
  },
};

export default function MarkdownPage({ data, state }: PageProps<Page | null>) {
  const { sessionUser }: State = state;

  if (!data) {
    return <Error404 />;
  }

  return (
    <>
      <PostView data={data} sessionUser={sessionUser} />
    </>
  );
}
