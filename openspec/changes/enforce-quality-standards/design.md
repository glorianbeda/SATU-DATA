# Design: Quality Standards Enforcement

## i18n Guidelines

### Required Practices
1. **No hardcoded strings** – All user-visible text must use `t('key')` from `useTranslation()`.
2. **Sync both locales** – When adding a key to `id.json`, immediately add the English translation to `en.json`.
3. **Nested key organization** – Group keys by feature (e.g., `sidebar.*`, `finance.*`, `todo.*`).
4. **Placeholder support** – Use `{{variable}}` syntax for dynamic values.

### Audit Checklist
Before completing any implementation task:
- [ ] Run `npx i18next-scanner` or manually diff locale files to ensure key parity.
- [ ] Search modified files for raw Indonesian/English strings not wrapped in `t()`.
- [ ] Verify interpolation variables match between locales.

---

## Mobile Responsiveness Guidelines

### Target Breakpoints
| Breakpoint | Min Width | Description |
|------------|-----------|-------------|
| `xs`       | 0px       | Small phones |
| `sm`       | 600px     | Phones landscape / small tablets |
| `md`       | 900px     | Tablets |
| `lg`       | 1200px    | Desktops |

### Required Practices
1. **Viewport meta tag** – Already present in `index.html`.
2. **MUI responsive utilities** – Use `sx={{ display: { xs: 'none', md: 'block' } }}` patterns.
3. **No horizontal scroll** – Ensure content doesn't overflow on 360px width.
4. **Touch-friendly targets** – Buttons/links should be at least 44×44px.
5. **Readable font sizes** – Minimum 14px on mobile.

### Audit Checklist
Before completing any UI task:
- [ ] Dev Tools → Toggle device toolbar → iPhone SE (375px) or Galaxy Fold (280px).
- [ ] Scroll through modified screens—no horizontal overflow allowed.
- [ ] Tap targets are accessible without zooming.
- [ ] Dark mode renders correctly on mobile.

---

## Workflow Integration

When implementing any feature:
1. Code the feature.
2. Add/update translation keys in **both** locale files.
3. Test on mobile viewport in browser DevTools.
4. Mark i18n and responsive checklists as complete in `tasks.md`.
