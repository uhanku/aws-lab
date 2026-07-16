import { useEffect, type CSSProperties } from "react";
import chatBotOpenIcon from "../assets/chat-bot-open-repo-icon.png";
import docLlmIcon from "../assets/doc-llm-repo-icon.png";
import faviconIcon from "../assets/favicon.svg";
import gptRunnerIcon from "../assets/gpt-runner-repo-icon.png";
import meBackground from "../assets/bg.png";
import "./Me.css";

import ProjectCard, { type ProjectCardTheme } from "./ProjectCard";

type Project = {
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  href: string;
  cta: string;
  theme: ProjectCardTheme;
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
    theme: "doc-blue",
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
    theme: "chat-orange",
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
    theme: "runner-teal",
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
    icon: faviconIcon,
    iconAlt: "Sandbox Icon",
    theme: "purple",
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
    <main
      className="me-page"
      style={{ "--me-background": `url(${meBackground})` } as CSSProperties}
    >
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
          <ProjectCard key={project.title} {...project} />
        ))}
      </section>
    </main>
  );
}
