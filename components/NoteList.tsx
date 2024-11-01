import { Note } from "@/models/Note.ts";
import IconUserCircle from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/user-circle.tsx";
import { Button } from "@/islands/Button.tsx";

const formatNoteDate = (noteDate: Date) => {
  noteDate = new Date(noteDate);
  return `${
    noteDate.getMonth() + 1
  }/${noteDate.getDate()}/${noteDate.getFullYear()}`;
};

function isDenoNote(
  note: Note | Deno.KvEntry<Note>,
): note is Deno.KvEntry<Note> {
  return (note as Deno.KvEntry<Note>).value !== undefined;
}

export default function NoteList(
  props: { notes: Deno.KvEntry<Note>[] | Note[] | undefined },
) {
  const { notes } = props;

  if (!notes) {
    return (
      <div>
        <Button
          style="primary"
          type="anchor"
          htmlClass="float-right rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset"
          href={`/notes/new`}
        >
          New Note
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div class="flex flex-row-reverse gap-2 mb-2">
        <Button
          style="primary"
          type="anchor"
          htmlClass="float-right rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset"
          href={`/notes/new`}
        >
          New Note
        </Button>
      </div>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {notes.map((note) => {
          note = isDenoNote(note) ? note.value : note;

          return (note && !note.deleted
            ? (
              <div
                key={note.id}
                class="border border-gray-300/70 hover:border-gray-900 hover:bg-gray-50 rounded-lg shadow-md shadow-gray-400/20 overflow-hidden"
              >
                <a
                  href={`/notes/${note.id}`}
                >
                  <div class="px-4 py-5 sm:px-6">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                      {note.title}
                    </h3>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">
                      {note && note?.createdAt
                        ? formatNoteDate(note.createdAt)
                        : null}
                    </p>
                    <p class="mt-1 max-w-2xl text-sm text-gray-500">
                      <IconUserCircle class="h-4 w-4 mr-1 inline" />
                      {note.userLogin}
                    </p>
                  </div>
                </a>
              </div>
            )
            : null);
        })}
      </div>
    </div>
  );
}
