import { useSignal } from "@preact/signals";
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
import { slug } from "https://deno.land/x/slug@v1.1.0/mod.ts";

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export function PostEditor(props: { post?: Post }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const content = props?.post?.content
    ? useSignal(props.post.content)
    : useSignal("");
  const value = content.value;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const title = titleRef.current?.value || "";
    const postSlug = slug(title);
    const post: Omit<Post, "id" | "userLogin"> = {
      title,
      url: postSlug,
      slug: postSlug,
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
      {/* <form class="flex flex-col flex-1 gap-3 grow" onSubmit={handleSubmit}> */}
      <Tab.Group defaultIndex={0}>
        {({ selectedIndex }) => (
          <>
            <label htmlFor="title" className="sr-only">
              Email
            </label>
            <input
              type="text"
              name="title"
              id="title"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:ring-0 focus:outline-2 focus:outline-gray-900 sm:text-sm sm:leading-6"
              placeholder="Post title"
              ref={titleRef}
            />
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
              {selectedIndex === 0
                ? (
                  <div class="flex gap-2">
                    <Button
                      onClick={addNewHeading}
                      type="button"
                      htmlClass="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                      tooltip={true}
                      tooltipContent="Heading"
                      tooltipId="tooltip-heading"
                    >
                      <IconHeading
                        data-tooltip-target="tooltip-heading"
                        class="h-5 w-5"
                      />
                    </Button>
                    <Button
                      type="button"
                      htmlClass="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                      tooltip={true}
                      tooltipContent="Bold"
                      tooltipId="tooltip-bold"
                      onClick={addBold}
                    >
                      <IconBold
                        data-tooltip-target="tooltip-bold"
                        class="h-5 w-5"
                      />
                    </Button>
                    <Button
                      type="button"
                      htmlClass="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                      tooltip={true}
                      tooltipContent="Italics"
                      tooltipId="tooltip-italics"
                      onClick={addItalics}
                    >
                      <IconItalic
                        data-tooltip-target="tooltip-italics"
                        class="h-5 w-5"
                      />
                    </Button>
                    <Button
                      type="button"
                      htmlClass="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                      tooltip={true}
                      tooltipContent="Quote"
                      tooltipId="tooltip-quote"
                      onClick={addQuote}
                    >
                      <IconBlockquote
                        data-tooltip-target="tooltip-quote"
                        class="h-5 w-5"
                      />
                    </Button>
                    <Button
                      type="button"
                      htmlClass="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                      tooltip={true}
                      tooltipContent="Code"
                      tooltipId="tooltip-code"
                      onClick={addCode}
                    >
                      <IconCode
                        data-tooltip-target="tooltip-code"
                        class="h-5 w-5"
                      />
                    </Button>
                    <Button
                      type="button"
                      htmlClass="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                      tooltip={true}
                      tooltipContent="Link"
                      tooltipId="tooltip-link"
                      onClick={addLink}
                    >
                      <IconLink
                        data-tooltip-target="tooltip-link"
                        class="h-5 w-5"
                      />
                    </Button>
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
          htmlClass="float-right rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset"
        >
          Post
        </Button>
      </div>
      {/* </form> */}
    </>
  );
}
