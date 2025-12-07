# Secure Auth and Unified Login

## Summary
This change implements industry-standard security practices by moving JWT storage to HTTP-Only cookies and enhances the user experience by unifying the Login and Register pages into a single, animated interface.

## Motivation
- **Security**: Storing JWTs in `localStorage` exposes them to XSS attacks. HTTP-Only cookies prevent JavaScript access to the token.
- **UX**: A unified login/register page with smooth transitions (using Framer Motion) provides a more modern and seamless user experience compared to separate page loads.

## Impact
- **Backend**: `POST /api/login` will now set a cookie. A new `POST /api/logout` endpoint is required. Auth middleware must check cookies.
- **Frontend**: Auth logic will no longer manage tokens manually. The Login and Register pages will be consolidated.
