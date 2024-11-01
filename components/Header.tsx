import { User, UserAuthConfigs, UserRoles } from "@/models/User.ts";
import { Avatar } from "@/components/Avatar.tsx";
import { Button } from "@/islands/Button.tsx";
import IconPlus from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/plus.tsx";
import IconBrandGithubFilled from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/brand-github-filled.tsx";
import IconBrandGoogleFilled from "https://deno.land/x/tabler_icons_tsx@0.0.7/tsx/brand-google-filled.tsx";

export interface HeaderProps {
  sessionUser?: User;
  url: URL;
}

export function Header(props: HeaderProps) {
  return (
    <>
      {/* max-w-screen-xl - this made it have a lot of margin on sides */}
      <header class="flex flex-row gap-3 items-center justify-between">
        <div class="p-4 flex items-center">
          <a href="/" class="flex mr-3 items-center">
            <h1 class="text-2xl font-semibold">Notey</h1>
          </a>
        </div>
        <nav class="flex">
          <ul class="flex justify-center items-center gap-2 md:gap-4 mx-2 my-2 md:my-6 flex-wrap md:mx-8">
            {!props.sessionUser
              ? (
                <li>
                  <Button
                    style="secondary"
                    type="button"
                    dataDropdownToggle="header-login-options"
                    dataDropdownPlacement="bottom-end"
                    htmlClass="rounded-lg px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset"
                  >
                    Sign in
                  </Button>
                  <div
                    id="header-login-options"
                    class="z-10 hidden bg-white divide-y divide-gray-100 bg-white border border-gray-300/70 rounded-lg shadow-xl shadow-gray-400/20 w-72"
                  >
                    <ul
                      class="py-2 text-sm text-gray-700 divide-y divide-slate-200"
                      aria-labelledby="dropdownDefaultButton"
                    >
                      <li class="flex justify-center">
                        <Button
                          href={`/signin/google`}
                          htmlClass="flex block px-4 py-2 text-gray-400 hover:text-gray-900"
                          type="anchor"
                        >
                          <IconBrandGoogleFilled class="w-6 h-6" />
                        </Button>
                        <div class="flex py-2">- OR -</div>
                        <Button
                          href={`/signin/github`}
                          htmlClass="block px-4 py-2 text-gray-400 hover:text-gray-900"
                          type="anchor"
                        >
                          <IconBrandGithubFilled class="w-6 h-6" />
                        </Button>
                      </li>
                    </ul>
                  </div>
                </li>
              )
              : (
                <li class="relative">
                  <Button
                    type="avatar"
                    dataDropdownToggle="header-menu-dropdown"
                    dataDropdownPlacement="bottom-end"
                  >
                    <Avatar
                      login={(props?.sessionUser?.login &&
                          (props?.sessionUser?.authConfig ===
                              UserAuthConfigs.GITHUB ||
                            !props?.sessionUser?.authConfig))
                        ? props?.sessionUser?.login
                        : null}
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
                            login={(props?.sessionUser?.login &&
                                (props?.sessionUser?.authConfig ===
                                    UserAuthConfigs.GITHUB ||
                                  !props?.sessionUser?.authConfig))
                              ? props?.sessionUser?.login
                              : null}
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
                          {!props.sessionUser.authConfig ||
                              props.sessionUser.authConfig ===
                                UserAuthConfigs.GITHUB
                            ? <IconBrandGithubFilled class="h-4 w-4 mr-1" />
                            : null}
                          <div>
                            {props.sessionUser.login}
                          </div>
                        </div>
                      </li>
                      {props.sessionUser &&
                          props.sessionUser.role === UserRoles.ADMIN
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
                      {props.sessionUser &&
                          props.sessionUser.role === UserRoles.ADMIN
                        ? (
                          <li class="flex justify-between hover:bg-gray-100">
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
                          </li>
                        )
                        : null}
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
