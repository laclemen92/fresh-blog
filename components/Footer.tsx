import GithubIcon from "./icons/GithubIcon.tsx";

export function Footer() {
  return (
    <footer class="sticky top-[100vh] w-11/12 max-w-5xl mx-auto mt-24 sm:!mt-28 mb-8 flex items-center justify-end">
      <span class="flex items-center gap-2">
        <a
          class="hover:underline flex gap-2 items-center"
          href="https://github.com/laclemen92/fresh-blog"
        >
          <GithubIcon class="h-5 w-5 text-black" />
        </a>
        <a
          class="flex items-center gap-2 text-gray-700"
          href="https://fresh.deno.dev"
        >
          <a href="https://fresh.deno.dev">
            <img
              width="197"
              height="37"
              src="https://fresh.deno.dev/fresh-badge.svg"
            />
          </a>
        </a>
      </span>
    </footer>
  );
}
