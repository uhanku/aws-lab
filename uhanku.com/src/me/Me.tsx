import { useEffect } from "react";
import "./Me.css";

import chatBotOpenIcon from "../assets/chat-bot-open-repo-icon.png";
import docLlmIcon from "../assets/doc-llm-repo-icon.png";
import gptRunnerIcon from "../assets/gpt-runner-repo-icon.png";

type Project = {
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  cta: string;
  accent: string;
  icon?: string;
  iconAlt?: string;
  external?: boolean;
};

const projects: Project[] = [
  {
    eyebrow: "AI Documents",
    title: "Doc LLM",
    description:
      "A document workspace for uploading PDFs, ingesting their contents, querying them with AI, and chatting per document.",
    tags: ["Next.js", "RAG", "PostgreSQL", "pgvector"],
    href: "https://github.com/uhanku/doc-llm",
    cta: "View repository",
    accent: "doc-blue",
    icon: docLlmIcon,
    iconAlt: "Doc LLM repository icon",
    external: true,
  },
  {
    eyebrow: "AI Chat",
    title: "Chat Bot Open",
    description:
      "A chat assistant app for visitor conversations, lead capture, long threads, summaries, and request limits.",
    tags: ["Next.js", "PostgreSQL", "OpenAI", "Docker"],
    href: "https://github.com/uhanku/chat-bot-open",
    cta: "View repository",
    accent: "chat-orange",
    icon: chatBotOpenIcon,
    iconAlt: "Chat Bot Open repository icon",
    external: true,
  },
  {
    eyebrow: "SANDBOX",
    title: "GPT Runner",
    description:
      "A NestJS API for creating jobs, preparing disposable workspaces, running commands, and collecting artifacts.",
    tags: ["NestJS", "TypeScript", "MongoDB", "Docker"],
    href: "https://github.com/uhanku/gpt-runner",
    cta: "View repository",
    accent: "runner-teal",
    icon: gptRunnerIcon,
    iconAlt: "GPT Runner repository icon",
    external: true,
  },
  {
    eyebrow: "Build in Public",
    title: "Blog / Dev Logs",
    description:
      "A place for build-in-public notes, technical decisions, progress updates, screenshots, and lessons learned.",
    tags: ["Docs", "Progress", "AI", "Lessons"],
    href: "/blog",
    cta: "Open blog",
    accent: "purple",
  },
];

const particleAccents = [
  "doc-blue",
  "chat-orange",
  "runner-teal",
  "purple",
] as const;

export default function Me() {
  useEffect(() => {
    document.body.classList.add("me-page");

    return () => {
      document.body.classList.remove("me-page");
    };
  }, []);

  return (
    <main className="me-page">
      <div className="me-page__background" aria-hidden="true" />
      <div className="me-page__particles" aria-hidden="true">
        {particleAccents.flatMap((accent) =>
          Array.from({ length: 16 }, (_, index) => (
            <span
              className={`me-page__particle me-page__particle--${accent}`}
              key={`${accent}-${index}`}
            />
          )),
        )}
      </div>
      <section
        id="project-grid"
        className="project-grid"
        aria-label="Featured projects"
      >
        {projects.map((project) => (
          <a
            className={`project-card project-card--${project.accent}`}
            href={project.href}
            key={project.title}
            rel={project.external ? "noreferrer" : undefined}
            target={project.external ? "_blank" : undefined}
          >
            <div className="project-card__top">
              <span className="project-card__eyebrow">{project.eyebrow}</span>
              {project.icon ? (
                <span className="project-card__icon">
                  <img src={project.icon} alt={project.iconAlt} />
                </span>
              ) : (
                <span className="project-card__blog-icon" aria-hidden="true">
                  <span>⌁</span>
                </span>
              )}
            </div>

            <div className="project-card__header">
              <h2>{project.title}</h2>
              <span className="project-card__arrow" aria-hidden="true">
                {project.external ? "↗" : "→"}
              </span>
            </div>

            <p>{project.description}</p>

            <ul
              className="project-card__tags"
              aria-label={`${project.title} tags`}
            >
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>

            <span className="project-card__cta">{project.cta}</span>
          </a>
        ))}
      </section>
    </main>
  );
}
