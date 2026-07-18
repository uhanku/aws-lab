import type { BlogPostMetadata } from '../../types';
import architecture from './architecture.svg';

export const metadata = {
  title: 'Building an MDX blog inside a Vite React site',
  date: '2026-07-14',
  description:
    'How content folders, MDX modules, React components, and Vite routing work together on uhanku.com.',
  slug: 'mdx-blog-system',
  tags: ['React', 'MDX', 'Vite', 'AWS'],
  cover: architecture,
  draft: false,
} satisfies BlogPostMetadata;
