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
    <form action="/">
      <div>
        <div class="flex items-center">
          <div>Welcome</div>
          <div class="ml-auto flex items-center space-x-5">
            <div class="flex items-center">
              <Button type="button" style="secondary">
                <IconCode class="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
        <div class="mt-2">
          <div class="-m-0.5 rounded-lg p-0.5">
            <div>
              <textarea
                class="block w-full h-96 rounded-md border-0 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:ring-0 focus:outline-2 focus:outline-indigo-600 sm:text-sm sm:leading-6 resize-none scroll-smooth"
                placeholder="Put your post in some awesome markdown here!"
                onKeyPress={handleMarkdownChange}
                onPaste={handleMarkdownChange}
                onInput={handleMarkdownChange}
              >
              </textarea>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-2 flex justify-end">
        <Button onClick={handleSubmit} style="primary" type="button">
          Post
        </Button>
      </div>
    </form>
  );
}
