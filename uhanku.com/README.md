# AWS deploy

## BUILD

```SH
npm run build
```

## SYNC VERSIONED ASSETS

```SH
aws s3 sync dist/assets/ s3://YOUR_BUCKET_NAME/assets/ \
  --size-only \
  --delete \
  --cache-control "public,max-age=31536000,immutable" \
  --only-show-errors
```

OPTIONAL: REMOVE OLD VERSIONED ASSETS FROM S3 WITH --delete

## UPLOAD INDEX.HTML

```SH
aws s3 cp dist/index.html s3://YOUR_BUCKET_NAME/index.html \
  --content-type "text/html; charset=utf-8" \
  --cache-control "no-cache,max-age=0,must-revalidate" \
  --only-show-errors
```

## REFRESH CLOUDFRONT CACHE

```SH
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/" "/index.html"
```
