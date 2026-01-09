# Proposal: Import Form Schema (Dev Only)

## Goal
Implement a feature to import form schemas from JSON files to facilitate testing and development of dynamic forms. This feature must be restricted to development environments.

## Context
Developers currently have to manually create forms via the UI to test the form builder and rendering logic. This is time-consuming and error-prone. A way to quickly seed or import form definitions is needed for efficient testing.

## Capabilities
- **Form Import**: Import a form schema (title, description, fields, settings) from a JSON file/paste.
- **Environment Restriction**: This feature is only available when `NODE_ENV=development` (or equivalent configuration).
- **Sample Data**: A sample JSON file will be provided for testing.

## Changes
- **Backend**: 
    - New endpoint `POST /api/forms/import` (guarded by env check).
- **Frontend**: 
    - New "Import JSON" button in the Forms Dashboard (visible only in dev).
    - File upload or text area for JSON input.
