import { useEffect, useMemo, useState } from "react";

import "./Blog.css";
import { BlogLink } from "./components/BlogLink";
import { createMdxComponents } from "./components/mdxComponents";
import { loadBlogPost, loadBlogPosts } from "./content";
import type { BlogPostMetadata, LoadedBlogPost, Navigate } from "./types";
import { useDocumentMetadata } from "./useDocumentMetadata";

interface BlogProps {
  onNavigate: Navigate;
  path: string;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
  }).format(new Date(`${value}T00:00:00`));
}

function BlogHeader({ onNavigate }: { onNavigate: Navigate }) {
  return (
    <header className="blog-header">
      <BlogLink className="blog-brand" onNavigate={onNavigate} to="/">
        uhanku.com
      </BlogLink>
      <nav aria-label="Blog navigation">
        <BlogLink onNavigate={onNavigate} to="/blog">
          Blog
        </BlogLink>
        <BlogLink onNavigate={onNavigate} to="/me">
          Projects
        </BlogLink>
      </nav>
    </header>
  );
}

function BlogIndex({ onNavigate }: { onNavigate: Navigate }) {
  const [posts, setPosts] = useState<BlogPostMetadata[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useDocumentMetadata({
    title: "Blog",
    description: "Projects, experiments, and notes from Vinicius Silva.",
    path: "/blog",
  });

  useEffect(() => {
    let active = true;

    loadBlogPosts()
      .then((loadedPosts) => {
        if (active) {
          setPosts(loadedPosts.map((post) => post.metadata));
          setLoading(false);
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(
            reason instanceof Error ? reason.message : "Unable to load posts",
          );
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="blog-main">
      <section className="blog-intro">
        <p className="blog-eyebrow">BUILDING IN PUBLIC</p>
        <h1>Updates</h1>
        <p>
          Technical write-ups, experiments, decisions, and lessons from the
          projects I build.
        </p>
      </section>

      {loading ? <p className="blog-status">Loading posts...</p> : null}
      {error ? <p className="blog-status blog-status--error">{error}</p> : null}

      {!loading && !error ? (
        <section className="blog-list" aria-label="Blog posts">
          {posts.map((post) => (
            <article className="blog-card" key={post.slug}>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <h2>
                <BlogLink onNavigate={onNavigate} to={`/blog/${post.slug}`}>
                  {post.title}
                </BlogLink>
              </h2>
              <p>{post.description}</p>
              {post.tags?.length ? (
                <ul className="blog-tags" aria-label="Post tags">
                  {post.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </section>
      ) : null}
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
  const [post, setPost] = useState<LoadedBlogPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const mdxComponents = useMemo(
    () => createMdxComponents(onNavigate),
    [onNavigate],
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setPost(null);

    loadBlogPost(slug)
      .then((loadedPost) => {
        if (!active) {
          return;
        }

        if (
          !loadedPost ||
          (!import.meta.env.DEV && loadedPost.metadata.draft)
        ) {
          setError("Post not found");
        } else {
          setPost(loadedPost);
        }

        setLoading(false);
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(
            reason instanceof Error ? reason.message : "Unable to load post",
          );
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [slug]);

  useDocumentMetadata({
    title: post?.metadata.title ?? "Blog post",
    description:
      post?.metadata.description ?? "A project note from Vinicius Silva.",
    path: `/blog/${slug}`,
    image: post?.metadata.cover,
  });

  if (loading) {
    return <main className="blog-main blog-status">Loading post...</main>;
  }

  if (error || !post) {
    return (
      <main className="blog-main blog-not-found">
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

  return (
    <main className="blog-main">
      <article className="blog-article">
        <BlogLink className="blog-back-link" onNavigate={onNavigate} to="/blog">
          ← All posts
        </BlogLink>

        <header className="blog-article-header">
          <time dateTime={post.metadata.date}>
            {formatDate(post.metadata.date)}
          </time>
          <h1>{post.metadata.title}</h1>
          <p>{post.metadata.description}</p>
        </header>

        <div className="blog-prose">
          <Content components={mdxComponents} />
        </div>
      </article>
    </main>
  );
}

export default function Blog({ onNavigate, path }: BlogProps) {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [path]);

  const slug = path.startsWith("/blog/")
    ? decodeURIComponent(path.slice("/blog/".length))
    : null;
  const isSingleSegmentSlug = slug && !slug.includes("/");

  return (
    <div className="blog-shell">
      <BlogHeader onNavigate={onNavigate} />
      {path === "/blog" ? (
        <BlogIndex onNavigate={onNavigate} />
      ) : isSingleSegmentSlug ? (
        <BlogPostPage onNavigate={onNavigate} slug={slug} />
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
  );
}
