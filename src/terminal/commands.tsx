import type { ReactNode } from 'react';
import { about, certifications, education, links, profile, projects, shortHash, skills, type Project } from '../data';
import { ProfilePicture } from '../components/ProfilePicture';

export type Ctx = {
  clear: () => void;
  exit: () => void;
  play: () => void;
};

export const COMMANDS: { name: string; desc: string }[] = [
  { name: 'help', desc: 'list available commands' },
  { name: 'whoami', desc: 'who is on the other end' },
  { name: 'about', desc: 'short bio' },
  { name: 'skills', desc: 'tech superpowers' },
  { name: 'projects', desc: 'running services' },
  { name: 'open', desc: 'open <project>: launch a live site or repo' },
  { name: 'education', desc: 'git log of my education' },
  { name: 'certs', desc: 'installed certification packages' },
  { name: 'ls', desc: 'list files' },
  { name: 'cat', desc: 'cat <file>: print a file' },
  { name: 'contact', desc: 'ways to reach me' },
  { name: 'cv', desc: 'open my CV (PDF)' },
  { name: 'neofetch', desc: 'system info' },
  { name: 'play', desc: 'play asteroids' },
  { name: 'clear', desc: 'clear the screen' },
  { name: 'exit', desc: 'close the session' },
];

export const FILES = ['about.txt', 'skills.json', 'contact.txt', 'education.log', 'cv.pdf'];

export const CHIPS = [
  'help', 'whoami', 'projects', 'skills', 'education', 'certs',
  'contact', 'neofetch', 'cv', 'play asteroids', 'clear', 'exit',
];

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

function findProject(q: string): Project | undefined {
  const s = q.toLowerCase().trim();
  return (
    projects.find((p) => p.slug === s) ??
    projects.find((p) => p.name.toLowerCase() === s) ??
    projects.find((p) => p.slug.startsWith(s) || p.name.toLowerCase().startsWith(s))
  );
}

function openUrl(url: string, label: string): ReactNode {
  const win = window.open(url, '_blank');
  if (win) win.opener = null;
  return (
    <p>
      {win === null ? 'Popup blocked? ' : 'Opening '}
      <a href={url} {...ext}>
        {label}
      </a>
      {win === null ? ' (click to open)' : ' in a new tab…'}
    </p>
  );
}

const aboutText = () => (
  <div className="t-block">
    {about.map((p, i) => (
      <p key={i}>{p}</p>
    ))}
  </div>
);

const skillsJson = () => (
  <pre className="t-pre">
    {'{\n'}
    {skills.map((g, i) => (
      <span key={g.id}>
        {'  '}
        <span className="t-key">"{g.label}"</span>: [
        {g.items.map((it, j) => (
          <span key={it}>
            <span className="t-str">"{it}"</span>
            {j < g.items.length - 1 ? ', ' : ''}
          </span>
        ))}
        ]{i < skills.length - 1 ? ',' : ''}
        {'\n'}
      </span>
    ))}
    {'}'}
  </pre>
);

const contactText = () => (
  <ul className="t-list">
    <li>
      <span className="t-key">github</span>{' '}
      <a href={links.github} {...ext}>github.com/pabi9625</a>
    </li>
    <li>
      <span className="t-key">linkedin</span>{' '}
      <a href={links.linkedin} {...ext}>linkedin.com/in/kumarathass-pabilan</a>
    </li>
    <li>
      <span className="t-key">cv</span>{' '}
      <a href={links.cv} {...ext}>Kumarathass_Pabilan_CV.pdf</a>
    </li>
    <li>
      <span className="t-key">email</span>{' '}
      {links.email ? <a href={`mailto:${links.email}`}>{links.email}</a> : <span className="t-dim">TODO</span>}
    </li>
  </ul>
);

const educationLog = () => (
  <div className="t-block">
    {education.map((e) => (
      <div key={e.message} className="t-commit">
        <p>
          <span className="t-amber">commit {shortHash(e.date + e.message)}</span>
          {e.refs && <span className="t-accent"> ({e.refs})</span>}
        </p>
        <p className="t-dim">Date: {e.date}</p>
        <p>&nbsp;&nbsp;&nbsp;&nbsp;{e.message}</p>
        {e.details.map((d) => (
          <p key={d} className="t-dim">&nbsp;&nbsp;&nbsp;&nbsp;- {d}</p>
        ))}
      </div>
    ))}
  </div>
);

function catFile(file: string | undefined): ReactNode {
  switch (file) {
    case undefined:
      return <p>usage: cat &lt;file&gt;. Try <code>ls</code> first.</p>;
    case 'about.txt':
      return aboutText();
    case 'skills.json':
      return skillsJson();
    case 'contact.txt':
      return contactText();
    case 'education.log':
      return educationLog();
    case 'cv.pdf':
      return <p>cv.pdf: binary file. Run <code>cv</code> to open it instead.</p>;
    default:
      return <p className="t-err">cat: {file}: No such file or directory</p>;
  }
}

function neofetch(): ReactNode {
  const rows: [string, string][] = [
    ['Name', profile.name],
    ['Role', `${profile.title} @ ${profile.universityShort}`],
    ['Focus', 'Machine Learning · Full-Stack'],
    ['Location', profile.location],
    ['Status', profile.status],
    ['Uptime', 'since May 2024 (UCSC)'],
    ['Languages', skills[0].items.join(', ')],
    ['Cloud', 'AWS (Amplify, Cognito, AppSync), Azure'],
    ['Shell', 'baner-sh (web)'],
  ];
  return (
    <div className="neofetch">
      <ProfilePicture size={96} small className="neofetch__avatar" />
      <div>
        <p className="t-accent t-bold">
          {profile.handle}@{profile.host}
        </p>
        <p className="t-dim">{'-'.repeat(profile.handle.length + profile.host.length + 1)}</p>
        {rows.map(([k, v]) => (
          <p key={k}>
            <span className="t-accent">{k}</span>: {v}
          </p>
        ))}
        <p className="neofetch__swatch" aria-hidden="true">
          <i /> <i /> <i /> <i /> <i /> <i />
        </p>
      </div>
    </div>
  );
}

