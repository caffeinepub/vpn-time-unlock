# Specification

## Summary
**Goal:** Make the Admin Panel show and persist global AdMob configuration (AdMob App ID and Rewarded Ad Unit ID) for admins.

**Planned changes:**
- Update the Admin Panel (`#/admin`) to render an “AdMob Settings” section for admin principals with two labeled text inputs: “AdMob App ID” and “Rewarded Ad Unit ID” (replacing the current placeholder for this area).
- Add admin-only backend storage and APIs in the single Motoko actor to read and update the saved AdMob App ID and Rewarded Ad Unit ID values.
- Wire the Admin Panel to the backend via React Query: load saved values on page load, provide an explicit Save action, and show English success/error states with disabled Save + loading indicator while saving.

**User-visible outcome:** Admin users can view, edit, and save the AdMob App ID and Rewarded Ad Unit ID in `#/admin`, with values reloading correctly after refresh; non-admin users continue to see access denied and cannot access these settings.
