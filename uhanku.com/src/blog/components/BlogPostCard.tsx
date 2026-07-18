import type { BlogPostMetadata, Navigate } from "../types";
import { BlogLink } from "./BlogLink";

interface BlogPostCardProps {
  post: BlogPostMetadata;
  index: number;
  onNavigate: Navigate;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(new Date(`${value}T00:00:00`))
    .toUpperCase();
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function BlogPostCard({ post, index, onNavigate }: BlogPostCardProps) {
  const content = (
    <>
      <div className="post-card__topline">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span className="post-number">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="post-card__body">
        <p className="post-card__type">
          {post.toRelease ? "COMING SOON" : "JOURNAL ENTRY"}
        </p>
        <h2>{post.title}</h2>
        <p>{post.description}</p>
      </div>

      <div className="post-card__footer">
        {post.tags?.length ? (
          <ul className="blog-tags" aria-label="Post tags">
            {post.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : (
          <span />
        )}
        <span className="post-arrow">
          <ArrowIcon />
        </span>
      </div>
    </>
  );

  return (
    <article
      className={`post-card${post.toRelease ? " post-card--disabled" : ""}`}
    >
      {post.toRelease ? (
        <div className="post-card__disabled-link" aria-disabled="true">
          {content}
        </div>
      ) : (
        <BlogLink onNavigate={onNavigate} to={`/blog/${post.slug}`}>
          {content}
        </BlogLink>
      )}
    </article>
  );
}
