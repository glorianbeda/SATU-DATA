# Capability: Inventory Access Control

## ADDED Requirements

### Requirement: Koordinator Inventaris Role
The system MUST support a new role `KOORDINATOR_INVENTARIS` which sits between Member and Admin in the hierarchy.

#### Scenario: Coordinator Role Definition
- Given the system has roles
- When I check the available roles
- Then I should see `KOORDINATOR_INVENTARIS`
- And it should be distinct from `ADMIN` and `MEMBER`

### Requirement: Coordinator Permissions
The `KOORDINATOR_INVENTARIS` role SHALL have permission to manage assets and loan requests but SHALL NOT have access to user management or finance.

#### Scenario: Inventory Access
- Given I am logged in as a user with `KOORDINATOR_INVENTARIS` role
- When I attempt to access inventory management endpoints (GET/POST/PUT/DELETE `/api/inventory/assets`)
- Then the request should be allowed
- But when I attempt to access user management endpoints (`/api/users`)
- Then the request should be denied

### Requirement: Super Admin Access Fix
The `SUPER_ADMIN` role MUST have unrestricted access to all inventory modules, fixing a current regression where access is denied.

#### Scenario: Super Admin Inventory Access
- Given I am logged in as `SUPER_ADMIN`
- When I attempt to access any inventory endpoint
- Then the request should be allowed (fixing current bug)
