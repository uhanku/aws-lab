# AWS deploy

## SYNC S3

```SH
aws s3 sync frontend/dist s3://YOUR_BUCKET_NAME \
 --delete
```

## REFRESH CLOUDFRONT CACHE

```SH
aws cloudfront create-invalidation \
 --distribution-id YOUR_DISTRIBUTION_ID \
 --paths "/*"
```
