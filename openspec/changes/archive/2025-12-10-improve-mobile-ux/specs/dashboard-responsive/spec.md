# Dashboard Responsive Spec Delta

## ADDED Requirements

### Requirement: Mobile Typography
The Dashboard title and date text MUST be scaled down on mobile devices to prevent layout crowding.

#### Scenario: Viewing dashboard on mobile
- GIVEN a user is on a mobile device
- WHEN they view the Dashboard
- THEN the "Dashboard" title font size is smaller (e.g., `text-xl`) compared to desktop (`text-2xl`)
