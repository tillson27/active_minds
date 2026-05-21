#!/usr/bin/env bash
#
# Package the Lambda contact handler and update the function code in place.
# Run this after `deploy-infra.sh` has stood up the stack.
#
set -euo pipefail

STACK_NAME="${STACK_NAME:-active-minds-site}"
AWS_REGION="${AWS_REGION:-us-east-1}"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"
LAMBDA_DIR="$ROOT_DIR/lambda"

echo "→ Installing Lambda dependencies…"
(cd "$LAMBDA_DIR" && npm install --omit=dev)

echo "→ Bundling function.zip…"
(
  cd "$LAMBDA_DIR"
  rm -f function.zip
  zip -qr function.zip contact.mjs emailTemplate.mjs package.json node_modules
)

FN_NAME="$(
  aws cloudformation describe-stacks \
    --region "$AWS_REGION" \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='ContactFunctionName'].OutputValue" \
    --output text
)"

if [[ -z "$FN_NAME" || "$FN_NAME" == "None" ]]; then
  echo "ERROR: could not find ContactFunctionName output from stack $STACK_NAME" >&2
  exit 1
fi

echo "→ Uploading code to Lambda '$FN_NAME'…"
aws lambda update-function-code \
  --region "$AWS_REGION" \
  --function-name "$FN_NAME" \
  --zip-file "fileb://$LAMBDA_DIR/function.zip" \
  --no-cli-pager > /dev/null

aws lambda wait function-updated \
  --region "$AWS_REGION" \
  --function-name "$FN_NAME"

echo "✓ Lambda code updated."
