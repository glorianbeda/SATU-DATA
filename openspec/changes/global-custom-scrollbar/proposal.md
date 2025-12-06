# Global Custom Scrollbar

## Summary
Implement a custom, aesthetically pleasing global scrollbar that works consistently across the application and adapts to dark/light modes.

## Background
The default browser scrollbar can look inconsistent and jarring against a custom-designed UI. A custom scrollbar enhances the "premium" feel of the application.

## Goals
1. Replace default scrollbar with a custom styled one.
2. Ensure it works in WebKit browsers (Chrome, Edge, Safari).
3. Support dark mode.

## Plan
1. Add CSS rules to `frontend/src/index.css` targeting `::-webkit-scrollbar` and related pseudo-elements.
