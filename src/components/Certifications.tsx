import { certifications, slugify } from '../data';
import { SectionTitle } from './SectionTitle';

export function Certifications() {
  const total = certifications.reduce((n, g) => n + g.items.length, 0);
  return (
    <section id="certifications" className="section" aria-labelledby="certifications-title">
      <SectionTitle id="certifications" command="apt list --installed" path="certifications" />
      <p className="section-lead reveal">
        {total} packages installed from {certifications.length} sources. Expand a source to see its packages.
      </p>
      <div className="pkgs panel reveal">
        {certifications.map((g, i) => (
          <details className="pkgs__group" key={g.provider} open={i === 0}>
            <summary>
              <span className="pkgs__chev" aria-hidden="true">▸</span>
              <span className="pkgs__provider">{g.provider}</span>
              <span className="pkgs__meta">
                {g.items.length} pkg{g.items.length > 1 ? 's' : ''} · {g.year}
              </span>
            </summary>
            <ul>
              {g.items.map((c) => (
                <li key={c.url}>
                  <a href={c.url} target="_blank" rel="noopener noreferrer">
                    <span className="pkgs__name">
                      {g.pkg}/{slugify(c.name)}
                    </span>
                    <span className="pkgs__title">{c.name}</span>
                    <span className="pkgs__state">
                      [installed] <span aria-hidden="true">↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </section>
  );
}
