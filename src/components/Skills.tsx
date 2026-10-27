import { skills } from '../data';
import { SectionTitle } from './SectionTitle';

export function Skills() {
  let pid = 1000;
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <SectionTitle id="skills" command="cat skills.json | top" path="skills" />
      <p className="section-lead reveal">Tech superpowers, grouped like processes on a system monitor.</p>
      <div className="monitor reveal">
        {skills.map((group, gi) => (
          <div className="monitor__group panel" key={group.id}>
            <div className="panel__bar">
              <span className="monitor__cpu">cpu{gi}</span>
              <h3>{group.label}</h3>
              <span className="monitor__count">{group.items.length} procs</span>
            </div>
            <table className="monitor__table">
              <caption className="sr-only">{group.label}</caption>
              <thead>
                <tr>
                  <th scope="col">PID</th>
                  <th scope="col">COMMAND</th>
                  <th scope="col" aria-hidden="true">
                    ACTIVITY
                  </th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((item, i) => {
                  pid += 7;
                  return (
                    <tr key={item}>
                      <td className="monitor__pid">{pid}</td>
                      <td className="monitor__cmd">{item}</td>
                      <td aria-hidden="true">
                        <span className="eq" style={{ ['--seed' as string]: (gi * 7 + i) % 9 }}>
                          <i /> <i /> <i /> <i /> <i /> <i />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <p className="monitor__note reveal">
        <span className="prompt">#</span> activity bars are decorative, not skill ratings.
      </p>
    </section>
  );
}
