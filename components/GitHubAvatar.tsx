interface GitHubAvatarProps {
  login: string;
  size: number;
  class?: string;
}

export function GitHubAvatar(
  { login, size, class: className }: GitHubAvatarProps,
) {
  return (
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
  );
}
