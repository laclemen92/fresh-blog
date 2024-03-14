import { Handlers, PageProps } from "$fresh/server.ts";
import { extract } from "$std/front_matter/yaml.ts";
import { CSS, render } from "$gfm";
import { Head } from "$fresh/runtime.ts";
import { getPostBySlug } from "@/utils/db.ts";

interface Page {
  markdown: string;
  data: Record<string, unknown>;
}

export const handler: Handlers<Page> = {
  async GET(_req, ctx) {
    const slug = ctx.params.slug;
    const post = await getPostBySlug(slug);

    if (post) {
      const { attrs, body } = extract(post.content);
      return ctx.render({ markdown: body, data: attrs });
    }

    return ctx.render(undefined);
  },
};

export default function MarkdownPage({ data }: PageProps<Page | null>) {
  if (!data) {
    return <h1>Post not found.</h1>;
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
