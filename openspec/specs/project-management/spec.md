# project-management Specification

## Purpose
TBD - created by archiving change add-openspec-workflow. Update Purpose after archive.
## Requirements
### Requirement: Spec-Driven Development
The development process SHALL be driven by specifications to ensure clarity and alignment before implementation.

#### Scenario: Create Change Proposal
- **WHEN** a new feature or significant change is requested
- **THEN** a change proposal MUST be created in `openspec/changes/`
- **AND** it MUST include `proposal.md`, `tasks.md`, and relevant spec deltas

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

