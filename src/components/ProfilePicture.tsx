type Props = { size: number; className?: string; eager?: boolean; small?: boolean };

export function ProfilePicture({ size, className, eager, small }: Props) {
  return (
    <picture className={className}>
      <source srcSet={small ? '/profile-avatar.webp' : '/profile.webp'} type="image/webp" />
      <img
        src="/profile.png"
        alt="Kumarathass Pabilan"
        width={size}
        height={size}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        {...(eager ? { fetchPriority: 'high' as const } : {})}
      />
    </picture>
  );
}
