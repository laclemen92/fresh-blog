import { User } from "@/utils/db.ts";
import { Avatar } from "@/components/Avatar.tsx";

export interface HeaderProps {
  sessionUser?: User;
  url: URL;
}

// need to show the avatar image or sign in button on top right

export function Header(props: HeaderProps) {
  return (
    <>
      {/* max-w-screen-xl - this made it have a lot of margin on sides */}
      <header class="mx-auto flex gap-3 items-center justify-between">
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
            <li>
              <a href="/posts">Posts</a>
            </li>
            {props.sessionUser
              ? (
                <a href="/signout" class="link-styles nav-item">
                  Sign out
                </a>
              )
              : (
                <a href="/signin" class="link-styles nav-item">
                  Sign in
                </a>
              )}
            <li class="flex items-center">
              <Avatar
                login={props?.sessionUser?.login || null}
                size={32}
              />
            </li>
          </ul>
        </nav>
      </header>
      <nav class="flex md:hidden pb-3">
        <ul class="flex justify-center items-center gap-2 sm:gap-4 mx-4 my-2 sm:my-6 flex-wrap lg:mx-8 2xl:mr-0">
          <li class="flex items-center">
            <li>
              <a href="/posts">Posts</a>
            </li>
            <Avatar
              login={props?.sessionUser?.login || null}
              size={32}
            />
          </li>
        </ul>
      </nav>
    </>
  );
}
