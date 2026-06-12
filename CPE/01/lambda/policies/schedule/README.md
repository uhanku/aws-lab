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
  --schedule-expression "cron(0 20 ? * MON-THU,SAT-SUN *)" \
  --schedule-expression-timezone "Europe/Lisbon" \
  --flexible-time-window '{"Mode":"OFF"}' \
  --target "$(jq -n \
    --arg arn "$LAMBDA_ARN" \
    --arg role "$SCHEDULER_ROLE_ARN" \
    --arg input '{"action":"start"}' \
    '{Arn:$arn, RoleArn:$role, Input:$input}')"

aws scheduler create-schedule \
  --name terminate-t1-elb-at-2000 \
  --schedule-expression "cron(0 9 ? * MON-THU,SAT-SUN *)" \
  --schedule-expression-timezone "Europe/Lisbon" \
  --flexible-time-window '{"Mode":"OFF"}' \
  --target "$(jq -n \
    --arg arn "$LAMBDA_ARN" \
    --arg role "$SCHEDULER_ROLE_ARN" \
    --arg input '{"action":"terminate"}' \
    '{Arn:$arn, RoleArn:$role, Input:$input}')"
```