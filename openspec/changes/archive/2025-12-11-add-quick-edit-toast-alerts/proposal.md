# Add Toast Alerts to Quick Edit Page

## Summary
Integrate MUI Toast alerts (via existing global `AlertContext`) into the Quick Edit page for consistent user feedback, replacing native `alert()` and adding validation/confirmation toasts.

## Context
Currently, the Quick Edit page (`frontend/src/pages/quick-edit.jsx`) uses the native browser `alert()` for error messages. The project already has a global toast system implemented in `frontend/src/context/AlertContext.jsx` using MUI's Snackbar component.

## Goals
1. **Replace native alert with toast** — Use global `useAlert()` hook instead of `alert('Error saving changes')`
2. **Empty row validation** — Show warning toast when saving with incomplete/empty rows
3. **Save confirmation** — Show success toast when changes are saved successfully

## References
- [AlertContext.jsx](file:///home/glo/DokumenAne/SatuData/frontend/src/context/AlertContext.jsx) — Existing global toast system
- [quick-edit.jsx](file:///home/glo/DokumenAne/SatuData/frontend/src/pages/quick-edit.jsx) — Target file for changes
