# Change: Refactor Admin to User

## Why
The current system uses an `Admin` table which is semantically incorrect as it contains various roles (Admin, Staff, Official). The user has mandated renaming this to `User` to better reflect the Role-Based Access Control (RBAC) nature of the system.

## What Changes
- **Database**: Rename `Admin` model to `User` in Prisma schema.
- **Codebase**: Update all references from `prisma.admin` to `prisma.user`.
- **API**: Update auth endpoints to reflect "User" terminology (internal refactor, API contract might remain similar but internal naming changes).

## Impact
- **Affected specs**: `auth` (New Capability)
- **Affected code**: `backend/prisma/schema.prisma`, Auth controllers, Middleware.
