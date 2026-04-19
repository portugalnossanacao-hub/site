# Hardtek — PRD

## Original problem statement
https://github.com/afonsoferreiracoutinho2024-sys/site3 → deploy on Emergent and fix errors (form submission error; emails must be delivered to `contact@hardtek.ch`).

## Architecture
- Frontend: React 19 + CRA/Craco + Tailwind + Radix UI (FR/EN site for Hardtek)
- Backend: FastAPI + Motor (MongoDB) + PyJWT + bcrypt + Resend SDK
- Storage: MongoDB (`contact_messages`, `admin_users`)
- Auth: JWT httpOnly cookies (access + refresh)
- Email: Resend API (API key `re_icTm…`) — fire-and-forget from contact form

## What's implemented (2026-04-19)
- Cloned repo from GitHub into `/app`
- Installed frontend deps (yarn) and confirmed backend deps
- Fixed `await resend.Emails.send(...)` bug → replaced with `asyncio.to_thread(resend.Emails.send, …)` (resend SDK is sync)
- Added missing env vars: `JWT_SECRET`, `RESEND_API_KEY`, `SENDER_EMAIL`, `NOTIFICATION_EMAIL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- Contact form `POST /api/contact` now returns 200 and persists to Mongo even if the Resend delivery is refused
- Admin auth routes (`/api/auth/login|me|logout|refresh`) + CRUD (`GET/DELETE /api/contact`) validated
- Admin seed on startup: `admin@hardtek.ch` / `Hardtek2026!`
- Backend testing: 15/15 tests passing (see `/app/test_reports/iteration_1.json`)

## Known limitation (user action required)
- Resend account is in **test mode** → it only delivers to the account owner email (`afonsoferreiracoutinho2024@gmail.com`). Until the `hardtek.ch` domain is verified at https://resend.com/domains, emails to `contact@hardtek.ch` will be refused by Resend. Messages are still **saved in Mongo** and visible in the admin dashboard.

## Backlog
- [P0] User verifies `hardtek.ch` at resend.com/domains so notifications reach `contact@hardtek.ch`
- [P1] Use Emergent "Deploy" button to publish (user confirmed Emergent deploy)
- [P2] Add rate-limit / captcha on `/api/contact`
- [P2] Add email template preview & unsubscribe link
- [P2] Send an auto-reply confirmation email to the visitor

## Next action items
1. User verifies `hardtek.ch` domain in Resend dashboard
2. User clicks the Emergent **Deploy** button
3. Optional: add spam protection on the contact form
