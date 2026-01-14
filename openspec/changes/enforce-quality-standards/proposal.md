# Enforce Quality Standards: i18n & Mobile Responsiveness

## Summary
Establish a **checklist-based quality gate** that ensures every new or modified feature:
1. **i18n Consistency** – All user-facing text uses `useTranslation()` with keys present in both `id.json` and `en.json`.
2. **Mobile Responsiveness** – UI components render correctly on small screens (≤480px) without horizontal overflow or unreadable text.

## Problem Statement
Currently, translations are sometimes added only to `id.json` (Indonesian being the primary locale), leaving `en.json` incomplete. Similarly, new UI features may not be tested on mobile viewports, causing layout breaks on small devices.

## Goals
1. Prevent hardcoded strings from being merged.
2. Keep locale files in sync—every key in `id.json` must have a corresponding key in `en.json`.
3. Require mobile viewport validation for all UI changes.

## Non-Goals
- Automated i18n key extraction (future enhancement).
- Full automated responsive testing (manual checklist for now).

## Acceptance Criteria
- [ ] `tasks.md` defines a clear checklist for every implementation.
- [ ] `design.md` documents guidelines and audit steps.
- [ ] Developers are reminded of these checks before marking tasks complete.

## Dependencies
- Existing i18n setup via `i18next` and `react-i18next`.
- Existing locale files: `src/locales/id.json`, `src/locales/en.json`.
