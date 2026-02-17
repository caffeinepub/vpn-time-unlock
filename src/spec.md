# Specification

## Summary
**Goal:** Fix production deep-link routing for `/admin` so the Admin Dashboard reliably loads and never shows a blank/placeholder screen, and ensure the Admin Panel UI renders required sections with clear error states.

**Planned changes:**
- Add a static-hosting-safe `/admin` entry that bootstraps the same React SPA so direct visits and refreshes on `/admin` load the app without requiring server rewrites.
- Ensure the Admin Panel route renders for authenticated admins and displays two sections: “AdMob Settings” (App ID + Rewarded Ad Unit ID with Save) and “Users & Sessions Overview” (table or empty state).
- Add in-page, readable error states (with retry/reload guidance) for admin status, AdMob config, and stats queries so the Admin Panel never appears as a blank/black screen.

**User-visible outcome:** Visiting or refreshing `https://vpn-time-unlock.caffeine.xyz/admin` loads the React app and shows the Admin Dashboard for admins, including AdMob settings and user/session stats, with clear error messaging if something fails.
