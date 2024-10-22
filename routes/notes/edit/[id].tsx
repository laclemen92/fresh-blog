import { Handlers, PageProps } from "$fresh/server.ts";
import { NoteService } from "@/services/NoteService.ts";
import Error404 from "@/routes/_404.tsx";
import type { State } from "@/plugins/session.ts";
import type { Note } from "@/models/Note.ts";
import { NoteEditor } from "@/islands/NoteEditor.tsx";

interface Page {
  note: Note;
}

export const handler: Handlers<Page> = {
  async GET(_req, ctx) {
    const id = ctx.params.id;
    const noteService = new NoteService();
    const note = await noteService.getNote(id);

    if (note) {
      return ctx.render({
        note,
      });
    }

    return ctx.render(undefined);
  },
};

export default function EditNotePage({ data, state }: PageProps<Page | null>) {
  const { sessionUser }: State = state;

  if (!data) {
    return <Error404 />;
  }

  return (
    <>
      <NoteEditor note={data.note} />
    </>
  );
}
