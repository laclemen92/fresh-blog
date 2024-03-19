import { signal, useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";
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
  // const cursorPosition = useSignal(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const content = useSignal("");
  const value = content.value;

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

  const setTextAreaHelper = (newText: string, newCursorPosition: number) => {
    textareaRef.current?.setRangeText(newText);

    const start = textareaRef.current?.selectionStart || 0;

    textareaRef.current?.focus();
    textareaRef.current?.setSelectionRange(
      start + newCursorPosition,
      start + newCursorPosition,
    );
  };

  const addNewHeading = (e: Event) => {
    setTextAreaHelper(`### `, 4);
  };

  const addBold = (e: Event) => {
    setTextAreaHelper(`****`, 2);
  };

  const addItalics = (e: Event) => {
    setTextAreaHelper(`__`, 1);
  };

  const addQuote = (e: Event) => {
    setTextAreaHelper(`\n> \n`, 3);
  };

  const addCode = (e: Event) => {
    setTextAreaHelper("``", 1);
  };

  const addLink = (e: Event) => {
    setTextAreaHelper("[](url)", 1);
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
                      onClick={addNewHeading}
                    >
                      <IconHeading class="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      class="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                      onClick={addBold}
                    >
                      <IconBold class="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      class="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                      onClick={addItalics}
                    >
                      <IconItalic class="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      class="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                      onClick={addQuote}
                    >
                      <IconBlockquote class="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      class="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                      onClick={addCode}
                    >
                      <IconCode class="h-5 w-5" />
                    </button>
                    <button
                      type="button"
                      class="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                      onClick={addLink}
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
                    ref={textareaRef}
                  >
                    {value}
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
