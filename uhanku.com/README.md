# AWS deployment

The pre-push Git hook builds `uhanku.com`, uploads the generated files to S3, and invalidates the CloudFront cache for the site entry point.

## Build

Run the production build from the `uhanku.com` directory:

```sh
npm run build
```

The deployment should stop if `dist/index.html` was not generated.

```sh
if [ ! -f dist/index.html ]; then
  printf '%s\n' "Build failed: dist/index.html is missing." >&2
  exit 1
fi
```

## Upload versioned assets

Upload the generated assets with long-lived immutable caching:

```sh
aws s3 sync dist/assets/ s3://YOUR_BUCKET_NAME/assets/ \
  --size-only \
  --cache-control "public,max-age=31536000,immutable" \
  --only-show-errors
```

Versioned assets are not deleted automatically. This prevents older deployments from breaking if a cached HTML document still references an earlier asset version.

To remove unused assets manually, add `--delete` only after confirming that no active deployment references them:

```sh
aws s3 sync dist/assets/ s3://YOUR_BUCKET_NAME/assets/ \
  --size-only \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --only-show-errors
```

## Upload `index.html`

Upload the site entry point with a short browser and shared-cache lifetime:

```sh
aws s3 cp dist/index.html s3://YOUR_BUCKET_NAME/index.html \
  --content-type "text/html; charset=utf-8" \
  --cache-control "public,max-age=3600,s-maxage=3600,stale-while-revalidate=30" \
  --only-show-errors
```

This allows browsers and CloudFront to cache `index.html` for one hour while permitting a stale response to be served for up to 30 seconds during revalidation.

## Invalidate the CloudFront cache

Invalidate both the root path and `index.html` after uploading the new build:

```sh
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/" "/index.html"
```

To capture the invalidation ID:

```sh
invalidation_id="$(
  aws cloudfront create-invalidation \
    --distribution-id YOUR_DISTRIBUTION_ID \
    --paths "/" "/index.html" \
    --query "Invalidation.Id" \
    --output text
)"

printf '%s\n' "CloudFront invalidation: $invalidation_id"
```

## Pre-push deployment hook

The complete hook:

```sh
#!/bin/sh

set -eu

bucket="s3://uhanku"
distribution_id="E2THHENGBXLV7Q"

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root/uhanku.com"

printf '%s\n' "Building uhanku.com..."
npm run build

if [ ! -f dist/index.html ]; then
  printf '%s\n' "Build failed: dist/index.html is missing." >&2
  exit 1
fi

printf '%s\n' "Uploading versioned assets..."
aws s3 sync dist/assets/ "$bucket/assets/" \
  --size-only \
  --cache-control "public,max-age=31536000,immutable" \
  --only-show-errors

printf '%s\n' "Uploading index.html..."
aws s3 cp dist/index.html "$bucket/index.html" \
  --content-type "text/html; charset=utf-8" \
  --cache-control "public,max-age=3600,s-maxage=3600,stale-while-revalidate=30" \
  --only-show-errors

printf '%s\n' "Invalidating index.html..."
invalidation_id="$(
  aws cloudfront create-invalidation \
    --distribution-id "$distribution_id" \
    --paths "/" "/index.html" \
    --query "Invalidation.Id" \
    --output text
)"

printf '%s\n' "Deployment complete."
printf '%s\n' "CloudFront invalidation: $invalidation_id"
```
