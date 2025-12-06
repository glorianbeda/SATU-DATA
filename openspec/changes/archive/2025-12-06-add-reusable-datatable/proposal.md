# Add Reusable DataTable Component

## Why

Currently, tables across the application are implemented individually with inconsistent features. We need a reusable DataTable component with:
- Consistent styling using MUI
- Export functionality (CSV, PDF)
- Sorting, filtering, and pagination
- Custom action columns support

## What Changes

- Create a reusable `DataTable` component in `frontend/src/components/DataTable/`
- Support column configuration with custom renderers
- Add export to CSV and PDF functionality
- Include search/filter capability
- Add pagination support
- Refactor existing tables to use this component
