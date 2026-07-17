import type { MouseEvent } from "react";
import catImage from "./assets/uhanku-cat.png";

import "./LandingArcade.css";

type LandingArcadeProps = {
  onNavigate: (path: string) => void;
};

type InternalRoute = "/me" | "/blog";

function LandingArcade({ onNavigate }: LandingArcadeProps) {
  const handleInternalRoute =
    (path: InternalRoute) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.altKey ||
        event.ctrlKey ||
        event.shiftKey
      ) {
        return;
      }

      event.preventDefault();
      onNavigate(path);
    };

  return (
    <div className="arcade-page">
      <a className="arcade-skip-link" href="#arcade-main">
        Skip to content
      </a>
      <div className="arcade-scanlines" aria-hidden="true" />

      <header className="arcade-header arcade-reveal">
        <a className="arcade-logo" href="/" aria-label="Uhanku home">
          <span>U</span>
          UHANKU_OS
        </a>
        <div className="arcade-header__status">
          <i aria-hidden="true" />
          SYSTEM ONLINE
        </div>
        <div className="arcade-header__clock">
          PORTO / PT <span>2026</span>
        </div>
      </header>

      <main id="arcade-main" className="arcade-main">
        <section className="arcade-shell" aria-labelledby="arcade-title">
          <aside className="arcade-sidebar arcade-sidebar--left arcade-reveal arcade-reveal--2">
            <p>SELECT MODE</p>
            <nav aria-label="Portfolio sections">
              <a
                className="is-active"
                href="/me"
                onClick={handleInternalRoute("/me")}
              >
                <span>01</span>
                PROJECTS
                <i aria-hidden="true">↗</i>
              </a>
              <a href="/blog" onClick={handleInternalRoute("/blog")}>
                <span>02</span>
                BUILD LOG
                <i aria-hidden="true">↗</i>
              </a>
              <a href="mailto:uhanku@gmail.com">
                <span>03</span>
                CONTACT
                <i aria-hidden="true">↗</i>
              </a>
            </nav>

            <div className="arcade-quest">
              <span>ACTIVE QUEST</span>
              <b>Build useful AI tools</b>
              <div aria-label="Quest progress: 7 percent">
                <i />
              </div>
              <small>67% · permanently in progress</small>
            </div>
          </aside>

          <div className="arcade-character arcade-reveal arcade-reveal--3">
            <div className="arcade-title">
              <p>CHOOSE YOUR BUILDER</p>
              <h1 id="arcade-title">UHANKU</h1>
              <span>FULLSTACK ENGINEER / AI EXPLORER</span>
            </div>

            <div className="arcade-portal">
              <div className="arcade-portal__disc" />
              <div className="arcade-portal__grid" />
              <div className="arcade-character__cat">
                <img
                  src={catImage}
                  alt="Uhanku cat as the main playable character"
                />
              </div>
            </div>

            <div className="arcade-stats" aria-label="Character statistics">
              <span>
                <b>06+</b>
                YEARS
              </span>
              <span>
                <b>04</b>
                PROJECTS
              </span>
              <span>
                <b>99</b>
                CURIOSITY
              </span>
            </div>
          </div>

          <aside className="arcade-sidebar arcade-sidebar--right arcade-reveal arcade-reveal--4">
            <p>CHARACTER DATA</p>
            <dl>
              <div>
                <dt>Class</dt>
                <dd>Senior Engineer</dd>
              </div>
              <div>
                <dt>Specialty</dt>
                <dd>Useful systems</dd>
              </div>
              <div>
                <dt>Region</dt>
                <dd>Porto, Portugal</dd>
              </div>
              <div>
                <dt>Alignment</dt>
                <dd>Open source</dd>
              </div>
            </dl>

            <div className="arcade-skills">
              <span>SKILL MATRIX</span>
              <label>
                Frontend
                <i>
                  <b className="arcade-skill arcade-skill--frontend" />
                </i>
              </label>
              <label>
                Backend
                <i>
                  <b className="arcade-skill arcade-skill--backend" />
                </i>
              </label>
              <label>
                AI / RAG
                <i>
                  <b className="arcade-skill arcade-skill--ai" />
                </i>
              </label>
              <label>
                AWS
                <i>
                  <b className="arcade-skill arcade-skill--aws" />
                </i>
              </label>
            </div>

            <a className="arcade-start" href="mailto:uhanku@gmail.com">
              START CONVERSATION <span aria-hidden="true">▶</span>
            </a>
          </aside>
        </section>

        <div className="arcade-marquee" aria-hidden="true">
          <div>
            ★ DOC LLM &nbsp; ◆ GPT RUNNER &nbsp; ● CHAT BOT OPEN &nbsp; ✦ AWS
            LAB &nbsp; ★ DOC LLM &nbsp; ◆ GPT RUNNER &nbsp; ● CHAT BOT OPEN
            &nbsp; ✦ AWS LAB &nbsp;
          </div>
        </div>
      </main>
    </div>
  );
}

export default LandingArcade;
