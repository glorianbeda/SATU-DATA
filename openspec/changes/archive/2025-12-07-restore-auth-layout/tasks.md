1. **Frontend: Update Auth Page Layout**
   - [x] Modify `frontend/src/pages/Auth.jsx` to use the split-screen layout from `frontend/src/features/auth/components/LoginLayout.jsx`.
   - [x] Left side: Background image and branding (hidden on mobile).
   - [x] Right side: Container for the form.

2. **Frontend: Implement Form Switching in Layout**
   - [x] Place the `AnimatePresence` block inside the right-side container of the new layout.
   - [x] Ensure `LoginForm` and `RegisterForm` render correctly within this container (check width/padding).

3. **Frontend: Clean Up**
   - [x] Verify `LoginLayout.jsx` is no longer needed or refactor it to be the wrapper component used by `Auth.jsx`. (Decided: Copy styles to `Auth.jsx` for simplicity and direct control, or use `LoginLayout` as a wrapper if it accepts children. Let's inline it into `Auth.jsx` to handle the animation state easily).

4. **Validation**
   - [x] Verify the page looks like the original login page.
   - [x] Verify clicking "Register" swaps the form with animation.
   - [x] Verify mobile view works (image hidden).
