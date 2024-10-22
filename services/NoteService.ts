import { Note, noteEntity } from "@/models/Note.ts";
import { kv } from "@/utils/db.ts";
import {
  create,
  deleteKey,
  findMany,
  findUnique,
  update,
} from "@laclemen92/kvm";

export class NoteService {
  constructor() {
  }

  async createNote(note: Note): Promise<Note> {
    note.createdAt = new Date();

    const result = await create<Note>(noteEntity, kv, note);
    if (!result || !result?.value) throw new Error("Failed to create note");
    return result.value;
  }

  async getNote(id: string) {
    const result = await findUnique<Note>(noteEntity, kv, id);
    return result?.value;
  }

  async updateNote(id: string, note: Note): Promise<Note | null | undefined> {
    note.updatedAt = new Date();
    const notesKey = ["notes", id];
    const notesUserKey = ["user", note.userLogin, "notes", note.id];

    const res = await kv.atomic()
      .set(notesKey, note)
      .set(notesUserKey, note.id)
      .commit();

    if (!res.ok) throw new Error("Failed to update note");

    return await this.getNote(id);
  }

  // soft delete for x days, then delete for permanent if.. maybe we have a cron
  // that runs every night and if the note.deletedAt > 30 days, permanently delete
  //
  async softDeleteNote(id: string) {
    await update<Note>(noteEntity, kv, id, {
      deleted: true,
      deletedAt: new Date(),
    }, { onlyChangedFields: true });
    return;
  }

  async deleteNote(id: string) {
    await deleteKey<Note>(noteEntity, kv, id, {
      cascadeDelete: true,
    });
  }

  async restoreNote(id: string) {
    await update<Note>(noteEntity, kv, id, {
      deleted: false,
      deletedAt: undefined,
    }, { onlyChangedFields: true });
  }

  // listNotes(options?: Deno.KvListOptions) {
  //   return findMany<Note>(noteEntity, kv, options);
  // }

  // we should really only allow you to see your own notes, no way to see someone elses
  async listNotesForUser(
    userLogin: string,
    options?: Deno.KvListOptions,
  ): Promise<Deno.KvEntry<Note>[]> {
    const noteIds = await findMany<string>(noteEntity, kv, {
      ...options,
      prefix: ["user", userLogin, "notes"],
    });

    const notes: Deno.KvEntry<Note>[] = [];

    for await (const noteId of noteIds) {
      const note = await findUnique<Note>(noteEntity, kv, noteId?.value);
      if (note && note.value) {
        notes.push(note);
      }
    }

    return notes;
  }
}
