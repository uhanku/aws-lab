# CREATE LAMBDA

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
  --handler index.handler \
  --zip-file fileb://index.zip \
  --timeout 30
```

# OR DELETE LAMBDA
```SH
aws lambda delete-function \
  --region eu-north-1 \
  --function-name ec2-t1-elb-scheduler
```


# TEST LAMBDA

## START

```SH
aws lambda invoke \
  --function-name ec2-t1-elb-scheduler \
  --cli-binary-format raw-in-base64-out \
  --payload '{"action":"start"}' \
  response-start.json
```

## TERMINATE

```SH
aws lambda invoke \
  --function-name ec2-t1-elb-scheduler \
  --cli-binary-format raw-in-base64-out \
  --payload '{"action":"terminate"}' \
  response-stop.json
```
