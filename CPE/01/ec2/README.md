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