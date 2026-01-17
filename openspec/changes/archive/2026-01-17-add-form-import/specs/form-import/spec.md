# Capability: Form Import

Refers to the ability to import form schemas from external sources (JSON) into the system.

## ADDED Requirements

### Requirement: Dev-Environment Import
The system SHALL allow users to import form schemas from JSON data when running in a development environment.

#### Scenario: Developer imports a form JSON in dev environment
- **Given** the application is running in `development` mode
- **When** a developer accesses the Forms Dashboard
- **Then** they see an "Import JSON" button
- **And** clicking it opens a dialog to paste JSON
- **When** they paste a valid form JSON and submit
- **Then** a new form is created in the database
- **And** the list refreshes to show the new form

### Requirement: Production Restriction
The system MUST restrict the form import functionality to development environments only.

#### Scenario: Import restricted in production
- **Given** the application is running in `production` mode
- **When** a user accesses the Forms Dashboard
- **Then** the "Import JSON" button is NOT visible
- **And** if they attempt to call `/api/forms/import` directly
- **Then** they receive a 403 Forbidden error

### Requirement: Validation
The system SHALL validate import data to ensure it conforms to the form schema structure.

#### Scenario: Invalid JSON handling
- **Given** the developer tries to import a form
- **When** they paste invalid JSON (syntax error)
- **Then** the system displays an error message "Invalid JSON format"

#### Scenario: Invalid Schema handling
- **Given** the developer tries to import a form
- **When** the JSON is valid but missing required fields (e.g., `title`)
- **Then** the system displays a validation error
