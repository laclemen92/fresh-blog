import { Handlers, PageProps } from "$fresh/server.ts";
import { CSS, render } from "$gfm";
import { Head } from "$fresh/runtime.ts";
import { getPost } from "@/utils/db.ts";
import Error404 from "@/routes/_404.tsx";

interface Page {
  markdown: string;
}

export const handler: Handlers<Page> = {
  async GET(_req, ctx) {
    const slug = ctx.params.slug;
    const post = await getPost(slug);

    if (post) {
      return ctx.render({ markdown: post.content });
    }

    return ctx.render(undefined);
  },
};

export default function MarkdownPage({ data }: PageProps<Page | null>) {
  if (!data) {
    return <Error404 />;
  }

  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      <main>
        {/* <div>{JSON.stringify(data.data)}</div> */}
        <div
          class="markdown-body"
          dangerouslySetInnerHTML={{ __html: render(data?.markdown) }}
        />
      </main>
    </>
  );
}
