import IconBrandGithubFilled from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/brand-github-filled.tsx";

export function Footer() {
  return (
    <footer class="fixed inset-x-0 bottom-0 md:h-16 flex mt-16 justify-end md:mx-8 mx-8 h-12">
      <span class="flex items-center gap-2">
        <a
          class="hover:underline flex gap-2 items-center"
          href="https://github.com/laclemen92/fresh-blog"
          aria-label="Link to the github repo for this app"
        >
          <IconBrandGithubFilled class="h-6 w-6 text-black" />
        </a>
        <a
          class="flex items-center gap-2 text-gray-700"
          href="https://fresh.deno.dev"
          aria-label="Link to deno fresh"
        >
          <a href="https://fresh.deno.dev" aria-label="Link to deno fresh">
            <img
              width="197"
              height="37"
              alt="fresh badge"
              src="https://fresh.deno.dev/fresh-badge.svg"
            />
          </a>
        </a>
      </span>
    </footer>
  );
}
