import type { ReactNode } from "react";
import styles from "./ProjectCard.module.css";

export type ProjectCardTheme =
  | "doc-blue"
  | "chat-orange"
  | "runner-teal"
  | "purple";

export type ProjectCardProps = {
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

export default function ProjectCard({
  eyebrow,
  title,
  description,
  tags,
  href,
  cta,
  theme,
  icon,
  iconAlt,
  external = false,
}: ProjectCardProps): ReactNode {
  return (
    <a
      className={`${styles.card} ${styles[`theme--${theme}`]}`}
      href={href}
      rel={external ? "noreferrer" : undefined}
      target={external ? "_blank" : undefined}
    >
      <div className={styles.top}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        {icon ? (
          <span className={styles.icon}>
            <img src={icon} alt={iconAlt} />
          </span>
        ) : (
          <span className={styles.blogIcon} aria-hidden="true">
            <span>⌁</span>
          </span>
        )}
      </div>

      <div className={styles.header}>
        <h2>{title}</h2>
        <span className={styles.arrow} aria-hidden="true">
          {external ? "↗" : "→"}
        </span>
      </div>

      <p>{description}</p>

      <ul className={styles.tags} aria-label={`${title} tags`}>
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>

      <span className={styles.cta}>{cta}</span>
    </a>
  );
}
