import { useEffect, type MouseEvent } from "react";
const profileImage = "/profile.png";
import "./Landing.css";
import LandingArcade from "./LandingArcade";

type LandingProps = {
  onNavigate: (path: string) => void;
};

type SocialLink = {
  label: string;
  handle: string;
  href: string;
};

const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    handle: "uhanku",
    href: "https://github.com/uhanku",
  },
  {
    label: "Discord",
    handle: "uhanku",
    href: "https://discord.com/users/274566601905405962",
  },
  {
    label: "Email",
    handle: "uhanku@gmail.com",
    href: "mailto:uhanku@gmail.com",
  },
];

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function Landing({ onNavigate }: LandingProps) {
  useEffect(() => {
    document.body.classList.add("landing-profile-page");

    return () => {
      document.body.classList.remove("landing-profile-page");
    };
  }, []);

  const handleNavigate = (
    event: MouseEvent<HTMLAnchorElement>,
    path: string,
  ) => {
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

  const renderProfileLanding = () => (
    <main className="landing-profile">
      <div className="landing-profile__backdrop" aria-hidden="true">
        <span className="landing-profile__orb landing-profile__orb--one" />
        <span className="landing-profile__orb landing-profile__orb--two" />
        <span className="landing-profile__grid" />
      </div>

      <section
        className="landing-profile__shell"
        aria-labelledby="profile-name"
      >
        <header className="landing-profile__cover">
          <div className="landing-profile__cover-meta">
            <span>UHANKU.COM</span>
            <span>PROFILE / 01</span>
          </div>

          <div className="landing-profile__cover-copy" aria-hidden="true">
            <span>CREATE</span>
            <span>SHIP</span>
            <span>SHARE</span>
          </div>

          <span
            className="landing-profile__shape landing-profile__shape--one"
            aria-hidden="true"
          />
          <span
            className="landing-profile__shape landing-profile__shape--two"
            aria-hidden="true"
          />
          <span
            className="landing-profile__shape landing-profile__shape--three"
            aria-hidden="true"
          />
        </header>

        <div className="landing-profile__content">
          <div className="landing-profile__avatar-wrap">
            <img
              className="landing-profile__avatar"
              src={profileImage}
              alt="Uhanku"
            />
            <span
              className="landing-profile__availability-dot"
              aria-hidden="true"
            />
          </div>

          <div className="landing-profile__identity">
            <p className="landing-profile__eyebrow">
              Fullstack Dev · Open source
            </p>
            <h1 id="profile-name">Uhanku</h1>
            <p className="landing-profile__handle">@uhanku</p>
          </div>

          <p className="landing-profile__bio">
            No hype and no polished nonsense, just building in public, exploring
            AI and sharing where all this craziness is going...
          </p>

          <nav
            className="landing-profile__socials"
            aria-label="Social profiles"
          >
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${social.label}: ${social.handle}`}
              >
                <span>
                  <strong>{social.label}</strong>
                  <small>{social.handle}</small>
                </span>
                <ArrowUpRight />
              </a>
            ))}
          </nav>

          <div className="landing-profile__footer">
            <div className="landing-profile__status">
              <span aria-hidden="true" />
              Open to trying new ideas
            </div>

            <div className="landing-profile__ctas">
              <a
                className="landing-profile__cta"
                href="/me"
                onClick={(event) => handleNavigate(event, "/me")}
              >
                <span>Explore my projects</span>
                <ArrowUpRight />
              </a>
              <a
                className="landing-profile__cta"
                href="/blog"
                onClick={(event) => handleNavigate(event, "/blog")}
              >
                <span>Read my blog</span>
                <ArrowUpRight />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );

  return import.meta.env.VITE_LANDING_STYLE === "profile" ? (
    renderProfileLanding()
  ) : (
    <LandingArcade onNavigate={onNavigate} />
  );
}

export default Landing;
