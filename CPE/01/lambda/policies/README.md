# (CREATE) ROLE

```SH
aws iam create-role \
  --role-name ec2-scheduler-lambda-role \
  --assume-role-policy-document file://lambda-trust-policy.json
```

## USE ATTACHED/MANAGED POLICY

```SH
aws iam attach-role-policy \
  --role-name ec2-scheduler-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

## USE INLINE POLICY

```SH
aws iam put-role-policy \
  --role-name ec2-scheduler-lambda-role \
  --policy-name ec2-scheduler-policy \
  --policy-document file://ec2-scheduler-policy.json
```

# (INSPECT)

## GET LAMBDA ROLE

```SH
ROLE_ARN=$(aws lambda get-function-configuration \
  --function-name ec2-t1-elb-scheduler \
  --query 'Role' \
  --output text)

ROLE_NAME=$(basename "$ROLE_ARN")
```

## INSPECT ROLE POLICIES

```SH
aws iam list-attached-role-policies --role-name "$ROLE_NAME"
aws iam list-role-policies --role-name "$ROLE_NAME"
```

## VIEW INLINE POLICY DETAILS

```SH
aws iam get-role-policy \
  --role-name "$ROLE_NAME" \
  --policy-name "$POLICY_NAME"
```
  
## VIEW ATTACHED POLICY DETAILS

```SH
POLICY_ARN=""

VERSION_ID=$(aws iam get-policy \
  --policy-arn "$POLICY_ARN" \
  --query 'Policy.DefaultVersionId' \
  --output text)

aws iam get-policy-version \
  --policy-arn "$POLICY_ARN" \
  --version-id "$VERSION_ID" \
  --query 'PolicyVersion.Document'
```

# SCHEDULE

## CREATE ROLE

```SH
aws iam create-role \
  --role-name eventbridge-scheduler-lambda-role \
  --assume-role-policy-document file://scheduler-trust-policy.json
```

## ADD LAMBDA_ARN TO scheduler-invoke-policy.json 

```SH
LAMBDA_ARN=$(aws lambda get-function \
--function-name ec2-t1-elb-scheduler \
--query 'Configuration.FunctionArn' \
--output text)
```

## ADD POLICY TO SCHEDULE ROLE

```SH
aws iam put-role-policy \
  --role-name eventbridge-scheduler-lambda-role \
  --policy-name invoke-ec2-scheduler-lambda \
  --policy-document file://scheduler-invoke-policy.json
```

## CREATE SCHEDULERS

```SH
LAMBDA_ARN=$(aws lambda get-function \
--function-name ec2-t1-elb-scheduler \
--query 'Configuration.FunctionArn' \
--output text)

SCHEDULER_ROLE_ARN=$(aws iam get-role \
  --role-name eventbridge-scheduler-lambda-role \
  --query 'Role.Arn' \
  --output text)

aws scheduler create-schedule \
  --name start-t1-elb-at-0900 \
  --schedule-expression "cron(0 9 * * ? *)" \
  --schedule-expression-timezone "Europe/Lisbon" \
  --flexible-time-window '{"Mode":"OFF"}' \
  --target "Arn=$LAMBDA_ARN,RoleArn=$SCHEDULER_ROLE_ARN,Input={\"action\":\"start\"}"

aws scheduler create-schedule \
  --name terminate-t1-elb-at-2000 \
  --schedule-expression "cron(0 20 * * ? *)" \
  --schedule-expression-timezone "Europe/Lisbon" \
  --flexible-time-window '{"Mode":"OFF"}' \
  --target "Arn=$LAMBDA_ARN,RoleArn=$SCHEDULER_ROLE_ARN,Input={\"action\":\"terminate\"}"
```