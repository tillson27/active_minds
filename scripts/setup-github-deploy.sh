#!/usr/bin/env bash
#
# One-time bootstrap for automated deploys from GitHub Actions.
#
# What it does:
#   1. Deploys the github-oidc CFN stack (creates the OIDC provider + IAM role
#      that GitHub Actions assumes to deploy to AWS).
#   2. Reads back the role ARN.
#   3. Sets the required GitHub repo secrets so the deploy.yml workflow can run.
#
# Prereqs:
#   - `aws` configured for the target account (region us-east-1).
#   - `gh` authenticated for the target repo.
#   - The following env vars set in your shell:
#       ACM_CERTIFICATE_ARN
#       RESEND_API_KEY
#       ADMIN_PASSWORD          (or ADMIN_PASSWORD_HASH)
#       ADMIN_SESSION_SECRET    (optional)
#
# Re-runs are idempotent — safe to run again to rotate secrets or after
# changing the GitHub org / repo / branch.
#
set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-1}"
BOOTSTRAP_STACK="${BOOTSTRAP_STACK:-active-minds-github-deploy}"
GITHUB_ORG="${GITHUB_ORG:-tillson27}"
GITHUB_REPO="${GITHUB_REPO:-active_minds}"
GITHUB_BRANCH="${GITHUB_BRANCH:-main}"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

require() {
  if [[ -z "${!1:-}" ]]; then
    echo "ERROR: env var $1 is required." >&2
    exit 1
  fi
}

require ACM_CERTIFICATE_ARN
require RESEND_API_KEY

if [[ -z "${ADMIN_PASSWORD_HASH:-}" ]]; then
  require ADMIN_PASSWORD
  ADMIN_PASSWORD_HASH="$(printf "%s" "$ADMIN_PASSWORD" | shasum -a 256 | awk '{print $1}')"
fi

echo "→ Checking for existing GitHub OIDC provider…"
EXISTING_OIDC_ARN="$(
  aws iam list-open-id-connect-providers \
    --query "OpenIDConnectProviderList[?contains(Arn, 'token.actions.githubusercontent.com')].Arn | [0]" \
    --output text 2>/dev/null || true
)"

PARAM_OVERRIDES=(
  "GitHubOrg=$GITHUB_ORG"
  "GitHubRepo=$GITHUB_REPO"
  "GitHubBranch=$GITHUB_BRANCH"
)
if [[ -n "$EXISTING_OIDC_ARN" && "$EXISTING_OIDC_ARN" != "None" ]]; then
  echo "  found: $EXISTING_OIDC_ARN — reusing."
  PARAM_OVERRIDES+=(
    "CreateOidcProvider=false"
    "ExistingOidcProviderArn=$EXISTING_OIDC_ARN"
  )
else
  echo "  none found — will create one."
fi

echo "→ Deploying bootstrap stack '$BOOTSTRAP_STACK'…"
aws cloudformation deploy \
  --region "$AWS_REGION" \
  --stack-name "$BOOTSTRAP_STACK" \
  --template-file "$ROOT_DIR/infrastructure/github-oidc.yml" \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides "${PARAM_OVERRIDES[@]}"

ROLE_ARN="$(
  aws cloudformation describe-stacks \
    --region "$AWS_REGION" \
    --stack-name "$BOOTSTRAP_STACK" \
    --query "Stacks[0].Outputs[?OutputKey=='RoleArn'].OutputValue" \
    --output text
)"
echo "→ Role ARN: $ROLE_ARN"

echo "→ Setting GitHub repo secrets…"
gh secret set AWS_DEPLOY_ROLE_ARN --repo "$GITHUB_ORG/$GITHUB_REPO" --body "$ROLE_ARN"
gh secret set ACM_CERTIFICATE_ARN --repo "$GITHUB_ORG/$GITHUB_REPO" --body "$ACM_CERTIFICATE_ARN"
gh secret set RESEND_API_KEY      --repo "$GITHUB_ORG/$GITHUB_REPO" --body "$RESEND_API_KEY"
gh secret set ADMIN_PASSWORD_HASH --repo "$GITHUB_ORG/$GITHUB_REPO" --body "$ADMIN_PASSWORD_HASH"
if [[ -n "${ADMIN_SESSION_SECRET:-}" ]]; then
  gh secret set ADMIN_SESSION_SECRET --repo "$GITHUB_ORG/$GITHUB_REPO" --body "$ADMIN_SESSION_SECRET"
fi

echo
echo "✓ Done. Push to $GITHUB_BRANCH to trigger a deploy, or run:"
echo "    gh workflow run deploy.yml --repo $GITHUB_ORG/$GITHUB_REPO"
