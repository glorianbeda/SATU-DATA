## 1. Database
- [x] 1.1 Rename `Admin` model to `User` in `schema.prisma`
- [x] 1.2 Create and run migration

## 2. Backend Refactor
- [x] 2.1 Update `auth.controller.js` to use `prisma.user`
- [x] 2.2 Update `auth.middleware.js` to use `prisma.user`
- [x] 2.3 Update any other services referencing `Admin`

## 3. Frontend Refactor
- [x] 3.1 Update types/interfaces if applicable
- [x] 3.2 Verify login flow works with new backend structure
