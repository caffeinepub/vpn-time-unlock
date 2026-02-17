# Specification

## Summary
**Goal:** Finalize VPN Super Pro by wiring Admin-saved AdMob and logo settings into the end-user app, completing key Admin Dashboard metrics and controls, adding Contact/Privacy pages, and producing a release APK artifact link.

**Planned changes:**
- Expose a non-admin-readable backend query for the current AdMob App ID and rewarded ad unit ID (returning null/empty when not configured) and update the frontend ad/unlock flow to use the saved config with a safe fallback to existing frontend defaults.
- Ensure the logo uploaded in the Admin Panel is used consistently in the app UI (e.g., header/app shell) for all users, with a fallback icon when no logo exists.
- Activate the Admin Dashboard to show live users (session-based) and a persistent total installs metric, and enable admin block/unblock controls for users; prevent blocked users from unlocking/using VPN sessions with a clear UI state/error.
- Add a Contact Us page linked from the app UI with an English-only mailto link to Muhammadramadan121555@gmail.com.
- Add a complete, professional Privacy Policy page linked from the app UI, including a Contact Us section that uses the configured support email from frontend/src/config/support.ts.
- Produce a release Android APK and provide a direct download link as the build artifact output.

**User-visible outcome:** Users see the correct app logo and can unlock VPN access through an ad flow that uses Admin-configured AdMob IDs when available, with reliable fallbacks; admins can monitor live users and total installs and block/unblock users; users can access Contact Us and Privacy Policy pages; and a downloadable release APK link is available for sharing.
