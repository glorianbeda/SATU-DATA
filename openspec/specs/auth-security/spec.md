# auth-security Specification

## Purpose
TBD - created by archiving change secure-auth-and-unified-login. Update Purpose after archive.
## Requirements
### Requirement: Auth Token Storage
The system MUST store the authentication token (JWT) in an HTTP-Only cookie to prevent XSS attacks.

#### Scenario: Successful Login
Given a user provides valid credentials
When they submit the login form
Then the server responds with a 200 OK
And the response includes a `Set-Cookie` header for the `token`
And the cookie has `HttpOnly` flag set
And the cookie has `Secure` flag set (in production)
And the response body does NOT contain the token string

#### Scenario: Accessing Protected Resource
Given a user is logged in (has valid cookie)
When they request a protected API endpoint
Then the browser automatically sends the `token` cookie
And the server validates the token from the cookie
And the request succeeds

### Requirement: Logout
The system MUST provide a way to clear the authentication cookie.

#### Scenario: User Logout
Given a logged-in user
When they click "Logout"
Then the client sends a request to `/api/logout`
And the server responds with a `Set-Cookie` header clearing the `token` (max-age=0 or past expiry)
And the user is redirected to the login page

