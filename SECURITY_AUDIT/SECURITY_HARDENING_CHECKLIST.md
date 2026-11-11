# ENTERPRISE SECURITY HARDENING CHECKLIST

**Target Environment:** GoComfortUSA Production Platform  
**Scope:** Application Code, Host Server, Network, Database, Cloud Storage & CI/CD  
**Standard:** CIS Benchmarks, OWASP ASVS Level 2, NIST SP 800-53  

---

## 1. Application-Level Hardening (Completed & Verified)

- [x] **Eliminate Client-Controlled Auth Headers:** Completely removed `x-admin-auth` bypass vector in `lib/admin-auth.ts`.
- [x] **Mandatory Handler-Level Authentication:** Verified that all `/api/admin/*`, `/api/site-settings`, `/api/seo`, and `/api/navbar-links` check user sessions before mutation.
- [x] **Cryptographic Webhook Validation:** Enforced timing-safe HMAC-SHA256 signature checking on CyberBiz payment callbacks.
- [x] **Scrub Hardcoded Secrets:** Purged all hardcoded administrative passwords, B2 application keys, scraper tokens, and payment secret keys from source files.
- [x] **File Upload Shielding:**
  - [x] File size capped at 3MB maximum.
  - [x] File magic numbers validated against image signatures (`image/jpeg`, `image/png`, `image/webp`, `image/avif`).
  - [x] Double extension attacks (`.php.png`, `.phtml.jpg`) stripped and blocked.
  - [x] Polyglot payloads detected and discarded.
  - [x] Images re-encoded server-side with `sharp` to strip malicious EXIF and hidden code.
- [x] **Formula Injection Protection:** Sanitized user input strings sent to Google Sheets to neutralize spreadsheet command execution.
- [x] **Cross-Site Scripting (XSS) Sanitization:** Escaped HTML entities in dynamic notifications and removed inline `onclick` execution.
- [x] **HTTP Security Headers Configured:**
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- [x] **Rate Limiting Applied (15 req/min per IP):** Enforced 15 requests/minute sliding-window rate limit on all public inquiry endpoints (`/api/flights/inquiry`, `/api/hotels/inquiry`, `/api/ikea/inquiry`, `/api/form-submission`) in both `middleware.ts` and individual route handlers.
- [x] **Managed Challenge & IP Restrictions on `/admin/*`:**
  - Automated vulnerability scanner detection and blocking (`sqlmap`, `nikto`, `acunetix`, `masscan`, etc.).
  - Cloudflare edge threat score verification (`cf-threat-score` > 25 blocked).
  - Configurable IP whitelisting via `ADMIN_ALLOWED_IPS` / `ALLOWED_ADMIN_IPS` environment variable.
  - Brute-force rate limiting on `/admin/login` (10 attempts per 5 minutes per IP).
- [x] **Production Debug Stripping:** Removed `<TestSession />` component and disabled console logs in production builds via `next.config.js`.

---

## 2. Database & Data Layer Hardening (Operational Recommendations)

- [ ] **Database Least Privilege:**
  - Create dedicated database user roles (e.g. `gcu_app_user`) restricted from `DROP TABLE`, `ALTER TABLE`, or administrative database commands.
  - Use a separate migration user for Prisma schema migrations (`prisma db push` / `prisma migrate deploy`).
- [ ] **Connection Encryption:**
  - Mandate `sslmode=verify-full` or `sslmode=require` in `DATABASE_URL` for CockroachDB to prevent man-in-the-middle interception.
- [ ] **Automated Backup & Point-in-Time Recovery:**
  - Verify automated encrypted snapshots are enabled on CockroachDB Cloud with 30-day retention.

---

## 3. Cloud & Third-Party Service Hardening

- [ ] **Backblaze B2 Application Key Rotation:**
  - Immediately generate a new Backblaze B2 application key scoped strictly to bucket `gocomfortusablog` with minimal required capabilities (`readFiles`, `writeFiles`, `deleteFiles`).
  - Revoke the previously exposed application key (`K005N4+1O0fi215nWyYjofh+WlTBtl4`).
- [ ] **CyberBiz Secret Key Configuration:**
  - Set `CYBERBIZ_SECRET_KEY` directly inside the production environment variable vault (Vercel / VPS `.env.production`).
- [ ] **Google Cloud Service Account Isolation:**
  - Ensure the Google Cloud Service Account has write permissions solely to the specific tracking spreadsheet rather than broad Google Drive privileges.

---

## 4. Server, Network & Infrastructure Hardening

- [ ] **Cloudflare / Reverse Proxy Configuration:**
  - Enforce Cloudflare Web Application Firewall (WAF) rules:
    - Geo-blocking / Managed Challenge on `/admin/*` and `/api/admin/*`.
    - Rate limit rule: 60 requests/minute per IP on `/api/flights/inquiry`, `/api/hotels/inquiry`, `/api/ikea/inquiry`.
    - IP whitelist for administrative dashboard access if staff operates from static IPs or VPN.
- [ ] **TLS / SSL Configuration:**
  - Enforce TLS 1.3 only; disable TLS 1.0 and 1.1.
- [ ] **CORS Policy:**
  - Keep Next.js API routes restricted to same-origin requests unless explicit cross-origin webhooks are designated.

