import { User } from "@/utils/db.ts";
import { Avatar } from "@/components/Avatar.tsx";
import { Button } from "@/islands/Button.tsx";
import IconPlus from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/plus.tsx";
import IconBrandGithubFilled from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/brand-github-filled.tsx";

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
          <ul class="flex justify-center items-center gap-2 md:gap-4 mx-2 my-2 md:my-6 flex-wrap md:mx-8">
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
              : (
                <li class="relative">
                  <Button
                    onClick={toggleMenu}
                    type="avatar"
                    dataDropdownToggle="header-menu-dropdown"
                    dataDropdownPlacement="bottom-end"
                  >
                    <Avatar
                      login={props?.sessionUser?.login || null}
                      size={32}
                    />
                  </Button>
                  <div
                    id="header-menu-dropdown"
                    class="z-10 hidden bg-white divide-y divide-gray-100 bg-white border border-gray-300/70 rounded-lg shadow-xl shadow-gray-400/20 w-72"
                  >
                    <ul
                      class="py-2 text-sm text-gray-700 divide-y divide-slate-200"
                      aria-labelledby="dropdownDefaultButton"
                    >
                      <li class="flex flex-col mb-4">
                        <div class="flex items-center justify-center">
                          <Avatar
                            login={props?.sessionUser?.login || null}
                            size={96}
                            class="mx-4 my-2"
                          />
                        </div>
                        {props?.sessionUser?.name
                          ? (
                            <div class="flex items-center justify-center font-bold text-lg">
                              {props.sessionUser.name}
                            </div>
                          )
                          : null}
                        <div class="flex items-center justify-center text-gray-400 font-semibold">
                          <IconBrandGithubFilled class="h-4 w-4 mr-1" />
                          <div>
                            {props.sessionUser.login}
                          </div>
                        </div>
                      </li>
                      {props.sessionUser && props.sessionUser.role === "admin"
                        ? (
                          <li class="flex justify-between hover:bg-gray-100">
                            <Button
                              href={`/user/${props.sessionUser.login}/posts`}
                              htmlClass="flex flex-1 block px-4 py-2 text-base"
                              type="anchor"
                            >
                              Posts
                            </Button>
                            <Button
                              href={`/posts/new`}
                              htmlClass="block px-4 py-2 text-gray-400 hover:text-gray-900"
                              type="anchor"
                            >
                              <IconPlus class="w-5 h-5" />
                            </Button>
                          </li>
                        )
                        : null}
                      {
                        /* <li class="flex justify-between hover:bg-gray-100">
                        <Button
                          href={`/notes`}
                          htmlClass="flex flex-1 block px-4 py-2 text-base"
                          type="anchor"
                        >
                          Notes
                        </Button>
                        <Button
                          href={`/notes/new`}
                          htmlClass="block px-4 py-2 text-gray-400 hover:text-gray-900"
                          type="anchor"
                        >
                          <IconPlus class="w-5 h-5" />
                        </Button>
                      </li> */
                      }
                      <li>
                        <Button
                          href="/posts/favorites"
                          type="anchor"
                          htmlClass="block px-4 py-2 text-base hover:bg-gray-100"
                        >
                          Favorites
                        </Button>
                      </li>
                      <li>
                        <Button
                          href="/signout?success_url=/"
                          htmlClass="block px-4 py-2 text-base hover:bg-gray-100"
                          type="anchor"
                        >
                          Sign out
                        </Button>
                      </li>
                    </ul>
                  </div>
                </li>
              )}
          </ul>
        </nav>
      </header>
    </>
  );
}
