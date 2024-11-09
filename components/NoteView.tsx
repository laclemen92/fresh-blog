import { CSS, render } from "$gfm";
import { Head } from "$fresh/runtime.ts";
import { Button } from "@/islands/Button.tsx";
import { useSignal } from "@preact/signals";
import { Editor } from "@/islands/Editor.tsx";
import type { Note } from "@/models/Note.ts";
import type { User } from "@/models/User.ts";
import { UserRoles } from "@/models/User.ts";
import { DeleteNote } from "@/islands/DeleteNote.tsx";

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
              onClick={(_e: Event) => {
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
            <DeleteNote
              note={note}
              redirect={`/notes`}
            />
          )
          : null}
      </div>

      {isEditing.value ? <Editor data={note} type={"note"} /> : (
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
              {
                allowedTags: ["input"],
                allowedAttributes: {
                  input: ["checked", "disabled", {
                    name: "type",
                    values: ["checkbox"],
                  }],
                },
              },
            ).replaceAll(
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
      )}
    </>
  );
}
