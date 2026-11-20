import { useEffect, useState } from "react";
import { meta, sections, about } from "./content.js";

function Block({ b }) {
  if (b.p) return <p>{b.p}</p>;
  if (b.h) return <h3>{b.h}</h3>;
  if (b.ul) return <ul>{b.ul.map((i) => <li key={i}>{i}</li>)}</ul>;
  if (b.ol) return <ol>{b.ol.map((i) => <li key={i}>{i}</li>)}</ol>;
  return null;
}

function Routes({ list }) {
  return (
    <ul className="routes" aria-label="Routes from Lusaka">
      {list.map((town) => (
        <li key={town}>
          <span className="hub">Lusaka</span>
          <span className="line" aria-hidden="true" />
          <span className="dest">{town}</span>
        </li>
      ))}
    </ul>
  );
}

function Phases({ phases }) {
  return (
    <div className="phases">
      {phases.map((ph, i) => (
        <section key={ph.name} className="phase">
          <div className="phase-n" aria-hidden="true">{i + 1}</div>
          <h3>{ph.name}</h3>
          <p className="when">{ph.when}</p>
          <ul>{ph.items.map((it) => <li key={it}>{it}</li>)}</ul>
        </section>
      ))}
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState(sections[0].id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <div className="airmail" aria-hidden="true" />
      <header className="hero">
        <p className="byline">A proposal by {meta.author}</p>
        <h1>{meta.title}</h1>
        <p className="sub">{meta.subtitle}</p>
      </header>

      <div className="layout">
        <nav className="toc" aria-label="Contents">
          <ol>
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className={active === s.id ? "on" : ""}>{s.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        <main>
          {sections.map((s) => (
            <article key={s.id} id={s.id} className="sec">
              <h2>{s.title}</h2>
              {s.stat && (
                <p className="stat"><strong>{s.stat.value}</strong><span>{s.stat.label}</span></p>
              )}
              {s.blocks.map((b, i) => <Block key={i} b={b} />)}
              {s.routes && <Routes list={s.routes} />}
              {s.phases && <Phases phases={s.phases} />}
            </article>
          ))}

          <footer className="about">
            <h2>About {about.name}</h2>
            <p>{about.blurb}</p>
            <ul>{about.services.map((x) => <li key={x}>{x}</li>)}</ul>
            <p className="tag">{about.tagline}</p>
            <p>{about.cta}</p>
          </footer>
        </main>
      </div>
    </>
  );
}
