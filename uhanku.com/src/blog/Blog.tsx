import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import './Blog.css';
import './BlogTableOfContents.css';
import { BlogLink } from './components/BlogLink';
import { BlogPostCard } from './components/BlogPostCard';
import { TocConsole } from './components/TocConsole';
import { createMdxComponents } from './components/mdxComponents';
import { loadBlogPost, loadBlogPosts } from './content';
import type { BlogPostMetadata, LoadedBlogPost, Navigate } from './types';
import { useDocumentMetadata } from './useDocumentMetadata';

interface BlogProps {
  onNavigate: Navigate;
  path: string;
}

interface TableOfContentsItem {
  id: string;
  label: string;
  level: 2 | 3;
}

function createHeadingId(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'long',
  }).format(new Date(`${value}T00:00:00`));
}

function estimateReadTime(text: string) {
  return `${Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 220))} min`;
}

let cachedBlogPosts: BlogPostMetadata[] | null = null;
const cachedBlogPostsBySlug = new Map<string, LoadedBlogPost>();
let blogPostsRequest: Promise<BlogPostMetadata[]> | null = null;
const blogPostRequests = new Map<string, Promise<LoadedBlogPost | null>>();

function rememberBlogPosts(posts: BlogPostMetadata[]) {
  cachedBlogPosts = posts;
  return posts;
}

function getCachedBlogPost(slug: string) {
  const post = cachedBlogPostsBySlug.get(slug);

  if (!post || post.metadata.draft || post.metadata.toRelease) {
    return null;
  }

  return post;
}

function loadCachedBlogPosts() {
  if (cachedBlogPosts) {
    return Promise.resolve(cachedBlogPosts);
  }

  if (!blogPostsRequest) {
    blogPostsRequest = loadBlogPosts()
      .then(rememberBlogPosts)
      .catch((reason: unknown) => {
        blogPostsRequest = null;
        throw reason;
      });
  }

  return blogPostsRequest;
}

function loadCachedBlogPost(slug: string) {
  const cachedPost = getCachedBlogPost(slug);

  if (cachedPost) {
    return Promise.resolve(cachedPost);
  }

  const existingRequest = blogPostRequests.get(slug);

  if (existingRequest) {
    return existingRequest;
  }

  const request = loadBlogPost(slug)
    .then((post) => {
      if (post) {
        cachedBlogPostsBySlug.set(slug, post);
      }

      return post;
    })
    .finally(() => {
      blogPostRequests.delete(slug);
    });

  blogPostRequests.set(slug, request);
  return request;
}

function BlogHeader({ onNavigate }: { onNavigate: Navigate }) {
  return (
    <header className="blog-cover__topbar">
      <BlogLink className="blog-brand" onNavigate={onNavigate} to="/">
        UHANKU.COM
      </BlogLink>

      <nav className="blog-nav" aria-label="Primary navigation">
        <BlogLink className="is-active" onNavigate={onNavigate} to="/blog">
          Blog
        </BlogLink>
        {/* <BlogLink onNavigate={onNavigate} to="/me">
          Projects
        </BlogLink> */}
        <BlogLink onNavigate={onNavigate} to="/">
          Profile
        </BlogLink>
      </nav>
    </header>
  );
}

