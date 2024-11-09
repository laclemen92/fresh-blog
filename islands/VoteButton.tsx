import { Button } from "@/islands/Button.tsx";
import { Signal } from "@preact/signals";
import IconHeartFilled from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/heart-filled.tsx";
import IconHeart from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/heart.tsx";

export function VoteButton(
  props: {
    didVote: Signal;
    voteCountSignal: Signal;
    postId: string;
    disabled: boolean;
  },
) {
  const { didVote, voteCountSignal, postId, disabled } = props;
  const onClickVote = async (_e: Event) => {
    await fetch(`/api/votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postId,
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
    <Button
      style="secondary"
      type="button"
      htmlClass="float-right rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset"
      onClick={onClickVote}
      disabled={disabled}
    >
      <div class="flex items-center justify-between gap-2">
        {voteCountSignal.value}
        {didVote.value
          ? <IconHeartFilled class="w-5 h-5 text-red-700" />
          : <IconHeart class="w-5 h-5" />}
      </div>
    </Button>
  );
}
