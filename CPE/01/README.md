# Objective
- CREATE A BASE EC2 INSTANCE FLOW FOR FUTURE TESTS


# ALLOW SSH CONNECTION TO FUTURE EC2 INSTANCES

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