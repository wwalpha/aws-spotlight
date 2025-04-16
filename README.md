# AWS Resource Management System - AWS SpotLight

## Architecture

![img](./docs/architecture.png)

```
git tag -d v0.2.0
git push origin :refs/tags/v0.2.0
```

## 開発環境構築

```
cd terraform
terraform workspace select dev
yarn start
cd ../backend/cloudtrail
yarn install
yarn init:events
yarn patch
cd ../daily_batch
yarn install
yarn build
aws s3 sync s3://spotlight-material-us-east-1-prod/CloudTrail/ s3://spotlight-material-us-east-1-dev/CloudTrail/
```
