import { CSS, render } from "$gfm";
import { Head } from "$fresh/runtime.ts";
import { Button } from "@/islands/Button.tsx";
import { useSignal } from "@preact/signals";
import { Editor } from "@/islands/Editor.tsx";
import type { Post } from "@/models/Post.ts";
import type { User } from "@/models/User.ts";
import { UserRoles } from "@/models/User.ts";
import { VoteButton } from "@/islands/VoteButton.tsx";
import { DeletePostButton } from "@/islands/DeletePostButton.tsx";

const formatPostDate = (postDate: Date) => {
  postDate = new Date(postDate);
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

  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      <div class="flex flex-row-reverse gap-2">
        {sessionUser?.login === post.userLogin &&
            sessionUser?.role === UserRoles.ADMIN
          ? (
            <Button
              onClick={(_e: Event) => {
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
        {sessionUser?.login === post.userLogin &&
            sessionUser?.role === UserRoles.ADMIN
          ? <DeletePostButton post={post} userLogin={sessionUser.login} />
          : null}
        <VoteButton
          didVote={didVote}
          voteCountSignal={voteCountSignal}
          postId={post.id}
          disabled={!sessionUser || sessionUser.login === post.userLogin}
        />
      </div>

      {isEditing.value ? <Editor data={post} type={"post"} /> : (
        <div
          class="markdown-body"
          dangerouslySetInnerHTML={{
            __html: render(
              "# ".concat(post.title).concat(
                `${
                  post && post?.createdAt
                    ? "\n###### Created on " + formatPostDate(post.createdAt)
                    : ""
                }`,
              ).concat("\n\n").concat(post.content),
              {
                allowedTags: ["input"],
                allowedAttributes: {
                  input: ["checked", "disabled", {
                    name: "type",
                    values: ["checkbox"],
                  }],
                },
              },
            ).replaceAll(
              "<a href",
              `<a target="_blank" href`,
            ).replaceAll(
              `<li><input checked disabled type="checkbox"`,
              `<li style="list-style-type: none;"><input checked disabled type="checkbox"`,
            ).replaceAll(
              `<li><input disabled type="checkbox"`,
              `<li style="list-style-type: none;"><input disabled type="checkbox"`,
            ),
          }}
        />
      )}
    </>
  );
}
