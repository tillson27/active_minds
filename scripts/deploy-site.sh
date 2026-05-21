#!/usr/bin/env bash
#
# Build the Vite site, sync the dist/ output to the site bucket, and invalidate
# CloudFront so the new bundle is served immediately.
#
# Required: the CloudFormation stack must already exist (see deploy-infra.sh).
#
set -euo pipefail

STACK_NAME="${STACK_NAME:-active-minds-site}"
AWS_REGION="${AWS_REGION:-us-east-1}"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "→ Reading stack outputs…"
BUCKET="$(
  aws cloudformation describe-stacks --region "$AWS_REGION" --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='SiteBucketName'].OutputValue" --output text
)"
DISTRIBUTION_ID="$(
  aws cloudformation describe-stacks --region "$AWS_REGION" --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" --output text
)"
API_URL="$(
  aws cloudformation describe-stacks --region "$AWS_REGION" --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='ContactApiUrl'].OutputValue" --output text
)"

if [[ -z "$BUCKET" || "$BUCKET" == "None" ]]; then
  echo "ERROR: could not read SiteBucketName from stack outputs." >&2
  exit 1
fi

echo "→ Bucket:        $BUCKET"
echo "→ Distribution:  $DISTRIBUTION_ID"
echo "→ Contact API:   $API_URL"

echo "→ Installing site dependencies…"
(cd "$ROOT_DIR" && npm install)

echo "→ Building Vite bundle…"
VITE_CONTACT_API_URL="$API_URL" \
  (cd "$ROOT_DIR" && npm run build)

echo "→ Syncing immutable assets (1y cache)…"
aws s3 sync "$ROOT_DIR/dist/" "s3://$BUCKET/" \
  --region "$AWS_REGION" \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" \
  --exclude "favicon.svg" \
  --exclude "robots.txt"

echo "→ Syncing index.html / favicon (no-cache)…"
aws s3 sync "$ROOT_DIR/dist/" "s3://$BUCKET/" \
  --region "$AWS_REGION" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --exclude "*" \
  --include "*.html" \
  --include "favicon.svg" \
  --include "robots.txt"

echo "→ Invalidating CloudFront…"
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --no-cli-pager > /dev/null

echo
echo "✓ Site deployed. Live URL: https://${CUSTOM_DOMAIN:-www.activemindstherapy.com}/"
