import type { BlogPostMetadata, BlogPostModule, LoadedBlogPost } from "./types";

type BlogPostMetadataModule = Pick<BlogPostModule, "metadata">;

const postLoaders = import.meta.glob<BlogPostModule>("./posts/*/index.mdx");
const metadataModules = import.meta.glob<BlogPostMetadataModule>(
  "./posts/*/metadata.ts",
  { eager: true },
);

function slugFromSourcePath(sourcePath: string) {
  const match = sourcePath.match(
    /^\.\/posts\/([^/]+)\/(?:index\.mdx|metadata\.ts)$/,
  );
  return match?.[1] ?? null;
}

function assertValidMetadata(
  sourcePath: string,
  folderSlug: string,
  metadata: BlogPostMetadata,
) {
  const requiredFields: Array<keyof BlogPostMetadata> = [
    "title",
    "date",
    "description",
    "slug",
  ];

  for (const field of requiredFields) {
    if (!metadata[field]) {
      throw new Error(`${sourcePath}: metadata.${field} is required`);
    }
  }

  if (metadata.slug !== folderSlug) {
    throw new Error(
      `${sourcePath}: metadata.slug must be "${folderSlug}" to match its folder`,
    );
  }

  if (Number.isNaN(Date.parse(metadata.date))) {
    throw new Error(`${sourcePath}: metadata.date must be a valid date`);
  }
}

function loadMetadataEntry(
  sourcePath: string,
  module: BlogPostMetadataModule,
) {
  const folderSlug = slugFromSourcePath(sourcePath);

  if (!folderSlug) {
    throw new Error(`Unexpected blog metadata path: ${sourcePath}`);
  }

  assertValidMetadata(sourcePath, folderSlug, module.metadata);
  return module.metadata;
}

const postMetadata = Object.entries(metadataModules).map(
  ([sourcePath, module]) => loadMetadataEntry(sourcePath, module),
);
const postMetadataBySlug = new Map(
  postMetadata.map((metadata) => [metadata.slug, metadata]),
);

for (const sourcePath of Object.keys(postLoaders)) {
  const slug = slugFromSourcePath(sourcePath);

  if (!slug) {
    throw new Error(`Unexpected blog source path: ${sourcePath}`);
  }

  if (!postMetadataBySlug.has(slug)) {
    throw new Error(`${sourcePath}: matching metadata.ts is required`);
  }
}

for (const metadata of postMetadata) {
  const hasPost = Object.keys(postLoaders).some(
    (sourcePath) => slugFromSourcePath(sourcePath) === metadata.slug,
  );

  if (!hasPost) {
    throw new Error(
      `./posts/${metadata.slug}/metadata.ts: matching index.mdx is required`,
    );
  }
}

async function loadEntry(
  sourcePath: string,
  loader: () => Promise<BlogPostModule>,
): Promise<LoadedBlogPost> {
  const folderSlug = slugFromSourcePath(sourcePath);

  if (!folderSlug) {
    throw new Error(`Unexpected blog source path: ${sourcePath}`);
  }

  const module = await loader();
  assertValidMetadata(sourcePath, folderSlug, module.metadata);

  return {
    ...module,
    sourcePath,
  };
}

export async function loadBlogPost(slug: string) {
  const entry = Object.entries(postLoaders).find(
    ([sourcePath]) => slugFromSourcePath(sourcePath) === slug,
  );

  if (!entry) {
    return null;
  }

  return loadEntry(entry[0], entry[1]);
}

export async function loadBlogPosts() {
  return [...postMetadata]
    .filter((metadata) => !metadata.draft)
    .sort((left, right) => Date.parse(right.date) - Date.parse(left.date));
}
