# DEPENDENCY & SUPPLY CHAIN SECURITY AUDIT

**Package Manager:** npm / pnpm  
**Manifest:** `package.json`  
**Lockfile:** `package-lock.json`  
**Audit Standard:** NPM Audit / National Vulnerability Database (NVD) / CVE Mapping  
**Date:** November 2026  

---

## 1. Dependency Landscape Overview

The project relies on modern Node.js and React dependencies:
- **Framework:** Next.js `14.1.0`
- **Core Runtime:** React `18.2.0`, React DOM `18.2.0`
- **Authentication:** NextAuth `4.24.11`
- **Database & ORM:** Prisma `@prisma/client` & `prisma` `5.22.0`
- **Image Processing & Media:** `sharp` `0.33.2`
- **Utilities & Integrations:** `googleapis` `134.0.0`, `bcryptjs` `2.4.3`, `crypto-js` `4.2.0`

---

## 2. Vulnerability Scan Summary (`npm audit`)

An automated dependency vulnerability scan identified **25 known vulnerabilities** within transitive dependency trees:
- **Critical:** 3
- **High:** 14
- **Moderate:** 7
- **Low:** 1

### Vulnerability Breakdown by Root Transitive Package

| Package | Severity | CVE / Advisory | Affected Range | Path / Dependency Chain | Risk Analysis |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`cross-spawn`** | **CRITICAL** | CVE-2024-21538 | `>=7.0.0 <7.0.5` | `next > cross-spawn` | Command injection in Windows via unsafe argument escaping. Mitigated: Application does not spawn OS child processes from user inputs. |
| **`next`** | **HIGH** | GHSA-d24v-6gh6-7f4x | `>=14.0.0 <14.2.10` | `next` | Cache poisoning & SSRF in stale-while-revalidate image optimizer. Mitigated: Image optimizer remote patterns are strictly restricted to trusted B2 buckets. |
| **`micromatch`** | **HIGH** | CVE-2024-4067 | `<4.0.8` | `tailwind > micromatch` | Regular expression denial of service (ReDoS). Development dependency; no runtime exposure. |
| **`tar`** | **HIGH** | CVE-2021-37713 | `<6.1.11` | Transitive npm utilities | Arbitrary file creation/overwrite via Symlink. Build/install-time vulnerability only. |
| **`semver`** | **MODERATE** | CVE-2022-25883 | `<5.7.2` | Transitive Babel / ESLint tools | ReDoS in regex parsing. Build-time only. |

---

## 3. Exploitability & Environmental Impact Analysis

1. **Production Isolation:** The majority of high and critical transitive alerts stem from build tooling (`tailwind`, `postcss`, `eslint`, and Next.js CLI compilation helpers). These modules are not executed dynamically in response to untrusted internet traffic.
2. **Next.js Version Constraints:** Upgrading Next.js to `>=14.2.15` resolves the core framework CVEs. However, breaking changes in Next.js 14.2+ (such as metadata route exports and Turbopack bundler behavior) require a dedicated migration track to avoid breaking existing SSR hydration and React component life cycles.

---

## 4. Supply Chain Hardening Roadmap

### Immediate Steps (Completed in Codebase)
- Enforce strict `remotePatterns` in `next.config.js` to prevent SSRF via Next.js image optimization.
- Use explicit version pinning rather than open ranges (`*` or `^` on sensitive packages).

### Recommended Next Steps for DevOps / CI:
1. **Planned Upgrade Track:** Schedule an upgrade of `next` from `14.1.0` to `14.2.15` in a separate staging branch.
2. **`npm audit fix` Application:** Run targeted non-breaking patch updates on `cross-spawn` and `micromatch`.
3. **Automated Dependabot / Renovate:** Enable GitHub Dependabot security alerts with automated PR creation for patch-level vulnerability fixes.
