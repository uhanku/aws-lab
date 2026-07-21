export type PostStatusType =
  | 'experimental'
  | 'progress'
  | 'review'
  | 'draft'
  | 'archived'
  | 'deprecated'
  | 'verified';

const labels: Record<PostStatusType, string> = {
  experimental: 'Experimental',
  progress: 'In progress',
  review: 'Under review',
  draft: 'Draft',
  archived: 'Archived',
  deprecated: 'Deprecated',
  verified: 'Verified',
};

interface PostStatusProps {
  status: PostStatusType;
  label?: string;
}

export function PostStatus({
  status,
  label = labels[status],
}: PostStatusProps) {
  return (
    <span className={`blog-status-badge blog-status-badge--${status}`}>
      <span className="blog-status-badge__signal" aria-hidden="true" />
      {label}
    </span>
  );
}
