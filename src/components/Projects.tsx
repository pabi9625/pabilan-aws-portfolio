import { useRef, type PointerEvent } from 'react';
import { projects, type Project } from '../data';
import { prefersReducedMotion } from '../hooks/useReducedMotion';
import { SectionTitle } from './SectionTitle';

const statusLabel: Record<Project['status'], string> = {
  live: 'live',
  'in-progress': 'in progress',
  repo: 'source on GitHub',
};

const statusLine: Record<Project['status'], string> = {
  live: 'active (running)',
  'in-progress': 'activating (in progress)',
  repo: 'source available',
};

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse' || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - y) * 5}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * 7}deg`);
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  const host = project.url?.replace(/^https?:\/\//, '');
  const isGitHub = project.url?.includes('github.com');

  return (
    <article
      ref={ref}
      className={`service service--${project.status} reveal`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-labelledby={`p-${project.slug}`}
    >
      <header className="service__head">
        <span className="service__unit">{project.slug}.service</span>
        <span className={`service__status service__status--${project.status}`}>
          <span className={`dot dot--${project.status}`} aria-hidden="true" />
          {statusLabel[project.status]}
        </span>
      </header>
      <h3 id={`p-${project.slug}`} className="service__name">
        {project.name}
        {project.subtitle && <span className="service__sub">{project.subtitle}</span>}
      </h3>
      <p className="service__desc">{project.description}</p>
      <ul className="tags" aria-label="Stack">
        {project.tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className="service__details">
        <p>
          <span className="k">Active:</span>{' '}
          <span className={`v v--${project.status}`}>{statusLine[project.status]}</span>
        </p>
        <p>
          <span className="k">{isGitHub ? 'Source:' : 'Endpoint:'}</span>{' '}
          <span className="v">{host ?? 'not yet deployed'}</span>
        </p>
      </div>
      <footer className="service__foot">
        {project.url ? (
          <a className="service__link" href={project.url} target="_blank" rel="noopener noreferrer">
            {isGitHub ? 'View on GitHub' : 'Open live site'} <span aria-hidden="true">↗</span>
            <span className="sr-only"> ({project.name}, opens in a new tab)</span>
          </a>
        ) : (
          <span className="service__soon">Coming soon</span>
        )}
      </footer>
    </article>
  );
}

export function Projects() {
  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <SectionTitle id="projects" command="systemctl list-units --type=service" path="projects" />
      <p className="section-lead reveal">Deployed services and source repos. Hover or focus a card for its status readout.</p>
      <div className="services">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}
