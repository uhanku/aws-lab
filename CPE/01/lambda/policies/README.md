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
