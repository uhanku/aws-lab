<p align="center">
  <img src="assets/icon.png" alt="AWS lab icon" width="160" />
</p>

<p align="center"><strong>AWS LAB</strong></p>

<p align="center">
  <img alt="AWS" src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white" />
  <img alt="Lambda" src="https://img.shields.io/badge/Lambda-FD8D3C?style=for-the-badge&logo=awslambda&logoColor=white" />
  <img alt="EC2" src="https://img.shields.io/badge/EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white" />
  <img alt="EventBridge" src="https://img.shields.io/badge/EventBridge-7B5CFF?style=for-the-badge&logo=amazoneventbridge&logoColor=white" />
  <img alt="S3" src="https://img.shields.io/badge/S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white" />
  <img alt="CloudFront" src="https://img.shields.io/badge/CloudFront-2F6BFF?style=for-the-badge&logo=amazoncloudfront&logoColor=white" />
  <br />
  <img alt="React" src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000000" />
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" />
</p>

This repository documents my AWS study environment.

# FLOW

```mermaid
flowchart TD
    A[09:00 EventBridge Schedule<br/>Mon-Thu, Sat-Sun] --> B[Lambda Function]
    B --> C[Create EC2 Spot Instance]

    C --> D[EC2 Running]
    D --> E[Used for Study]

    E --> F[20:00 EventBridge Schedule<br/>Mon-Thu, Sat-Sun]
    F --> G[Lambda Function]
    G --> H[Terminate EC2 Instance]

    H --> I[Instance Removed]
    I --> J[Only Pay for Hours Used]

    J -. Daily Cycle .-> A
```

<br>
<br>

# CURRENT STUDY BILLING

| Item                                                       |               Estimate |
| ---------------------------------------------------------- | ---------------------: |
| EC2 t3.micro Spot: 334.6 hrs × $0.0029/hr                  |           **$0.97/mo** |
| EBS root volume, likely 8 GB × $0.08/GB-mo × 11/24 runtime |          **~$0.29/mo** |
| Lambda/EventBridge                                         |             **~$0.00** |
| **Total**                                                  | **~$1.25–$1.50/month** |

# UHANKU.COM

| Monthly full visits | CloudFront transfer | CloudFront requests | Estimated bill |
| ------------------: | ------------------: | ------------------: | -------------: |
|               1,000 |            0.079 GB |               6,000 |     **~$0.00** |
|              10,000 |            0.791 GB |              60,000 |     **~$0.00** |
|             100,000 |            7.914 GB |             600,000 |     **~$0.00** |
|           1,000,000 |            79.14 GB |           6,000,000 |     **~$0.00** |
|           2,000,000 |           158.28 GB |          12,000,000 |     **~$2.40** |
|          10,000,000 |           791.40 GB |          60,000,000 |    **~$60.00** |
