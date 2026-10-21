# ACTive Minds Therapy & Consulting — Website

Modern, minimalist refresh of [activemindstherapy.com](https://www.activemindstherapy.com/) — a single-page React site for a Sudbury / Manitoulin / Ontario therapy collective.

The whole site is content-driven, mobile-first, and ships as static files on **S3 + CloudFront**, with a tiny **AWS Lambda + Resend** function powering the contact forms, auto-replies, DynamoDB submission storage, and the protected `/admin` submissions view.

---

## Repo layout

```
.
├── index.html                # Vite entry
├── src/
│   ├── App.jsx               # Section composition
│   ├── App.css               # All component styles
│   ├── index.css             # Design tokens + base styles
│   └── components/
│       ├── Logo.jsx          # SVG mark (swap with real logo when delivered)
│       ├── Navbar.jsx
│       ├── Hero.jsx
│       ├── About.jsx
│       ├── Specializations.jsx
│       ├── Services.jsx
│       ├── Team.jsx
│       ├── Programs.jsx
│       ├── Contact.jsx       # Posts to VITE_CONTACT_API_URL
│       ├── Admin.jsx         # Password-protected submissions dashboard
│       ├── Footer.jsx
│       └── Reveal.jsx        # Lightweight fade-in on scroll
├── lambda/
│   ├── contact.mjs           # Lambda handler (validates → Resend + DynamoDB)
│   ├── emailTemplate.mjs     # Beautifully designed HTML email templates
│   └── package.json
├── infrastructure/
│   └── stack.yml             # CloudFormation: S3 + CloudFront + Lambda + Function URL
└── scripts/
    ├── deploy-infra.sh       # 1. cloudformation deploy
    ├── deploy-lambda.sh      # 2. update Lambda code
    └── deploy-site.sh        # 3. build + sync + invalidate CloudFront
```

## Local development

```bash
npm install
npm run dev          # http://localhost:5173
```

The contact form posts to `VITE_CONTACT_API_URL` (a Lambda Function URL). In dev, leave it unset and it will fall back to `/api/contact` — useful if you proxy it locally.

## Production deploy (first time)

### 1. Prerequisites

- An AWS account with the AWS CLI configured
- An **ACM certificate in us-east-1** that covers both `activemindstherapy.com` and `www.activemindstherapy.com`
- A verified Resend sending domain/address for `FROM_EMAIL`
- A strong password for `/admin`

### 2. Deploy infrastructure

```bash
export ACM_CERTIFICATE_ARN="arn:aws:acm:us-east-1:111122223333:certificate/abc-…"
export RESEND_API_KEY="re_..."
export ADMIN_PASSWORD="use-a-long-unique-password"
export PRACTICE_EMAIL="info@activemindstherapy.com"
export FROM_EMAIL="no-reply@activemindstherapy.com"

npm run deploy:infra
```

This stands up the S3 bucket, CloudFront distribution (with SPA-style 403/404 → /index.html fallbacks), DynamoDB submissions table, Lambda function, Function URL, and the IAM role the function uses to write/read submissions. The deploy script hashes `ADMIN_PASSWORD` locally and only sends the SHA-256 hash to CloudFormation.

### 3. Deploy the Lambda code

```bash
npm run deploy:lambda
```

### 4. Build + ship the site

```bash
npm run deploy:site
```

The script reads the `ContactApiUrl` output from CloudFormation, injects it into the Vite build as `VITE_CONTACT_API_URL`, syncs to S3 with long-cache headers on hashed assets and `no-cache` on `index.html`, then invalidates `/*` in CloudFront.

### 5. Point your DNS

In Route 53 (or your DNS host), create:

- `activemindstherapy.com` → ALIAS / CNAME → CloudFront `*.cloudfront.net`
- `www.activemindstherapy.com` → ALIAS / CNAME → CloudFront `*.cloudfront.net`

## Content updates

- **Team bios** — `src/components/Team.jsx`
- **Services & pricing** — `src/components/Services.jsx`
- **Programs** — `src/components/Programs.jsx`
- **Resources & self-care walkthrough** — `src/components/Resources.jsx`; prompts, email rendering, and validation live in `lambda/selfCarePlan.mjs`. The original fillable worksheet is `public/resources/my-self-care-plan.pdf`.
- **About copy / pillars** — `src/components/About.jsx`
- **Phone / address / inboxes** — `src/components/Contact.jsx`, `src/components/Footer.jsx`, and the Lambda stack params
- **Admin submissions** — visit `/admin` after deploying infrastructure, Lambda code, and the site

For visual identity tweaks, all the design tokens live as CSS custom properties at the top of `src/index.css`.

## Architectural notes

- **No CDN-side compute.** Static delivery only. The contact form posts directly to the Lambda Function URL — keeps complexity (and bill) flat.
- **Resend sends two emails** per submission: a richly formatted inquiry to the practice, and a warm auto-reply to the sender confirming receipt.
- **DynamoDB stores submissions** after the practice email succeeds. Storage failures are logged as non-fatal so a temporary database issue does not block form submissions.
- **Self-care plans** go only to the visitor's chosen email address with their consent, without copying the practice or saving answers to DynamoDB. Answers remain in tab memory until leaving the page; the review screen supports saving an HTML copy and printing to PDF. Run `npm test` for validation, rendering, and email handler checks.
- **`/admin` is server-protected.** The frontend never contains the password; it exchanges the password for a short-lived signed token through Lambda.
- **Honeypot + length validation** in the Lambda discourage automated spam.
- **OAC, not OAI.** Bucket is fully private; CloudFront pulls via Origin Access Control with a sigv4 signature.
- **CSP-friendly inline styles.** No third-party JS or trackers; just Google Fonts.
