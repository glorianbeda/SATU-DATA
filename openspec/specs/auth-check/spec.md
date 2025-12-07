# auth-check Specification

## Purpose
TBD - created by archiving change fix-auth-check-cookies. Update Purpose after archive.
## Requirements
### Requirement: Session Verification
The system MUST verify user authentication status by validating the HTTP-Only cookie with the backend, instead of checking for a local token.

#### Scenario: Protected Route Access
Given a user attempts to access a protected route
Then the system MUST call the `/api/profile` endpoint with credentials included
And if the response is 200 OK, access is granted
And if the response is 401 Unauthorized, the user is redirected to login

#### Scenario: Public Route Access (Login Page)
Given a user attempts to access the login page
Then the system MUST call the `/api/profile` endpoint with credentials included
And if the response is 200 OK, the user is redirected to the dashboard
And if the response is 401 Unauthorized, the login page is shown

