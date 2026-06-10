# CREATE SECURITY GROUP FOR EC2

```SH
SG_ID=$(aws ec2 create-security-group \
  --group-name '<SECURITY_GROUP_NAME>' \
  --description 'Security group for EC2 instance' \
  --vpc-id '<VPC_ID>' \
  --query 'GroupId' \
  --output text)

aws ec2 authorize-security-group-ingress \
  --group-id "$SG_ID" \
  --ip-permissions '[
    {
      "IpProtocol": "tcp",
      "FromPort": 22,
      "ToPort": 22,
      "IpRanges": [
        {
          "CidrIp": "<YOUR_PUBLIC_IP>/32",
          "Description": "SSH access from trusted IP only"
        }
      ]
    }
  ]'
```

## GET SG_ID TO ADD TO launch-template.json

```SH
aws ec2 describe-security-groups \
  --filters Name=group-name,Values=<GROUP_NAME> Name=vpc-id,Values=<VPC_ID> \
  --query 'SecurityGroups[0].GroupId' \
  --output text
```

# CREATE EC2 TEMPLATE

```SH
aws ec2 create-launch-template \
  --launch-template-name '<LAUNCH_TEMPLATE_NAME>' \
  --version-description 'spot t3.micro example instance' \
  --launch-template-data file://launch-template.json
```

# TEST EC2 TEMPLATE

## START

```SH
aws ec2 run-instances \
  --launch-template LaunchTemplateName='<LAUNCH_TEMPLATE_NAME>' \
  --count 1
```

## TERMINATE
```SH
INSTANCE_ID=$(aws ec2 run-instances \
  --launch-template LaunchTemplateName='<LAUNCH_TEMPLATE_NAME>' \
  --count 1 \
  --query 'Instances[0].InstanceId' \
  --output text)

aws ec2 terminate-instances \
  --instance-ids "$INSTANCE_ID"
```