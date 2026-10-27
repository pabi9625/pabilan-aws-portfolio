import { useEffect, useState } from 'react';
import { links, profile, projects } from '../data';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useUptime } from '../hooks/useUptime';
import { ProfilePicture } from './ProfilePicture';

function useTyped(text: string, reduced: boolean, delay = 350, speed = 70) {
  const [count, setCount] = useState(reduced ? text.length : 0);
  useEffect(() => {
    if (reduced) {
      setCount(text.length);
      return;
    }
    let i = 0;
    let id = 0;
    const start = window.setTimeout(() => {
      id = window.setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) window.clearInterval(id);
      }, speed);
    }, delay);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(id);
    };
  }, [text, reduced, delay, speed]);
  return { typed: text.slice(0, count), done: count >= text.length };
}

function StatusPanel() {
  const uptime = useUptime(profile.uptimeSince);
  const live = projects.filter((p) => p.status === 'live').length;
  const building = projects.filter((p) => p.status === 'in-progress').length;

  return (
    <aside className="status panel" aria-label="Server status">
      <div className="panel__bar">
        <span className="panel__dots" aria-hidden="true">
          <i /> <i /> <i />
        </span>
        <span>status · {profile.host}</span>
      </div>
      <dl className="status__list">
        <div>
          <dt>host</dt>
          <dd>{profile.host}</dd>
        </div>
        <div>
          <dt>status</dt>
          <dd className="status__ok">
            <span className="dot dot--live" aria-hidden="true" /> {profile.status}
          </dd>
        </div>
        <div>
          <dt>uptime</dt>
          <dd>
            <span className="status__uptime" aria-live="off">
              {uptime}
            </span>
            <span className="status__note">since UCSC, May 2024</span>
          </dd>
        </div>
        <div>
          <dt>location</dt>
          <dd>{profile.location}</dd>
        </div>
        <div>
          <dt>focus</dt>
          <dd>ML · Full-Stack</dd>
        </div>
        <div>
          <dt>services</dt>
          <dd>
            {live} live · {building} in progress
          </dd>
        </div>
      </dl>
    </aside>
  );
}

export function Hero({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  const reduced = useReducedMotion();
  const { typed, done } = useTyped(profile.name, reduced);

  return (
    <section id="home" className="hero" aria-labelledby="home-title">
      <div className="hero__grid">
        <div className="hero__main">
          <p className="hero__prompt" aria-hidden="true">
            <span className="prompt">{profile.handle}@{profile.host}:~$</span> whoami
          </p>
          <h1 id="home-title" className="hero__name" aria-label={profile.name}>
            <span aria-hidden="true">{typed}</span>
            <span className={`cursor cursor--lg${done ? '' : ' cursor--solid'}`} aria-hidden="true" />
          </h1>
          <p className="hero__title">
            {profile.title}, {profile.university}
          </p>
          <p className="hero__focus">
            <span className="hero__focus-key">focus:</span> {profile.focus}
          </p>

          <div className="hero__actions">
            <a className="btn btn--primary" href="#projects">
              See my work
            </a>
            <a className="btn" href={links.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a className="btn" href={links.cv} target="_blank" rel="noopener noreferrer">
              Download CV
            </a>
          </div>

          <p className="hero__psst">
            psst… press <kbd>`</kbd> or click{' '}
            <button type="button" className="inline-term" onClick={onOpenTerminal}>
              &gt;_
            </button>{' '}
            to SSH into my server
          </p>
        </div>

        <div className="hero__side">
          <div className="hero__photo">
            <ProfilePicture size={640} eager />
            <span className="hero__photo-tag" aria-hidden="true">
              /dev/pabilan
            </span>
          </div>
          <StatusPanel />
        </div>
      </div>
    </section>
  );
}
