import type { ComponentType, ElementType } from 'react';

export interface BlogPostMetadata {
  title: string;
  date: string;
  description: string;
  slug: string;
  tags?: string[];
  cover?: string;
  draft?: boolean;
  toRelease?: boolean;
}

export interface BlogPostModule {
  default: ComponentType<{
    components?: Record<string, ElementType>;
  }>;
  metadata: BlogPostMetadata;
}

export interface LoadedBlogPost extends BlogPostModule {
  sourcePath: string;
}

export type Navigate = (path: string) => void;
