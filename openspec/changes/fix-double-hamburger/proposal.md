# Fix Double Hamburger Menu

## Summary
Remove the duplicate hamburger menu icon that appears when the sidebar is present.

## Background
The user reported seeing two hamburger menu icons: one likely from the `Sidebar` (or `AppLayout`) and one from the `Header`. This redundancy is confusing and clutters the UI.

## Goals
1. Identify the source of the second hamburger icon.
2. Remove the redundant icon, keeping only the one in the `Header` that controls the sidebar.

## Plan
1. Inspect `Sidebar.jsx` and `Header.jsx` to see where the hamburger icons are rendered.
2. Remove the extra icon.
