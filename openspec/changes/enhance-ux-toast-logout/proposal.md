# Enhance UX: Global Toast & Logout Confirmation

## Summary
Implement a global toast notification system (leveraging existing AlertContext) and add a confirmation dialog before user logout to prevent accidental sessions termination.

## Background
Users need feedback when actions succeed or fail. Currently, some actions might not provide clear feedback. Additionally, clicking the logout button immediately terminates the session, which can be accidental.

## Goals
1. Ensure the Global Toast system is robust and easy to use.
2. Implement a "Confirm Logout" dialog.

## Non-Goals
- Rewriting the entire notification system if the existing one works well.

## Plan
1. Validate/Enhance `AlertContext` for global usage.
2. Modify `Sidebar.jsx` to include a confirmation dialog for logout.
