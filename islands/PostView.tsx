import { CSS, render } from "$gfm";
import { Head } from "$fresh/runtime.ts";
import { Button } from "@/islands/Button.tsx";
import { useSignal } from "@preact/signals";
import { PostEditor } from "@/islands/PostEditor.tsx";
import type { Post, User } from "@/utils/db.ts";
import IconHeart from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/heart.tsx";
import IconHeartFilled from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/heart-filled.tsx";

const formatPostDate = (postDate: Date) => {
  return `${
    postDate.getMonth() + 1
  }/${postDate.getDate()}/${postDate.getFullYear()}`;
};

export default function PostView(props: {
  data: {
    post: Post;
    voteCount: number;
    voted: boolean;
  };
  sessionUser: User | undefined;
}) {
  const { data, sessionUser } = props;
  const { post, voteCount, voted } = data;
  const isEditing = useSignal(false);
  const didVote = useSignal(voted);
  const voteCountSignal = useSignal(voteCount);

  const onClickVote = async (e: Event) => {
    const resp = await fetch(`/api/votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: post.id,
      }),
    });

    if (didVote.value) {
      voteCountSignal.value -= 1;
    } else {
      voteCountSignal.value += 1;
    }
    didVote.value = !didVote.value;
  };

  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      <div class="flex flex-row-reverse gap-2">
        {sessionUser?.login === post.userLogin && sessionUser?.role === "admin"
          ? (
            <Button
              onClick={(e) => {
                isEditing.value = !isEditing.value;
              }}
              style="primary"
              type="anchor"
              htmlClass="float-right rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset"
              href={`/posts/edit/${post.slug}`}
            >
              Edit
            </Button>
          )
          : null}
        {sessionUser?.login === post.userLogin && sessionUser?.role === "admin"
          ? (
            <Button
              onClick={async (e) => {
                const resp = await fetch(`/api/posts`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(post),
                });

                window.location.href = `/user/${sessionUser.login}/posts`;
              }}
              style="danger"
              type="button"
              htmlClass="float-right rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset"
            >
              Delete
            </Button>
          )
          : null}
        <Button
          style="secondary"
          type="button"
          htmlClass="float-right rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset"
          onClick={onClickVote}
          disabled={!sessionUser || sessionUser.login === post.userLogin}
        >
          <div class="flex items-center justify-between gap-2">
            {voteCountSignal.value}
            {didVote.value
              ? <IconHeartFilled class="w-5 h-5 text-red-700" />
              : <IconHeart class="w-5 h-5" />}
          </div>
        </Button>
      </div>

      {isEditing.value ? <PostEditor post={post} /> : (
        <div
          class="markdown-body"
          dangerouslySetInnerHTML={{
            __html: render(
              "# ".concat(post.title).concat(
                `${
                  post?.createdAt
                    ? "\n###### Created on " + formatPostDate(post.createdAt)
                    : ""
                }`,
              ).concat("\n\n").concat(post.content),
            ),
          }}
        />
      )}
    </>
  );
}
