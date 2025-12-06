# Auth/User Spec Delta

## MODIFIED Requirements

### Requirement: User List Filtering
The system SHALL allow filtering the user list to exclude the requesting user.

#### Scenario: Fetching users excluding self
- **Given** a logged-in user with ID U1
- **When** the user requests `GET /api/users?exclude_self=true`
- **Then** the response list does NOT contain user U1
- **And** the response list contains other users matching the criteria
