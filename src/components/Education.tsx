import { education, shortHash } from '../data';
import { SectionTitle } from './SectionTitle';

export function Education() {
  return (
    <section id="education" className="section" aria-labelledby="education-title">
      <SectionTitle id="education" command="git log --graph --decorate" path="education" />
      <ol className="gitlog">
        {education.map((e) => (
          <li className="gitlog__commit reveal" key={e.message}>
            <span className="gitlog__node" aria-hidden="true" />
            <p className="gitlog__meta">
              <span className="gitlog__label">commit</span>{' '}
              <span className="gitlog__hash">{shortHash(e.date + e.message)}</span>
              {e.refs && <span className="gitlog__refs">({e.refs})</span>}
            </p>
            <p className="gitlog__date">
              <span className="gitlog__label">Date:</span> <time>{e.date}</time>
            </p>
            <h3 className="gitlog__msg">{e.message}</h3>
            {e.details.length > 0 && (
              <ul className="gitlog__details">
                {e.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
