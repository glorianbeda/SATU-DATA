# Project Management Specification

## MODIFIED Requirements

### Requirement: Module Aliases
The system SHALL support module aliases to simplify import paths.
All internal imports SHALL use the defined aliases (`@` for backend, `~` for frontend) instead of relative paths for parent directories.

#### Scenario: Backend Import
- **GIVEN** a backend file needing a module from a parent directory
- **WHEN** the developer writes the import
- **THEN** they MUST use `@/path/to/module`

#### Scenario: Frontend Import
- **GIVEN** a frontend file needing a module from a parent directory
- **WHEN** the developer writes the import
- **THEN** they MUST use `~/path/to/module`
