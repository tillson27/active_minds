# ACTive Minds Therapy & Consulting — Website

Modern, minimalist refresh of [activemindstherapy.com](https://www.activemindstherapy.com/) — a single-page React site for a Sudbury / Manitoulin / Ontario therapy collective.

The whole site is content-driven, mobile-first, and ships as static files on **S3 + CloudFront**, with a tiny **AWS Lambda + SES** function powering the contact form (and a styled auto-reply for every inquiry).

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
│       ├── Footer.jsx
│       └── Reveal.jsx        # Lightweight fade-in on scroll
├── lambda/
│   ├── contact.mjs           # Lambda handler (validates → SES sendEmail x2)
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
- An SES identity (sandbox or production) verified for the `FROM_EMAIL` address and, until you exit SES sandbox, for the `PRACTICE_EMAIL` recipient as well

### 2. Deploy infrastructure

```bash
export ACM_CERTIFICATE_ARN="arn:aws:acm:us-east-1:111122223333:certificate/abc-…"
export PRACTICE_EMAIL="info@activemindstherapy.com"
export FROM_EMAIL="no-reply@activemindstherapy.com"

npm run deploy:infra
```

This stands up the S3 bucket, CloudFront distribution (with SPA-style 403/404 → /index.html fallbacks), Lambda function, Function URL, and the IAM role the function uses to call SES.

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
- **About copy / pillars** — `src/components/About.jsx`
- **Phone / address / inboxes** — `src/components/Contact.jsx`, `src/components/Footer.jsx`, and the Lambda stack params

For visual identity tweaks, all the design tokens live as CSS custom properties at the top of `src/index.css`.

## Architectural notes

- **No CDN-side compute.** Static delivery only. The contact form posts directly to the Lambda Function URL — keeps complexity (and bill) flat.
- **SES sends two emails** per submission: a richly formatted inquiry to the practice, and a warm auto-reply to the sender confirming receipt.
- **Honeypot + length validation** in the Lambda discourage automated spam.
- **OAC, not OAI.** Bucket is fully private; CloudFront pulls via Origin Access Control with a sigv4 signature.
- **CSP-friendly inline styles.** No third-party JS or trackers; just Google Fonts.
