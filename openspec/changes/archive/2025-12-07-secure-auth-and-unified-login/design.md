# Design: Secure Auth and Unified Login

## Security Architecture
The move to HTTP-Only cookies mitigates XSS risks.
- **Cookie Configuration**:
    - `httpOnly`: true (prevents JS access)
    - `secure`: true (in production, requires HTTPS)
    - `sameSite`: 'strict' (prevents CSRF)
    - `maxAge`: 1 day (matches token expiry)

## Frontend Architecture
- **State Management**: Local state in `Auth.jsx` controls the active view (`'login'` | `'register'`).
- **Animation**: Framer Motion's `AnimatePresence` handles the exit/enter animations.
    - Exit: Slide out to left/right.
    - Enter: Slide in from right/left.
- **API Client**: All fetch requests to the backend must now include `credentials: 'include'` to send the cookie.

## Trade-offs
- **CSRF**: Cookies introduce CSRF risks, but `SameSite=Strict` largely mitigates this for modern browsers. We should ensure non-GET requests are protected.
- **Mobile Apps**: If a mobile app is built later, it might need a different auth flow (or handle cookies), but for this web app, cookies are superior.
