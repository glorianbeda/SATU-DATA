1. **Backend: Update Login Endpoint**
   - [x] Modify `backend/routers/api/POST__login/index.js` to set the JWT in an HTTP-Only cookie named `token` instead of returning it in the JSON body.
   - [x] Ensure the cookie has `httpOnly: true`, `secure: process.env.NODE_ENV === 'production'`, and `sameSite: 'strict'` (or 'lax').

2. **Backend: Create Logout Endpoint**
   - [x] Create `backend/routers/api/POST__logout/index.js`.
   - [x] Implement logic to clear the `token` cookie.

3. **Backend: Update Auth Middleware**
   - [x] Modify `backend/middleware/auth.js` (or equivalent) to look for the token in `req.cookies.token` in addition to (or instead of) the Authorization header.
   - [x] Ensure `cookie-parser` is installed and used in `backend/index.js`.

4. **Frontend: Install Dependencies**
   - [x] Run `npm install framer-motion` in `frontend/`.

5. **Frontend: Create Unified Auth Page**
   - [x] Create `frontend/src/pages/Auth.jsx`.
   - [x] Implement state to toggle between "login" and "register" modes.
   - [x] Use `AnimatePresence` and `motion.div` to animate the transition between forms.

6. **Frontend: Refactor Auth Forms**
   - [x] Update `LoginForm.jsx` and `RegisterForm.jsx` (or create new components) to accept a prop to toggle the view (e.g., "Don't have an account? Register").
   - [x] Remove `localStorage.setItem('token', ...)` from `LoginForm`.
   - [x] Update API calls to include `credentials: 'include'`.

7. **Frontend: Update Routing**
   - [x] Update `frontend/src/App.jsx` (or router config) to point `/login` and `/register` to the new `Auth.jsx` (or just use `/auth`).

8. **Validation**
   - [x] Verify login sets the cookie.
   - [x] Verify protected routes work with the cookie.
   - [x] Verify logout clears the cookie.
   - [x] Verify UI transitions are smooth.