export function helpText(): ReactNode {
  return (
    <div className="t-block">
      <p>Available commands:</p>
      <table className="t-table">
        <tbody>
          {COMMANDS.map((c) => (
            <tr key={c.name}>
              <td className="t-accent">{c.name}</td>
              <td className="t-dim">{c.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="t-dim">Tip: Tab autocompletes, ↑/↓ browse history, Esc closes. A few commands are hidden.</p>
    </div>
  );
}

export function execute(raw: string, ctx: Ctx): ReactNode | null {
  const input = raw.trim();
  if (!input) return null;
  const [cmd, ...args] = input.split(/\s+/);
  const arg = args.join(' ');

  switch (cmd.toLowerCase()) {
    case 'help':
    case '?':
      return helpText();
    case 'whoami':
      return (
        <p>
          <span className="t-accent">{profile.handle}</span>: {profile.name}. {profile.title} at {profile.universityShort}, focused on{' '}
          {profile.focus.toLowerCase()}.
        </p>
      );
    case 'about':
      return aboutText();
    case 'skills':
      return skillsJson();
    case 'projects':
      return (
        <div className="t-block">
          <table className="t-table">
            <tbody>
              {projects.map((p) => (
                <tr key={p.slug}>
                  <td>
                    <span className={`dot dot--${p.status}`} aria-hidden="true" /> {p.slug}
                  </td>
                  <td className="t-dim">
                    {p.status === 'live' ? 'live' : p.status === 'in-progress' ? 'coming soon' : 'repo'}
                  </td>
                  <td>{p.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="t-dim">
            Run <code>open &lt;name&gt;</code>, e.g. <code>open stridetrack</code>
          </p>
        </div>
      );
    case 'open': {
      if (!arg) return <p>usage: open &lt;project&gt;. Run <code>projects</code> to list names.</p>;
      const p = findProject(arg);
      if (!p) return <p className="t-err">open: no service named "{arg}". Try <code>projects</code>.</p>;
      if (!p.url) return <p className="t-amber">{p.name}: coming soon. Not deployed yet, check back later.</p>;
      return openUrl(p.url, p.url.replace(/^https?:\/\//, ''));
    }
    case 'education':
      return educationLog();
    case 'certs':
      return (
        <div className="t-block">
          {certifications.map((g) => (
            <div key={g.provider} className="t-commit">
              <p className="t-accent">
                {g.provider} <span className="t-dim">({g.year})</span>
              </p>
              {g.items.map((c) => (
                <p key={c.url}>
                  &nbsp;&nbsp;
                  <a href={c.url} {...ext}>
                    {c.name}
                  </a>{' '}
                  <span className="t-dim">[installed]</span>
                </p>
              ))}
            </div>
          ))}
        </div>
      );
    case 'ls':
      return (
        <p className="t-ls">
          {FILES.map((f) => (
            <span key={f} className={f.endsWith('.pdf') ? 't-amber' : undefined}>
              {f}
            </span>
          ))}
        </p>
      );
    case 'cat':
      return catFile(args[0]);
    case 'contact':
      return contactText();
    case 'cv':
      return openUrl(links.cv, 'Kumarathass_Pabilan_CV.pdf');
    case 'neofetch':
      return neofetch();
    case 'play':
      if (arg.toLowerCase() === 'asteroids') {
        ctx.play();
        return <p className="t-dim">Launching asteroids… good luck, pilot.</p>;
      }
      return <p>usage: play asteroids</p>;
    case 'sudo':
      return (
        <p className="t-err">
          [sudo] password for {profile.handle}: ********
          <br />
          {profile.handle} is not in the sudoers file. This incident will be reported… to my future internship manager.
          <br />
          <span className="t-dim">Root access unlocks after you hire me. 😉</span>
        </p>
      );
    case 'clear':
      ctx.clear();
      return null;
    case 'exit':
    case 'logout':
      ctx.exit();
      return null;
    default:
      return (
        <p className="t-err">
          {cmd}: command not found. Type <code>help</code> to see what I can do.
        </p>
      );
  }
}

// Returns the completed input, or a list of candidates when ambiguous.
export function complete(input: string): { value: string; options: string[] } {
  const lower = input.toLowerCase();
  let pool: string[];
  if (lower.startsWith('open ')) pool = projects.map((p) => `open ${p.slug}`);
  else if (lower.startsWith('cat ')) pool = FILES.map((f) => `cat ${f}`);
  else if (lower.startsWith('play ')) pool = ['play asteroids'];
  else pool = COMMANDS.map((c) => c.name);

  const matches = pool.filter((c) => c.startsWith(lower));
  if (matches.length === 0) return { value: input, options: [] };
  if (matches.length === 1) {
    const needsArg = ['open', 'cat', 'play'].includes(matches[0]);
    return { value: matches[0] + (needsArg ? ' ' : ''), options: [] };
  }
  let prefix = matches[0];
  for (const m of matches) while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1);
  return { value: prefix.length > input.length ? prefix : input, options: matches };
}
