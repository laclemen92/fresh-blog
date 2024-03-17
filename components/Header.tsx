import { User } from "@/utils/db.ts";
import { Avatar } from "@/components/Avatar.tsx";
import { Button } from "@/components/Button.tsx";

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
        <nav class="flex hidden md:flex">
          <ul class="flex justify-center items-center gap-2 sm:gap-4 mx-4 my-2 sm:my-6 flex-wrap lg:mx-8 2xl:mr-0">
            {props.sessionUser
              ? (
                <li>
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
            {props.sessionUser
              ? (
                <li>
                  <Button
                    href="/signout"
                    style="secondary"
                    type="anchor"
                  >
                    Sign out
                  </Button>
                </li>
              )
              : (
                <li>
                  <Button
                    href="/signin"
                    style="secondary"
                    type="anchor"
                  >
                    Sign in
                  </Button>
                </li>
              )}
            {props.sessionUser
              ? (
                <li class="flex items-center">
                  <Avatar
                    login={props?.sessionUser?.login || null}
                    size={32}
                  />
                </li>
              )
              : null}
          </ul>
        </nav>
        <nav class="flex md:hidden pb-3">
          <ul class="flex justify-center items-center gap-2 sm:gap-4 mx-4 my-2 sm:my-6 flex-wrap lg:mx-8 2xl:mr-0">
            <li class="flex items-center">
              {props.sessionUser
                ? (
                  <li class="flex items-center">
                    <Button onClick={toggleMenu} type="avatar">
                      <Avatar
                        login={props?.sessionUser?.login || null}
                        size={32}
                      />
                    </Button>
                  </li>
                )
                : (
                  <li>
                    <Button
                      href="/signin"
                      style="secondary"
                      type="anchor"
                    >
                      Sign in
                    </Button>
                  </li>
                )}
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
