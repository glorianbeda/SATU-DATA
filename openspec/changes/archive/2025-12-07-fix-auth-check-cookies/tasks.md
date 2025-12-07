1. **Frontend: Update RouteGuard.jsx**
   - [x] Modify `ProtectedRoute`, `PublicRoute`, and `RoleRoute` in `frontend/src/components/RouteGuard.jsx`.
   - [x] Remove `const token = localStorage.getItem('token');` checks.
   - [x] Ensure the API call to `/api/profile` includes `withCredentials: true` (or `credentials: 'include'` if using fetch, but axios is used here).
   - [x] Handle the loading state correctly while waiting for the API response.

2. **Frontend: Verify Axios Configuration**
   - [x] Ensure the axios instance or call uses `withCredentials: true` to send the cookie.

3. **Validation**
   - [x] Verify that after login, the user is redirected to the dashboard.
   - [x] Verify that refreshing the dashboard keeps the user logged in.
   - [x] Verify that accessing `/login` while logged in redirects to dashboard.
