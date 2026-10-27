type Props = { id: string; command: string; path: string };

export function SectionTitle({ id, command, path }: Props) {
  return (
    <div className="section-title reveal">
      <p className="section-title__cmd" aria-hidden="true">
        <span className="prompt">$</span> {command}
      </p>
      <h2 id={`${id}-title`}>
        <span className="section-title__tilde" aria-hidden="true">~/</span>
        {path}
        <span className="cursor" aria-hidden="true" />
      </h2>
    </div>
  );
}
