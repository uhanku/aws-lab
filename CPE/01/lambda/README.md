# LAMBDA

```SH
zip server.zip server.mjs

ROLE_ARN=$(aws iam get-role \
  --role-name ec2-scheduler-lambda-role \
  --query 'Role.Arn' \
  --output text)

aws lambda create-function \
  --function-name ec2-t1-elb-scheduler \
  --runtime nodejs24.x \
  --role "$ROLE_ARN" \
  --handler server.handler \
  --zip-file fileb://server.zip \
  --timeout 30
```

# TEST LAMBDA

## START

```SH
aws lambda invoke \
  --function-name ec2-t1-elb-scheduler \
  --payload '{"action":"start"}' \
  response-start.json
```

## TERMINATE

```SH
aws lambda invoke \
  --function-name ec2-t1-elb-scheduler \
  --payload '{"action":"terminate"}' \
  response-terminate.json
```
