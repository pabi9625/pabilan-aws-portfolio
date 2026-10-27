import { about, profile } from '../data';
import { SectionTitle } from './SectionTitle';

export function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <SectionTitle id="about" command="cat about.txt" path="about" />
      <div className="about panel reveal">
        <div className="panel__bar">
          <span className="panel__dots" aria-hidden="true">
            <i /> <i /> <i />
          </span>
          <span>about.txt</span>
        </div>
        <div className="about__body">
          {about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <ul className="about__facts" aria-label="Quick facts">
            <li>
              <span>role</span> CS undergraduate, year 3
            </li>
            <li>
              <span>school</span> {profile.universityShort}
            </li>
            <li>
              <span>research</span> machine learning
            </li>
            <li>
              <span>homelab</span> {profile.host}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
