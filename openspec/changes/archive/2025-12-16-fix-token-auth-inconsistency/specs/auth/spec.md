## MODIFIED Requirements

### Requirement: Cookie-Based Authentication

All API calls from the frontend MUST use cookie-based authentication via `withCredentials: true` instead of Authorization headers with localStorage tokens.

#### Scenario: Document Upload

- GIVEN a user is logged in via the login page
- WHEN they upload a document
- THEN the request MUST include cookies via `withCredentials: true`
- AND NOT use `localStorage.getItem('token')` which is never set

#### Scenario: Signature Request

- GIVEN a user is logged in
- WHEN they create or sign a signature request
- THEN all API calls MUST use `withCredentials: true`
- AND the server reads the token from cookies
