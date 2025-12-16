# Enhance Finance and Fixes Tasks

## Finance Import
- [x] Install `xlsx` or `read-excel-file` library
- [x] Create `ImportTransactionModal` component
- [x] Implement file upload and parsing logic
- [x] Implement column validation (Date, Amount, Category, Description)
- [x] Show validation errors to user if columns mismatch
- [x] Implement bulk insert API endpoint `POST /api/finance/bulk`
- [x] Integrate import button in Income and Expense pages

## Sidebar Fix
- [x] Update `Sidebar.jsx` to use `min-h-screen` instead of `h-screen`
- [x] Ensure z-index and positioning work correctly on mobile

## Profile Fix
- [x] Update `ProfileEditForm.jsx` to use `credentials: 'include'` for API calls
- [x] Remove dependency on `localStorage.token` if using cookies
- [x] Ensure profile data populates correctly
