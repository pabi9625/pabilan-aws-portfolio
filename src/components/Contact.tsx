import { contactBlurb, links } from '../data';
import { SectionTitle } from './SectionTitle';

export function Contact({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <SectionTitle id="contact" command="./contact.sh" path="contact" />
      <div className="contact panel reveal">
        <p className="contact__blurb">{contactBlurb}</p>
        <ul className="contact__list">
          <li>
            <span className="k">github</span>
            <a href={links.github} target="_blank" rel="noopener noreferrer">
              github.com/pabi9625
            </a>
          </li>
          <li>
            <span className="k">linkedin</span>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
              linkedin.com/in/kumarathass-pabilan
            </a>
          </li>
          <li>
            <span className="k">cv</span>
            <a href={links.cv} target="_blank" rel="noopener noreferrer">
              Kumarathass_Pabilan_CV.pdf
            </a>
          </li>
          <li>
            <span className="k">email</span>
            {links.email ? (
              <a href={`mailto:${links.email}`}>{links.email}</a>
            ) : (
              <span className="todo">TODO: add email address</span>
            )}
          </li>
        </ul>
        <button type="button" className="btn btn--ghost" onClick={onOpenTerminal}>
          &gt;_ or say hi from the terminal
        </button>
      </div>
    </section>
  );
}
