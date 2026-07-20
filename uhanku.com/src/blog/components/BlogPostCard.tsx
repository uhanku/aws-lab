import type { CSSProperties } from 'react';
import type { BlogPostMetadata, Navigate } from '../types';
import { BlogLink } from './BlogLink';
import { BlogTags } from './BlogTags';

interface BlogPostCardProps {
  post: BlogPostMetadata;
  index: number;
  onNavigate: Navigate;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
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
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="post-card__body">
        <p className="post-card__type">
          {post.toRelease ? 'COMING SOON' : 'JOURNAL ENTRY'}
        </p>
        <h2 className="glitch-title" data-text={post.title}>
          {post.title}
        </h2>
        <p>{post.description}</p>
      </div>

      <div className="post-card__footer">
        {post.tags?.length ? (
          <BlogTags
            ariaLabel="Post tags"
            color={post.color}
            tags={post.tags}
          />
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
      className={`post-card blog-reveal blog-reveal--card${post.toRelease ? ' post-card--disabled post-card--to-release post-card--rgb-glitch' : ''}`}
      style={
        {
          '--blog-reveal-delay': `${Math.min(index, 7) * 0.1}s`,
          '--post-color': post.color
            ? `var(${post.color})`
            : 'var(--arcade-acid)',
        } as CSSProperties
      }
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
