import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { Note } from "@/models/Note.ts";
import { NoteService } from "@/services/NoteService.ts";
import NoteList from "@/components/NoteList.tsx";
import { SignedInState, State } from "@/plugins/session.ts";
import Error404 from "@/routes/_404.tsx";

interface Props {
  notes: Deno.KvEntry<Note>[];
}

export const handler: Handlers<Props, SignedInState> = {
  async GET(_req, ctx) {
    const noteService = new NoteService();
    if (!ctx.state?.sessionUser?.login) {
      return ctx.render(undefined);
    }
    const notes = await noteService.listNotesForUser(
      ctx.state.sessionUser.login,
      { reverse: true, limit: 1000 },
    );

    if (notes) {
      return ctx.render({ notes });
    }

    return ctx.render(undefined);
  },
};

export default function Notes({ data, state }: PageProps<Props | null>) {
  const { sessionUser }: State = state;
  if (!sessionUser) {
    return <Error404 />;
  }

  const notes = data?.notes;

  if (!notes) {
    return <h1>No Notes</h1>;
  }

  return (
    <>
      <Head>
        <title>Notes</title>
      </Head>
      <NoteList notes={notes} />
    </>
  );
}
