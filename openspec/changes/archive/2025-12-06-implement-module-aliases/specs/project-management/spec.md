# Project Management Specification

## ADDED Requirements

### Requirement: Module Aliases
The system SHALL support module aliases to simplify import paths.

#### Scenario: Backend Alias
- **GIVEN** the backend codebase
- **WHEN** a file imports a module using `@/`
- **THEN** it MUST resolve to the backend root directory

#### Scenario: Frontend Alias
- **GIVEN** the frontend codebase
- **WHEN** a file imports a module using `~/`
- **THEN** it MUST resolve to the `src` directory
