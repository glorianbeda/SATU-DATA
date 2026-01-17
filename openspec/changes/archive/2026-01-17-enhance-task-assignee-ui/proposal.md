# Proposal: Enhance Task Assignee UI

## Goal

Improve the task assignee selection UI to support clearer assignment options and multi-person assignment.

## Context

Currently, the assignee dropdown shows a simple list. The user wants:
1. **Option buttons** to choose between "Untuk Saya" (assign to self) or "Untuk Orang Lain" (assign to others)
2. When "Untuk Orang Lain" is selected, show a **searchable dropdown**
3. Support **multi-select** for assigning to multiple people
4. Display **badges** for selected assignees with an X button to remove

## Plan

1. Replace simple Select with ToggleButtonGroup for assignment mode
2. Add Autocomplete component with multi-select and search capability
3. Display selected assignees as Chips with delete functionality
4. Update backend to support multiple assignees per task (if needed)
