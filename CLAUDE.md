# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn install        # Install dependencies
yarn dev            # Start dev server with Turbopack (http://localhost:3000)
yarn dev:no-turbopack  # Start dev server without Turbopack
yarn build          # Production build
yarn start          # Start production server
yarn lint           # Run ESLint
```

No test framework is configured.

## Architecture

This is a Next.js 15 website for Sanitätshaus Mielke (a German medical supply company) using the App Router with TypeScript, Tailwind CSS v4, and shadcn/ui components.

### Route Groups

- `src/app/(site)/` — Public-facing pages with shared Header/Footer layout
- `src/app/admin/` — Protected admin dashboard (location editing), guarded by `src/middleware.ts`
- `src/app/admin-login/` — Login page; auth uses HMAC-SHA256 session cookies
- `src/app/api/` — API routes: `kontakt/` (contact form email) and `admin-login/` (auth)

### Content System

All site content lives in `src/content/` as JSON files:
- `locations/*.json` — One file per branch location; the filename (without `.json`) is the URL slug
- `services/*.json` — One file per service category
- `about-us/content.json` — About page content

Content is read at runtime via `src/lib/content.ts`. The admin dashboard allows editing location JSON files through Server Actions in `src/lib/admin-actions.ts`.

### Key Libraries

| Path | Purpose |
|------|---------|
| `src/lib/content.ts` | Loads and parses JSON content files |
| `src/lib/mail.ts` | Sends transactional email via Resend API |
| `src/lib/validators.ts` | Zod schema for contact form validation |
| `src/lib/schema.tsx` | JSON-LD structured data (Organization, LocalBusiness) |
| `src/lib/admin-actions.ts` | Server Actions for admin content editing |
| `src/lib/env.ts` | Environment variable validation |
| `src/middleware.ts` | Edge middleware: protects `/admin` routes |

### Contact Form Flow

1. Client validates with Zod (`lib/validators.ts`)
2. POST to `/api/kontakt`
3. Spam checks: honeypot field + minimum time-on-page check
4. Email sent via Resend — notification to location-specific address + receipt to user
5. Supports file attachments (e.g., prescriptions)

### Path Alias

`@/*` maps to `src/*` (configured in `tsconfig.json`).

## Environment Variables

Required in `.env`:
- `RESEND_API_KEY` — Resend API key for sending email
- `MAIL_FROM` — Sender address for outgoing emails
- `MAIL_FALLBACK_TO` — Fallback recipient if location has no email
- `KEYSTATIC_SECRET` — HMAC secret for admin session tokens
- `KEYSTATIC_ADMIN_PASSWORD` — Password for `/admin-login`
