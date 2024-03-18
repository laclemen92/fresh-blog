import { useSignal } from "@preact/signals";
import { Post } from "@/utils/db.ts";
import { Button } from "@/islands/Button.tsx";
import IconHeading from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/heading.tsx";
import IconBold from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/bold.tsx";
import IconItalic from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/italic.tsx";
import IconBlockquote from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/blockquote.tsx";
import IconCode from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/code.tsx";
import IconLink from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/link.tsx";
import { Tab } from "@headlessui/react";
import { CSS, render } from "$gfm";
import { Head } from "$fresh/runtime.ts";

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

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
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      <Tab.Group defaultIndex={0}>
        {({ selectedIndex }) => (
          <>
            <Tab.List
              className={"flex flex-row flex-none gap-3 items-center justify-between"}
            >
              <div class="flex gap-2">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      selected
                        ? "bg-gray-100 text-gray-900 hover:bg-gray-200 outline-none"
                        : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                      "rounded-md border border-transparent px-3 py-2 text-sm font-semibold",
                    )}
                >
                  Write
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      selected
                        ? "bg-gray-100 text-gray-900 hover:bg-gray-200 outline-none"
                        : "bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                      "rounded-md border border-transparent px-3 py-2 text-sm font-semibold",
                    )}
                >
                  Preview
                </Tab>
              </div>
              {/* <Button type="button" style="secondary" htmlClass="float-right"> */}
              {selectedIndex === 0
                ? (
                  <div class="flex gap-2">
                    <button
                      type="button"
                      class="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                    >
                      <IconHeading class="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      class="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                    >
                      <IconBold class="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      class="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                    >
                      <IconItalic class="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      class="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                    >
                      <IconBlockquote class="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      class="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                    >
                      <IconCode class="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      class="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                    >
                      <IconLink class="h-5 w-5" />
                    </button>
                  </div>
                )
                : null}
            </Tab.List>
            <Tab.Panels className={"flex grow"}>
              <Tab.Panel className={"flex grow"}>
                <div class="flex grow">
                  <textarea
                    class="block w-full grow rounded-md border-0 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:ring-0 focus:outline-2 focus:outline-gray-900 sm:text-sm sm:leading-6 resize-none scroll-smooth"
                    placeholder="Put your post in some awesome markdown here!"
                    onKeyPress={handleMarkdownChange}
                    onPaste={handleMarkdownChange}
                    onInput={handleMarkdownChange}
                  >
                    {content.value}
                  </textarea>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div
                  class="markdown-body"
                  dangerouslySetInnerHTML={{ __html: render(content.value) }}
                />
              </Tab.Panel>
            </Tab.Panels>
          </>
        )}
      </Tab.Group>
      <div class="flex-none">
        <Button
          onClick={handleSubmit}
          style="primary"
          type="button"
          htmlClass="float-right"
        >
          Post
        </Button>
      </div>
    </>
  );
}
