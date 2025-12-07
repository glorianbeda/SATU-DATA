# Enable Cascade Delete

## Summary
Configure the database schema to automatically delete child records when a parent record is deleted (Cascading Delete).

## Motivation
The user reported an error when trying to delete records (specifically Users) because of foreign key constraints with child records (Documents, SignatureRequests). The user explicitly requested that when core data is deleted, its children should also be removed ("child nya hilang juga").

## Impact
- **Backend**: `prisma/schema.prisma` will be updated to include `onDelete: Cascade` on relevant relationships.
- **Database**: A migration will be required to update the foreign key constraints in the database.