function BlogIndex({ onNavigate }: { onNavigate: Navigate }) {
  const [posts, setPosts] = useState<BlogPostMetadata[]>(
    () => cachedBlogPosts ?? [],
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(cachedBlogPosts === null);

  useDocumentMetadata({
    title: 'Blog',
    description: 'Projects, experiments, and notes from Vinicius Silva.',
    path: '/blog',
  });

  useEffect(() => {
    if (cachedBlogPosts) {
      return;
    }

    let active = true;

    loadCachedBlogPosts()
      .then((loadedPosts) => {
        if (active) {
          setPosts(loadedPosts);
          setLoading(false);
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(
            reason instanceof Error ? reason.message : 'Unable to load posts',
          );
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="blog-content">
      <section className="blog-intro">
        <div className="blog-intro__title blog-reveal blog-reveal--1">
          <p className="blog-eyebrow">NOTES · EXPERIMENTS · LESSONS</p>
          <h1 id="page-title">Updates</h1>
        </div>
        <p className="blog-intro__description blog-reveal blog-reveal--2">
          I’m not trying to have all the answers. I’m simply recording the
          questions that make me want to learn
        </p>
      </section>

      <div className="blog-section-heading">
        <div>
          <span className="green-dot" aria-hidden="true" />
          <span>Latest entries</span>
        </div>
        <span>{String(posts.length).padStart(2, '0')} POSTS</span>
      </div>

      {loading ? <p className="blog-status">Loading posts...</p> : null}
      {error ? <p className="blog-status blog-status--error">{error}</p> : null}

      {!loading && !error ? (
        <section className="blog-list" aria-label="Blog posts">
          {posts.map((post, index) => (
            <BlogPostCard
              key={post.slug}
              index={index}
              onNavigate={onNavigate}
              post={post}
            />
          ))}
        </section>
      ) : null}

      <footer className="blog-footer">
        <div className="blog-footer__status">
          <span className="green-dot" aria-hidden="true" />
          Building, testing, and documenting the mess.
        </div>
        <div className="blog-footer__links">
          <BlogLink
            className="footer-link footer-link--secondary"
            onNavigate={onNavigate}
            to="/"
          >
            <span>Back to profile</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17 12H7m4-4-4 4 4 4" />
            </svg>
          </BlogLink>
          <BlogLink className="footer-link" onNavigate={onNavigate} to="/me">
            <span>Explore my projects</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </BlogLink>
        </div>
      </footer>
    </main>
  );
}

function BlogPostPage({
  onNavigate,
  slug,
}: {
  onNavigate: Navigate;
  slug: string;
}) {
  const [post, setPost] = useState<LoadedBlogPost | null>(() =>
    getCachedBlogPost(slug),
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(
    () => getCachedBlogPost(slug) === null,
  );
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>(
    [],
  );
  const [readTime, setReadTime] = useState('—');
  const postMainRef = useRef<HTMLElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const mdxComponents = useMemo(
    () => createMdxComponents(onNavigate),
    [onNavigate],
  );

  useEffect(() => {
    const cachedPost = getCachedBlogPost(slug);

    if (cachedPost) {
      setPost(cachedPost);
      setError(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);
    setPost(null);

    loadCachedBlogPost(slug)
      .then((loadedPost) => {
        if (!active) {
          return;
        }

        if (
          !loadedPost ||
          loadedPost.metadata.draft ||
          loadedPost.metadata.toRelease
        ) {
          setError('Post not found');
        } else {
          setPost(loadedPost);
        }

        setLoading(false);
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(
            reason instanceof Error ? reason.message : 'Unable to load post',
          );
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [slug]);

  useLayoutEffect(() => {
    const article = articleRef.current;

    if (!post || !article) {
      setTableOfContents([]);
      return;
    }

    const usedIds = new Set<string>();
    const duplicateCounts = new Map<string, number>();
    const items: TableOfContentsItem[] = [];
    const headings = article.querySelectorAll<HTMLHeadingElement>(
      '.blog-prose h2, .blog-prose h3',
    );
    const prose = article.querySelector<HTMLElement>('.blog-prose');

    if (prose) {
      setReadTime(estimateReadTime(prose.textContent ?? ''));
    }

    headings.forEach((heading) => {
      const label = heading.textContent?.trim();

      if (!label) {
        return;
      }

      const baseId = heading.id.trim() || createHeadingId(label);
      let id = baseId;
      let duplicateNumber = duplicateCounts.get(baseId) ?? 1;

      while (usedIds.has(id)) {
        duplicateNumber += 1;
        id = `${baseId}-${duplicateNumber}`;
      }

      duplicateCounts.set(baseId, duplicateNumber);
      usedIds.add(id);
      heading.id = id;

      items.push({
        id,
        label,
        level: heading.tagName === 'H3' ? 3 : 2,
      });
    });

    setTableOfContents(items);
  }, [post, slug]);

  useLayoutEffect(() => {
    if (post) {
      postMainRef.current?.scrollIntoView({
        block: 'start',
        behavior: 'auto',
      });
    }
  }, [post, slug]);

  useDocumentMetadata({
    title: post?.metadata.title ?? 'Blog post',
    description:
      post?.metadata.description ?? 'A project note from Vinicius Silva.',
    path: `/blog/${slug}`,
    image: post?.metadata.cover,
  });

  if (loading) {
    return <main className="blog-content blog-status">Loading post...</main>;
  }

  if (error || !post) {
    return (
      <main className="blog-content blog-not-found">
        <p className="blog-eyebrow">404</p>
        <h1>Post not found</h1>
        <p>{error}</p>
        <BlogLink onNavigate={onNavigate} to="/blog">
          Return to the blog
        </BlogLink>
      </main>
    );
  }

  const Content = post.default;
  const entryNumber = Math.max(
    1,
    (cachedBlogPosts?.findIndex((item) => item.slug === slug) ?? -1) + 1,
  );

  return (
    <main ref={postMainRef} className="blog-content blog-main--post">
      <BlogLink
        className="blog-back-link blog-reveal blog-reveal--1"
        onNavigate={onNavigate}
        to="/blog"
      >
        ← All posts
      </BlogLink>

      <header className="article-hero arcade-panel blog-reveal blog-reveal--2">
        <div className="article-hero__signal" aria-hidden="true">
          ENTRY {String(entryNumber).padStart(2, '0')}
        </div>

        <div className="article-hero__main">
          <h1>{post.metadata.title}</h1>
          <p className="article-deck">{post.metadata.description}</p>
        </div>

        <dl className="article-meta" aria-label="Article metadata">
          <div>
            <dt>Published</dt>
            <dd>
              <time dateTime={post.metadata.date}>
                {formatDate(post.metadata.date)}
              </time>
            </dd>
          </div>
          <div>
            <dt>Read time</dt>
            <dd>{readTime}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd className="status-ready">Verified</dd>
          </div>
        </dl>

        {post.metadata.tags?.length ? (
          <ul className="blog-tags" aria-label="Article tags">
            {post.metadata.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
      </header>

      <article className="blog-article" ref={articleRef}>
        {tableOfContents.length ? <TocConsole items={tableOfContents} /> : null}

        <div className="blog-prose blog-reveal blog-reveal--4">
          <Content components={mdxComponents} />
        </div>
      </article>
    </main>
  );
}

export default function Blog({ onNavigate, path }: BlogProps) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousScrollbarGutter =
      root.style.getPropertyValue('scrollbar-gutter');

    root.style.setProperty('scrollbar-gutter', 'stable');

    return () => {
      if (previousScrollbarGutter) {
        root.style.setProperty('scrollbar-gutter', previousScrollbarGutter);
      } else {
        root.style.removeProperty('scrollbar-gutter');
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (path === '/blog') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [path]);

  const slug = path.startsWith('/blog/')
    ? decodeURIComponent(path.slice('/blog/'.length))
    : null;
  const isSingleSegmentSlug = slug && !slug.includes('/');

  return (
    <div className="blog-page">
      <div className="blog-backdrop" aria-hidden="true">
        <span className="blog-orb blog-orb--one" />
        <span className="blog-orb blog-orb--two" />
        <span className="blog-grid" />
      </div>
      <div className="blog-shell">
        <header className="blog-cover">
          <BlogHeader onNavigate={onNavigate} />
          <div className="blog-cover__meta" aria-hidden="true">
            <span>
              <span className="green-dot" aria-hidden="true" />
              JOURNAL / 02
            </span>
            <span>BUILDING IN PUBLIC</span>
          </div>
          <div className="blog-cover__copy" aria-hidden="true">
            <span className="blog-reveal blog-reveal--1">BUILD</span>
            <span className="blog-reveal blog-reveal--2">WRITE</span>
            <span className="blog-reveal blog-reveal--3">SHARE</span>
          </div>
          <span className="blog-shape blog-shape--one" aria-hidden="true" />
          <span className="blog-shape blog-shape--two" aria-hidden="true" />
          <span className="blog-shape blog-shape--three" aria-hidden="true" />
        </header>
        {path === '/blog' ? (
          <BlogIndex onNavigate={onNavigate} />
        ) : isSingleSegmentSlug ? (
          <BlogPostPage key={slug} onNavigate={onNavigate} slug={slug} />
        ) : (
          <main className="blog-main blog-not-found">
            <p className="blog-eyebrow">404</p>
            <h1>Page not found</h1>
            <BlogLink onNavigate={onNavigate} to="/blog">
              Return to the blog
            </BlogLink>
          </main>
        )}
      </div>
    </div>
  );
}
