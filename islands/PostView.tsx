import { CSS, render } from "$gfm";
import { Head } from "$fresh/runtime.ts";
import { Button } from "@/islands/Button.tsx";
import { useSignal } from "@preact/signals";
import { PostEditor } from "@/islands/PostEditor.tsx";
import type { Post, User } from "@/utils/db.ts";

export default function PostView(props: {
  data: {
    post: Post;
  };
  sessionUser: User | undefined;
}) {
  const { data, sessionUser } = props;
  const { post } = data;
  const isEditing = useSignal(false);

  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      {sessionUser?.login === post.userLogin
        ? (
          <div class="flex-none">
            <Button
              onClick={(e) => {
                isEditing.value = !isEditing.value;
              }}
              style="primary"
              type="button"
              htmlClass="float-right rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset"
            >
              Edit
            </Button>
          </div>
        )
        : null}
      {isEditing.value ? <PostEditor post={post} /> : (
        <div
          class="markdown-body"
          dangerouslySetInnerHTML={{ __html: render(post.content) }}
        />
      )}
    </>
  );
}
