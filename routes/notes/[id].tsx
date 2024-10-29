import { Handlers, PageProps } from "$fresh/server.ts";
import { NoteService } from "@/services/NoteService.ts";
import Error404 from "@/routes/_404.tsx";
import type { SignedInState, State } from "@/plugins/session.ts";
import type { Note } from "@/models/Note.ts";
import NoteView from "@/components/NoteView.tsx";

interface Page {
  note: Note;
}

export const handler: Handlers<Page, SignedInState> = {
  async GET(_req, ctx) {
    const id = ctx.params.id;
    const noteService = new NoteService();
    const note = await noteService.getNote(id);

    if (note) {
      if (note.userLogin !== ctx.state.sessionUser.login) {
        return ctx.render(undefined);
      }
      return ctx.render({
        note,
      });
    }

    return ctx.render(undefined);
  },
};

export default function MarkdownPage({ data, state }: PageProps<Page | null>) {
  const { sessionUser }: State = state;

  if (!data) {
    return <Error404 />;
  }

  return (
    <>
      <NoteView data={data} sessionUser={sessionUser} />
    </>
  );
}
