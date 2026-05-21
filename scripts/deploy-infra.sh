#!/usr/bin/env bash
#
# Create or update the CloudFormation stack that hosts the ACTive Minds site.
#
# Required env vars:
#   ACM_CERTIFICATE_ARN  ACM cert in us-east-1 covering activemindstherapy.com + www
#
# Optional env vars (with sane defaults):
#   AWS_PROFILE          AWS profile to use
#   STACK_NAME           CloudFormation stack name (default: active-minds-site)
#   AWS_REGION           Region (default: us-east-1) — must be us-east-1 for the cert
#   PRACTICE_EMAIL       Inbox that receives inquiries
#   FROM_EMAIL           SES-verified sender
#
set -euo pipefail

STACK_NAME="${STACK_NAME:-active-minds-site}"
AWS_REGION="${AWS_REGION:-us-east-1}"
PRACTICE_EMAIL="${PRACTICE_EMAIL:-info@activemindstherapy.com}"
FROM_EMAIL="${FROM_EMAIL:-no-reply@activemindstherapy.com}"

if [[ -z "${ACM_CERTIFICATE_ARN:-}" ]]; then
  echo "ERROR: ACM_CERTIFICATE_ARN env var is required (must be a us-east-1 cert)." >&2
  exit 1
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "→ Deploying stack '$STACK_NAME' to $AWS_REGION…"

aws cloudformation deploy \
  --region "$AWS_REGION" \
  --stack-name "$STACK_NAME" \
  --template-file "$ROOT_DIR/infrastructure/stack.yml" \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    AcmCertificateArn="$ACM_CERTIFICATE_ARN" \
    PracticeEmail="$PRACTICE_EMAIL" \
    FromEmail="$FROM_EMAIL"

echo
echo "✓ Stack deployed. Outputs:"
aws cloudformation describe-stacks \
  --region "$AWS_REGION" \
  --stack-name "$STACK_NAME" \
  --query "Stacks[0].Outputs" \
  --output table
