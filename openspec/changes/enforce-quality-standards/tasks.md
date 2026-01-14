# Tasks: Enforce Quality Standards

## Pre-Implementation Audit
- [ ] Review `design.md` for i18n and responsive guidelines.

## i18n Consistency Checklist
- [ ] All new user-facing text uses `t('key')` from `useTranslation()`.
- [ ] New keys added to `src/locales/id.json`.
- [ ] Corresponding English translations added to `src/locales/en.json`.
- [ ] Verify key structure matches existing conventions (nested by feature).
- [ ] Test language switching in the app (ID ↔ EN).

## Mobile Responsiveness Checklist
- [ ] Test modified UI on 375px viewport (iPhone SE).
- [ ] Test modified UI on 280px viewport (Galaxy Fold).
- [ ] No horizontal scrollbar appears.
- [ ] All tap targets are at least 44×44px.
- [ ] Text is readable without zooming (min 14px).
- [ ] Dark mode renders correctly on mobile.

## Post-Implementation
- [ ] Diff `id.json` vs `en.json` keys to confirm parity.
- [ ] Record any known gaps for future backlog.

---

> **Reminder**: Copy the relevant checklist items to each feature's `tasks.md` during implementation.
