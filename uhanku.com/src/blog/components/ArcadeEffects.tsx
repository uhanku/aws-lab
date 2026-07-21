export function ArcadeDivider({ pixel = false }: { pixel?: boolean }) {
  return (
    <div
      className={`arcade-divider${pixel ? ' arcade-divider--pixel' : ''}`}
      aria-hidden="true"
    />
  );
}
