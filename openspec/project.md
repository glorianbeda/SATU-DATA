# Project Context

## Purpose
**Satu Data+** is a comprehensive data management and dashboard application designed to centralize and visualize data. It aims to provide a single source of truth for various data streams, featuring a modern, responsive dashboard for analytics and management.

## Tech Stack
- **Frontend**: React, Vite, Material UI (MUI), vite-plugin-pages, Chart.js
- **Backend**: Node.js, Express, Prisma (ORM), Redis, JWT, Bcryptjs
- **Database**: MySQL (via Prisma)
- **Infrastructure**: Docker, Docker Compose
- **Package Manager**: Yarn (use `yarn` instead of `npm` for all commands)
- **Language**: JavaScript (ES6+)

## Project Conventions

### Code Style
- **Frontend**: Functional React components with Hooks.
- **Backend**: MVC-like structure (Controllers, Routes, Services/Models via Prisma).
- **Formatting**: Standard Prettier/ESLint rules (implied).

### Architecture Patterns
- **Frontend**: Feature-based architecture (`src/features/*`), file-based routing (`src/pages/*`).
- **Backend**: REST API with Express, Prisma for data access.
- **Generators**: Custom scripts (`yarn make:feature`, `yarn make:module`) for scaffolding.

### Testing Strategy
- [To be defined - currently manual testing implied]

### Git Workflow
- **Commit Format**: Semantic commits with Gitmoji (e.g., `:sparkles: feat(auth): ...`).
- **Case**: All commit messages must be in **lowercase**.
- **Grouping**: Commits grouped by feature/logical change.

## Domain Context
- **Satu Data**: Implies centralization of data.
- **Roles**: Super Admin, Admin, Member (RBAC).
- **Key Entities**: Users, Documents, Audit Logs, Tickets (Parking?), Dashboard Stats.

## Important Constraints
- **Deployment**: Runs in Docker containers.
- **Frontend**: Must look "Premium" and "Dynamic" (as per system instructions).
- **Database**: MySQL is the source of truth, managed via Prisma migrations.

## External Dependencies
- **Redis**: For caching/session management.
- **Prisma**: Database ORM.
