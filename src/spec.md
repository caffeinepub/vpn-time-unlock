# Specification

## Summary
**Goal:** Make the Admin Panel fully usable at `/admin` for authenticated admins, including AdMob settings, logo management, and real user/session overview with settings persisted across upgrades.

**Planned changes:**
- Enable route access to the Admin Panel at `/admin` (not hash routing), and update the in-app navigation toggle to switch between `/` and `/admin`.
- Ensure the Admin Panel “AdMob Settings” section always renders for admins, loads existing values from the backend, and saves trimmed “AdMob App ID” and “Rewarded Ad Unit ID” with English success/error toasts and stable form initialization.
- Add admin-only logo upload/replace in the Admin Panel, persist the logo in the backend, and display the saved logo in the app header when available (fallback to current default icon otherwise).
- Replace the current Admin Panel user placeholder with a real “Users & Sessions Overview” backed by a new admin-only backend API returning principal, optional profile name, and session status/expiry (if available), including English loading and empty states.
- Persist AdMob config and uploaded logo across backend upgrades, adding/adjusting migration logic as needed to preserve existing values.

**User-visible outcome:** Admins can visit `https://<app-domain>/admin` to manage AdMob IDs, upload/update the app logo, and view a real list of users and session status; non-admins visiting `/admin` see Access Denied, and saved settings/logo remain after redeploys/upgrades.
