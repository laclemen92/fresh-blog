import IconUserCircle from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/user-circle.tsx";

interface AvatarProps {
  login: string | null;
  size: number;
  class?: string;
}

export function Avatar(
  { login, size, class: className }: AvatarProps,
) {
  return (
    <>
      {login
        ? (
          <img
            height={size}
            width={size}
            src={`https://avatars.githubusercontent.com/${login}?s=${size * 2}`}
            alt={`Avatar for ${login}`}
            class={`rounded-full inline-block aspect-square size-[${size}px] ${
              className ?? ""
            }`}
            crossOrigin="anonymous"
            loading="lazy"
          />
        )
        : (
          <IconUserCircle
            class={`h-10 w-10`}
            stroke={1.5}
          />
        )}
    </>
  );
}
