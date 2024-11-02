import { useSignal } from "@preact/signals";
import { useRef } from "preact/hooks";
import { Note } from "@/models/Note.ts";
import { Post } from "@/models/Post.ts";
import { Button } from "@/islands/Button.tsx";
import IconHeading from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/heading.tsx";
import IconBold from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/bold.tsx";
import IconItalic from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/italic.tsx";
import IconBlockquote from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/blockquote.tsx";
import IconCode from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/code.tsx";
import IconLink from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/link.tsx";
import IconList from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/list.tsx";
import IconListCheck from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/list-check.tsx";
import IconListNumbers from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/list-numbers.tsx";
import IconPencil from "https://deno.land/x/tabler_icons_tsx@0.0.7/tsx/pencil.tsx";
import IconEye from "https://deno.land/x/tabler_icons_tsx@0.0.7/tsx/eye.tsx";
import IconFileUpload from "https://deno.land/x/tabler_icons_tsx@0.0.7/tsx/file-upload.tsx";
import { Tab } from "@headlessui/react";
import { CSS, render } from "$gfm";
import { Head } from "$fresh/runtime.ts";
import { slug } from "https://esm.sh/v135/github-slugger@2.0.0/index.js";

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export function Editor(props: { data?: Note | Post; type: string }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const content = props?.data?.content
    ? useSignal(props.data.content)
    : useSignal("");
  const title = props?.data?.title
    ? useSignal(props.data.title)
    : useSignal("");
  // const titleValue = title.value;
  const value = content.value;
  const isEditing = props?.data ? useSignal(true) : useSignal(false);
  const specialType = useSignal("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const title = titleRef.current?.value || "";
    const toPost: Partial<Post> & Partial<Note> = {
      title,
      content: content.value,
      id: props.data?.id || undefined,
    };
    if (props.type === "post") {
      const postSlug = slug(title);
      toPost.slug = postSlug;
      toPost.url = postSlug;
    }

    const url = props.type === "post" ? `posts` : `notes`;

    const resp = await fetch(`/api/${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toPost),
    });

    const updated = await resp.json();

    if (props.type === "note") {
      window.location.href = `/${url}/${updated.id}`;
    } else {
      window.location.href = `/${url}/${updated.slug}`;
    }
  };

  const handleContentKeyPress = (e: KeyboardEvent) => {
    content.value = (e?.target as HTMLInputElement)?.value;

    const value = textareaRef.current?.value || "";
    const currentLineIndex = value.lastIndexOf(
      "\n",
      (textareaRef.current?.selectionStart || 0) - 1,
    ) + 1;
    const currentLine = textareaRef.current?.value.substring(
      currentLineIndex,
      textareaRef.current?.selectionStart,
    );

    if (e.key === "Enter") {
      if (currentLine?.trimStart().startsWith("*")) {
        e.preventDefault();
        setTextAreaHelper("\n* ", 3);
      }

      if (
        currentLine?.trimStart().startsWith("- [ ]") ||
        currentLine?.trimStart().startsWith("- [x]")
      ) {
        e.preventDefault();
        setTextAreaHelper("\n- [ ] ", 7);
      }
    }
  };

  const handleContentInput = (e: Event) => {
    content.value = (e?.target as HTMLInputElement)?.value;
  };

  const handleContentPaste = async (e: ClipboardEvent) => {
    if (e?.clipboardData?.items) {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.kind === "file" && item.type.indexOf("image") > -1) {
          const file = item.getAsFile();

          if (file) {
            const formData = new FormData();
            formData.append("blob", file);
            const response = await fetch(`/api/images`, {
              method: "POST",
              body: formData,
            });
            const data = await response.json();

            const dimensions: { width: number; height: number } =
              await getPhotoDimensions(file);

            const imageTag = `<img alt="${file.name}" width="${
              dimensions.width / 2
            }" src="${data.imageUrl}"></img>\n`;
            setTextAreaHelper(imageTag, imageTag.length);
          }
        }
      }
    }
    content.value = (e?.target as HTMLInputElement)?.value;
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  function getPhotoDimensions(
    file: File,
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };

        img.onerror = (err) => {
          reject(err);
        };

        img.src = e.target?.result?.toString() || "";
      };

      reader.readAsDataURL(file);
    });
  }

  const doFile = async (file: File) => {
    if (file.type.indexOf("image") > -1) {
      const formData = new FormData();
      formData.append("blob", file);
      const response = await fetch(`/api/images`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      const dimensions: { width: number; height: number } =
        await getPhotoDimensions(file);

      const imageTag = `<img alt="${file.name}" width="${
        dimensions.width / 2
      }" src="${data.imageUrl}"></img>\n`;
      setTextAreaHelper(imageTag, imageTag.length);
    } else {
      const formData = new FormData();
      formData.append("blob", file);
      const response = await fetch(`/api/images`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      const linkTag = `[${file.name}](${data.imageUrl})`;
      setTextAreaHelper(linkTag, linkTag.length);
    }

    if (textareaRef.current?.value) {
      content.value = textareaRef.current?.value;
    }
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();

    if (e.dataTransfer) {
      const file = e.dataTransfer.files[0];

      await doFile(file);
    } else {
      content.value = (e?.target as HTMLInputElement)?.value;
    }
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

  const addBulletPoint = (e: Event) => {
    setTextAreaHelper(`* `, 2);
    specialType.value = "bullet";
  };

  const addCheckbox = (e: Event) => {
    setTextAreaHelper(`- [ ] `, 4);
    specialType.value = "checkbox";
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

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];

    if (file) {
      await doFile(file);

      // Reset the file input
      if (inputRef.current?.value) {
        inputRef.current.value = "";
      }
    }
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
              disabled={isEditing.value}
              value={title}
              type="text"
              name="title"
              id="title"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 outline outline-1 outline-gray-300 placeholder:text-gray-400 focus:ring-0 focus:outline-2 focus:outline-gray-900 sm:text-sm sm:leading-6"
              placeholder={`${props.type === "post" ? "Post" : "Note"} title`}
              ref={titleRef}
              onChange={(e: Event) => {
                title.value = (e?.target as HTMLInputElement)?.value;
              }}
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
                  <span className="hidden sm:inline">Write</span>
                  <span className="sm:hidden">
                    <IconPencil class="h-5 w-5" />
                  </span>
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
                  <span className="hidden md:inline">Preview</span>
                  <span className="md:hidden">
                    <IconEye class="h-5 w-5" />
                  </span>
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
                      ariaLabel="Add Heading"
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
                      ariaLabel="Add Bold"
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
                      ariaLabel="Add Italics"
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
                      ariaLabel="Add Quote"
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
                      ariaLabel="Add Code"
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
                      ariaLabel="Add Link"
                    >
                      <IconLink
                        data-tooltip-target="tooltip-link"
                        class="h-5 w-5"
                      />
                    </Button>
                    <Button
                      onClick={addBulletPoint}
                      type="button"
                      htmlClass="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                      tooltip={true}
                      tooltipContent="Unordered List"
                      tooltipId="tooltip-list"
                      ariaLabel="Add Bullet List"
                    >
                      <IconList
                        data-tooltip-target="tooltip-list"
                        class="h-5 w-5"
                      />
                    </Button>
                    <Button
                      onClick={addCheckbox}
                      type="button"
                      htmlClass="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                      tooltip={true}
                      tooltipContent="Checklist"
                      tooltipId="tooltip-list-check"
                      ariaLabel="Add Task List"
                    >
                      <IconListCheck
                        data-tooltip-target="tooltip-list-check"
                        class="h-5 w-5"
                      />
                    </Button>
                    <input
                      type="file"
                      ref={inputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    <Button
                      onClick={() => inputRef.current?.click()}
                      type="button"
                      htmlClass="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                      tooltip={true}
                      tooltipContent="Upload file"
                      tooltipId="tooltip-upload-file"
                      ariaLabel="Upload a file"
                    >
                      <IconFileUpload
                        data-tooltip-target="tooltip-upload-file"
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
                    placeholder={`Put your ${
                      props.type === "post" ? "post" : "note"
                    } in some awesome markdown here!`}
                    onKeyDown={handleContentKeyPress}
                    onPaste={handleContentPaste}
                    onInput={handleContentInput}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    // clipboard-accept="text/plain"
                    ref={textareaRef}
                  >
                    {value}
                  </textarea>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div
                  class="markdown-body"
                  dangerouslySetInnerHTML={{
                    __html: render(content.value, {
                      allowedTags: ["input"],
                      allowedAttributes: {
                        input: ["checked", "disabled", {
                          name: "type",
                          values: ["checkbox"],
                        }],
                      },
                    }).replaceAll(
                      "<a href",
                      `<a target="_blank" href`,
                    ).replaceAll(
                      `<li><input checked disabled type="checkbox"`,
                      `<li style="list-style-type: none;"><input checked disabled type="checkbox"`,
                    ).replaceAll(
                      `<li><input disabled type="checkbox"`,
                      `<li style="list-style-type: none;"><input disabled type="checkbox"`,
                    ),
                  }}
                />
              </Tab.Panel>
            </Tab.Panels>
          </>
        )}
      </Tab.Group>
      <div class="flex flex-row-reverse gap-2">
        <Button
          onClick={handleSubmit}
          style="primary"
          type="button"
          htmlClass="rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset"
        >
          {isEditing ? "Save" : "Create"}
        </Button>
        <Button
          onClick={(e) => {
          }}
          style="secondary"
          type="anchor"
          htmlClass="rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset"
          href={`/${
            props.type === "post" ? "posts" : "notes"
          }/${props.data?.id}`}
        >
          Discard
        </Button>
      </div>
      {/* </form> */}
    </>
  );
}
