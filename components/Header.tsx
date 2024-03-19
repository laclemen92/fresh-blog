import { User } from "@/utils/db.ts";
import { Avatar } from "@/components/Avatar.tsx";
import { Button } from "@/islands/Button.tsx";

export interface HeaderProps {
  sessionUser?: User;
  url: URL;
}

export function Header(props: HeaderProps) {
  const toggleMenu = async (e: Event) => {
  };

  return (
    <>
      {/* max-w-screen-xl - this made it have a lot of margin on sides */}
      <header class="flex flex-row gap-3 items-center justify-between">
        <div class="p-4 flex items-center">
          <a href="/" class="flex mr-3 items-center">
            <img
              height={40}
              width={40}
              src="/logo.svg"
              alt="the Fresh logo: a sliced lemon dripping with juice"
            />
          </a>
          <a href="/" class="flex mr-3 items-center">
            <h1 class="text-xl">Welcome to da Blog</h1>
          </a>
        </div>
        <nav class="flex">
          <ul class="flex justify-center items-center gap-2 sm:gap-4 mx-8 my-2 sm:my-6 flex-wrap md:mx-8">
            {props.sessionUser
              ? (
                <li class="hidden md:flex">
                  <Button
                    href="/posts/new"
                    style="primary"
                    type="anchor"
                  >
                    New Post
                  </Button>
                </li>
              )
              : null}
            {!props.sessionUser
              ? (
                <li>
                  <Button
                    href="/signin"
                    style="secondary"
                    type="anchor"
                  >
                    Sign in
                  </Button>
                </li>
              )
              : null}
            {props.sessionUser
              ? (
                <li class="flex items-center">
                  <Button
                    onClick={toggleMenu}
                    type="avatar"
                    dataDropdownToggle="header-menu-dropdown"
                  >
                    <Avatar
                      login={props?.sessionUser?.login || null}
                      size={32}
                    />
                  </Button>
                  <div
                    id="header-menu-dropdown"
                    class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                  >
                    <ul
                      class="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="dropdownDefaultButton"
                    >
                      <li>
                        <Button
                          href="/signout?success_url=/"
                          // style="secondary"
                          htmlClass="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          type="anchor"
                        >
                          Sign out
                        </Button>
                      </li>
                    </ul>
                  </div>
                </li>
              )
              : null}
          </ul>
        </nav>
        {/* mobile menu */}
      </header>
    </>
  );
}
