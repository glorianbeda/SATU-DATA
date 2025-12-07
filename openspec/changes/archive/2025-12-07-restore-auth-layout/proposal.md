# Restore Auth Layout

## Summary
Restore the original split-screen login layout (image on left, form on right) while maintaining the unified login/register switching and animation.

## Motivation
The previous change replaced the custom split-screen design with a generic centered card, which was a regression in UI/UX. The user explicitly requested to keep the original style where the register form simply replaces the login form within the existing layout.

## Impact
- **Frontend**: `Auth.jsx` will be updated to replicate the structure of `LoginLayout.jsx`. `LoginLayout.jsx` might become redundant or can be refactored to accept children.
