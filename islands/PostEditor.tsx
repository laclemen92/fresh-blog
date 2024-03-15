import { useSignal } from "@preact/signals";
import { Post } from "@/utils/db.ts";

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
  };

  const handleMarkdownChange = (e: Event) => {
    content.value = (e?.target as HTMLInputElement)?.value;
  };

  return (
    <form action="#">
      <div>
        <div class="flex items-center">
          <div>Welcome</div>
          <div class="ml-auto flex items-center space-x-5">
            <div class="flex items-center">
              <button
                type="button"
                class="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
              >
                <span class="sr-only">Insert link</span>
                <svg
                  class="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
                  <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="mt-2">
          <div class="-m-0.5 rounded-lg p-0.5">
            <div>
              <textarea
                class="block w-full h-96 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
        <button
          onClick={handleSubmit}
          class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Post
        </button>
      </div>
    </form>
  );
}
