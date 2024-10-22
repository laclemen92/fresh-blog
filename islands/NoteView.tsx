import { CSS, render } from "$gfm";
import { Head } from "$fresh/runtime.ts";
import { Button } from "@/islands/Button.tsx";
import { useSignal } from "@preact/signals";
import { NoteEditor } from "@/islands/NoteEditor.tsx";
import type { Note } from "@/models/Note.ts";
import type { User } from "@/models/User.ts";
import IconHeart from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/heart.tsx";
import IconHeartFilled from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/heart-filled.tsx";
import { UserRoles } from "@/models/User.ts";

const formatNoteDate = (noteDate: Date) => {
  noteDate = new Date(noteDate);
  return `${
    noteDate.getMonth() + 1
  }/${noteDate.getDate()}/${noteDate.getFullYear()}`;
};

export default function NoteView(props: {
  data: {
    note: Note;
  };
  sessionUser: User | undefined;
}) {
  const { data, sessionUser } = props;
  const { note } = data;
  const isEditing = useSignal(false);

  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      <div class="flex flex-row-reverse gap-2">
        {sessionUser?.login === note.userLogin &&
            sessionUser?.role === UserRoles.ADMIN
          ? (
            <Button
              onClick={(e) => {
                isEditing.value = !isEditing.value;
              }}
              style="primary"
              type="anchor"
              htmlClass="float-right rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset"
              href={`/notes/edit/${note.id}`}
            >
              Edit
            </Button>
          )
          : null}
        {sessionUser?.login === note.userLogin &&
            sessionUser?.role === UserRoles.ADMIN
          ? (
            <Button
              onClick={async (e) => {
                const resp = await fetch(`/api/notes`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(note),
                });

                window.location.href = `/user/${sessionUser.login}/notes`;
              }}
              style="danger"
              type="button"
              htmlClass="float-right rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset"
            >
              Delete
            </Button>
          )
          : null}
      </div>

      {isEditing.value ? <NoteEditor note={note} /> : (
        <div
          class="markdown-body"
          dangerouslySetInnerHTML={{
            __html: render(
              "# ".concat(note.title).concat(
                `${
                  note && note?.createdAt
                    ? "\n###### Created on " + formatNoteDate(note.createdAt)
                    : ""
                }`,
              ).concat("\n\n").concat(note.content),
            ),
          }}
        />
      )}
    </>
  );
}
