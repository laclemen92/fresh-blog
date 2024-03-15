import { useSignal } from "@preact/signals";
import { Post } from "@/utils/db.ts";
import { Button } from "@/components/Button.tsx";
import IconCode from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/code.tsx";

export function PostEditor() {
  const content = useSignal("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const post: Omit<Post, "id" | "userLogin"> = {
      title: "Hello World",
      url: "hello-world",
      slug: "hello-world",
      content: content.value,
    };

    const resp = await fetch(`/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    window.location.href = `/posts/${post.slug}`;
  };

  const handleMarkdownChange = (e: Event) => {
    content.value = (e?.target as HTMLInputElement)?.value;
  };

  return (
    <div class="grid grid-rows-8 grid-cols-8 gap-4 auto-cols-max">
      <div class="col-start-2 col-end-4">Welcome</div>
      <div class="col-end-8 col-span-1">
        <Button type="button" style="secondary" htmlClass="float-right">
          <IconCode class="h-6 w-6" />
        </Button>
      </div>
      <div class="row-start-2 row-end-8 col-start-2 col-end-8">
        <textarea
          class="block w-full h-full rounded-md border-0 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:ring-0 focus:outline-2 focus:outline-indigo-600 sm:text-sm sm:leading-6 resize-none scroll-smooth"
          placeholder="Put your post in some awesome markdown here!"
          onKeyPress={handleMarkdownChange}
          onPaste={handleMarkdownChange}
          onInput={handleMarkdownChange}
        >
        </textarea>
      </div>
      <div class="row-start-8 col-end-8 col-span-1">
        <Button
          onClick={handleSubmit}
          style="primary"
          type="button"
          htmlClass="float-right"
        >
          Post
        </Button>
      </div>
    </div>
  );
}
