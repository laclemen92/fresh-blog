import { Button } from "@/islands/Button.tsx";
import { Post } from "@/models/Post.ts";

export function DeletePostButton(props: { post: Post; userLogin: string }) {
  const { post, userLogin } = props;
  return (
    <Button
      onClick={async (e) => {
        const resp = await fetch(`/api/posts`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(post),
        });

        window.location.href = `/user/${userLogin}/posts`;
      }}
      style="danger"
      type="button"
      htmlClass="float-right rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset"
    >
      Delete
    </Button>
  );
}
