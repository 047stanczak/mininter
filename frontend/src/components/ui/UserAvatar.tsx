interface UserAvatarProps {
  name?: string | null;
  src?: string | null;
  size?: number;
}

function hueFor(name: string) {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) % 360;
  return hash;
}

export function UserAvatar({ name, src, size = 40 }: UserAvatarProps) {
  if (src) {
    return <img className="avatar" src={src} alt="" width={size} height={size} />;
  }

  const label = name ?? "?";
  return (
    <span
      className="avatar avatar-initial"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.45,
        background: `hsl(${hueFor(label)} 45% 40%)`,
      }}
    >
      {label.slice(0, 1).toUpperCase()}
    </span>
  );
}
