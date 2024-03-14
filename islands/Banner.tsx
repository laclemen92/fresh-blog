import { useSignal } from "@preact/signals";
import IconX from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/x.tsx";

export interface BannerProps {
  content: string;
  type: "error" | "warning" | "success";
}

const bannerClass = {
  error: "bg-red-500",
  warning: "bg-yellow-500",
  success: "bg-green-500",
};

const showBanner = () => {
};

const closeBanner = (show: any) => {
  console.log("close");
  show.value = false;
};

export function Banner({ content, type }: BannerProps) {
  const show = useSignal(true);

  if (show.value) {
    setTimeout(() => {
      show.value = false;
    }, 5000);
  }

  return (
    <div class="sm:px-6 sm:pt-2 lg:px-8" hidden={!show.value}>
      <div
        class={`flex items-center justify-between gap-x-6 px-6 py-2.5 sm:rounded-xl sm:py-3 sm:pl-4 sm:pr-3.5 ${
          bannerClass[type]
        }`}
      >
        <p class="text-sm leading-6 text-white">
          {content}
        </p>
        <div class="flex flex-1 justify-end">
          <button onClick={() => closeBanner(show)}>
            <IconX class="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
