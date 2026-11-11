# PROJECT ARCHITECTURE & THREAT SURFACE MAP

**Target System:** GoComfortUSA Web Application & Services  
**Domain:** `gocomfortusa.com`  
**Classification:** Travel Optimization, Itinerary Aggregation & Lead Management Platform  
**Architecture Model:** Hybrid Server-Side Rendered (SSR) & Client-Side Rendered (CSR) Next.js Architecture with Edge/Node.js API Routes  

---

## 1. Technical Stack & Component Ecosystem

| Component Layer | Technology / Implementation | Security Characteristics |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14.1.0 (App Router), React 18, Tailwind CSS, Lucide Icons | CSR/SSR components, React hydration, Tailwind styling |
| **Backend & Routing** | Next.js Node.js Route Handlers (`app/api/**/route.ts`) | Serverless / Node.js runtime, strict JSON parsing |
| **Authentication Engine** | NextAuth.js v4.24.11 (Credentials Provider, JWT strategy) | Bcrypt password hashing (cost 12), HTTP-only JWT cookies |
| **Database & ORM** | CockroachDB (PostgreSQL wire-compatible), Prisma ORM v5.22.0 | Fully parameterized queries via Prisma Engine, connection pool |
| **Storage Infrastructure** | Backblaze B2 Object Storage (S3-compatible API + Native B2 API) | Pre-signed upload tokens, strict MIME & extension verification |
| **External Integrations** | CyberBiz Payment Gateway, Google Sheets API v4, Booking.com VPS Scraper | HMAC-SHA256 signature verification, Google Service Account JWT |
| **State Management** | React Context, Zustand, Server-Side Revalidation (`revalidatePath`) | Ephemeral client memory, Next.js cache tags |

---

## 2. Comprehensive Attack Surface Mapping

```mermaid
flowchart TD
    Client[Untrusted Client Browser / External Webhook] --> WAF[Reverse Proxy / WAF / Cloudflare]
    WAF --> NextServer[Next.js App Server (Node.js)]
    
    subgraph "Trust Boundary: Authentication & Authorization"
        NextServer --> MW[NextAuth Session & JWT Validation]
        MW --> AdminAuth[verifyAdminAuth: Role & Identity Enforcement]
    end

    subgraph "Internal Services & Core Logic"
        AdminAuth --> AdminAPIs[Protected Admin APIs: /api/admin/*, /api/seo, /api/site-settings]
        NextServer --> PublicAPIs[Public Ingestion APIs: /api/flights/inquiry, /api/hotels/inquiry, /api/ikea/inquiry]
        NextServer --> WebhookAPI[Payment Webhooks: /api/payment/cyberbiz/webhook]
    end

    subgraph "Data Storage & Downstream Integrations"
        AdminAPIs --> Prisma[Prisma ORM Client]
        PublicAPIs --> Prisma
        Prisma --> CockroachDB[(CockroachDB Cluster)]
        AdminAPIs --> B2[Backblaze B2 Storage]
        PublicAPIs --> GSheets[Google Sheets API]
        WebhookAPI --> CyberBiz[CyberBiz Payment Gateway]
    end
```

---

## 3. Detailed Threat Surface Breakdown

### 3.1 Public Ingestion Endpoints (External Attack Surface)
- `/api/flights/inquiry` (POST): Accepts flight inquiry forms from public visitors.
- `/api/hotels/inquiry` (POST): Accepts hotel quote requests.
- `/api/ikea/inquiry` (POST): Accepts IKEA delivery & assembly requests.
- `/api/payment/cyberbiz/webhook` (POST): Receives asynchronous payment status events from CyberBiz.
- `/api/visitors` (POST): Tracks anonymized visitor counts per calendar date.
- `/api/form-submission` (POST): Relays generic form inputs into Google Sheets.

**Threats Analyzed:**
- Request body flooding & Denial of Service (DoS).
- SQL/NoSQL Injection via payload fields.
- Formula/CSV injection into Google Sheets exports (CWE-1236).
- Forged payment notifications & fraud bypass (CWE-353).

### 3.2 Authenticated Administrative Surface (Internal / Privileged)
- `/api/admin/blogs` & `/api/admin/blogs/[id]` (GET, POST, PUT, DELETE)
- `/api/admin/flights/inquiries` (GET, PATCH, DELETE, POST)
- `/api/admin/hotels/inquiries` (GET, PATCH)
- `/api/admin/ikea/inquiries` (GET, PATCH)
- `/api/admin/users` & `/api/admin/users/[id]` (GET, POST, DELETE)
- `/api/admin/upload` (POST): Secure media uploader to Backblaze B2.
- `/api/admin/site-settings` & `/api/site-settings` (GET, PUT)
- `/api/admin/seo-settings` & `/api/seo` (GET, PUT)
- `/api/admin/marquee` & `/api/navbar-links` (GET, POST, PUT, DELETE)
- `/api/admin/google-sheets` (POST)

**Threats Analyzed:**
- Broken Object-Level Authorization (BOLA / IDOR).
- Authentication bypass via header spoofing (CWE-287 / CWE-290).
- Unrestricted arbitrary file upload / Web shell execution (CWE-434).
- Privilege escalation from standard admin to superadmin.

### 3.3 Storage & Cloud Boundaries
- **Backblaze B2 Storage:** Stores public blog images, banners, and marketing assets.
  - Threat: Arbitrary script execution (e.g. `.php.png`, `.svg` XSS vectors, polyglot files) or unauthorized bucket deletion.
- **Google Cloud Platform (Service Account):** Writes submissions to Google Spreadsheets.
  - Threat: Private key exfiltration from repository code or environment variables.

---

## 4. Trust Boundaries & Security Enclaves

1. **Internet $\rightarrow$ Next.js Server:** Untrusted zone. Strict input sanitation, schema validation, rate-limiting considerations, and CORS headers apply.
2. **Next.js Server $\rightarrow$ NextAuth Guard:** Cryptographic boundary. Validates HMAC-signed session cookies and encrypted JWTs against `process.env.NEXTAUTH_SECRET`.
3. **Admin Guard $\rightarrow$ Data Persistence (Prisma/CockroachDB):** Privileged boundary. All queries use parameterized SQL generation through Prisma Client. No raw user string interpolation permitted.
4. **Server $\rightarrow$ Third-Party Cloud APIs:** Protected outbound zone. Service account keys and B2 keys are isolated strictly within runtime server memory and never dispatched to the browser.

