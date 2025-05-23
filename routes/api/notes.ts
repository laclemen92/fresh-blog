import { type Handlers } from "$fresh/server.ts";
import { STATUS_CODE } from "$std/http/status.ts";
import type { SignedInState } from "@/plugins/session.ts";
import { NoteService } from "@/services/NoteService.ts";
import { ulid } from "$std/ulid/mod.ts";
import { BadRequestError } from "@/utils/http.ts";
import { Note } from "@/models/Note.ts";

export const handler: Handlers<undefined, SignedInState> = {
  async DELETE(req, ctx) {
    const body = await req.json();
    const noteService = new NoteService();
    const currentNote = await noteService.getNote(body.id);

    if (!currentNote) {
      return Response.json({ data: null, message: `Error deleting note` }, {
        status: STATUS_CODE.NotFound,
      });
    }
    if (currentNote.userLogin !== ctx.state.sessionUser.login) {
      return Response.json({ data: null, message: `Not authorized` }, {
        status: STATUS_CODE.Unauthorized,
      });
    }
    await noteService.deleteNote(body.id);
    return new Response(null, { status: STATUS_CODE.NoContent });
  },

  async POST(req, ctx) {
    const body = await req.json();
    if (!body.title) {
      throw new BadRequestError("Title is required");
    }

    if (!body.content) {
      throw new BadRequestError("Content is required");
    }

    const note: Note = {
      id: body.id || ulid(),
      userLogin: ctx.state.sessionUser.login,
      title: body.title,
      content: body.content,
    };

    const noteService = new NoteService();
    let dbNote: Note | null | undefined = await noteService.getNote(note.id);
    if (body.id && dbNote) {
      if (dbNote.userLogin !== ctx.state.sessionUser.login) {
        return Response.json({ data: null, message: `Unauthorized` }, {
          status: STATUS_CODE.Unauthorized,
        });
      }
      dbNote = await noteService.updateNote(note.id, note);
    } else {
      dbNote = await noteService.createNote(note);
    }

    return Response.json(dbNote, { status: STATUS_CODE.Created });
  },
};
