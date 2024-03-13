import { User } from "@/utils/db.ts";

export interface HeaderProps {
  sessionUser?: User;
  // url: URL;
}

export function Header(props: HeaderProps) {
  return (
    <header class="w-full bg-[#86efac] bg-cover bg-no-repeat">
      <nav class="w-11/12 h-24 max-w-5xl mx-auto flex items-center justify-between">
        <a href="/">
          <img
            class="my-6 h-14 w-14"
            src="/logo.svg"
            alt="the Fresh logo: a sliced lemon dripping with juice"
          />
        </a>
        <h1 class="text-2xl">Welcome to da Blog</h1>
        <a href="/">
          <img
            class="my-6 h-14 w-14"
            src="/logo.svg"
            alt="the Fresh logo: a sliced lemon dripping with juice"
          />
        </a>
      </nav>
    </header>
  );
}
