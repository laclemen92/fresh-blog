import { Button } from "@/islands/Button.tsx";
import { Note } from "@/models/Note.ts";

export function DeleteNote(props: { note: Note; redirect: string }) {
  return (
    <Button
      onClick={async (e) => {
        console.error("hello?");
        const resp = await fetch(`/api/notes`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(props.note),
        });

        window.location.href = props.redirect; //`/user/${sessionUser.login}/notes`;
      }}
      style="danger"
      type="button"
      htmlClass="float-right rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset"
    >
      Delete
    </Button>
  );
}
