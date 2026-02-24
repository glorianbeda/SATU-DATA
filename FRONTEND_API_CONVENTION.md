# Frontend API Convention

## WAJIB: Gunakan Centralized API Client

Semua frontend code HARUS menggunakan `api` dari `frontend/src/utils/api.js` - BUKAN import axios langsung.

### Pattern yang BENAR:

```javascript
// ✅ BENAR - Gunakan ini
import api from '~/utils/api';
api.get('/api/endpoint');
api.post('/api/endpoint', data);
```

### Pattern yang SALAH:

```javascript
// ❌ SALAH - JANGAN gunakan ini
import axios from 'axios';
axios.get('/api/endpoint');
```

### Mengapa?

`api` dari `~/utils/api.js` sudah memiliki:
- `baseURL`: otomatis dari environment variable (VITE_API_URL)
- `withCredentials: true`: cookies termasuk dalam request (untuk auth)
- `timeout`: 30000: 30 detik
- Global error handler untuk 401 Unauthorized

### Feature API Constants

Setiap feature punya file endpoint constants di:
- `frontend/src/features/auth/constants/api.js`
- `frontend/src/features/dashboard/constants/api.js`
- `frontend/src/features/inventory/constants/api.js`
- `frontend/src/features/reimbursement/constants/api.js`
- `frontend/src/features/satu-link/constants/api.js`

Gunakan ini untuk konsistensi endpoint names, tapi import `api` dari `~/utils/api.js` untuk request.

## Files yang sudah diperbaiki (25 Feb 2026)

- frontend/src/features/auth/components/RegisterForm.jsx
- frontend/src/components/RouteGuard.jsx
- frontend/src/features/dashboard/components/ActivityHeatmap.jsx
- frontend/src/features/dashboard/components/DashboardLayout.jsx
- frontend/src/pages/verify-email.jsx
- frontend/src/pages/tools/productivity/notebook/index.jsx
- frontend/src/pages/tools/productivity/todo/index.jsx
- frontend/src/pages/quick-edit.jsx
- frontend/src/pages/finance/balance/index.jsx
- frontend/src/pages/finance/expense/index.jsx
- frontend/src/pages/finance/income/index.jsx
- frontend/src/pages/forms/create.jsx
- frontend/src/pages/forms/[id]/responses.jsx
- frontend/src/pages/forms/[id]/edit.jsx
- frontend/src/pages/f/[slug]/index.jsx
- frontend/src/pages/admin/documents/index.jsx
- frontend/src/pages/admin/users/index.jsx
- frontend/src/pages/archives/index.jsx
- frontend/src/pages/archives/shared/[token].jsx
- frontend/src/features/dynamic-forms/components/ImportFormDialog.jsx
- frontend/src/features/dynamic-forms/components/FormsList.jsx
- frontend/src/features/profile/components/ProfileEditForm.jsx
- frontend/src/features/omk-docs/components/ValidateDocument.jsx
- frontend/src/features/omk-docs/components/wizard/SignerListPanel.jsx
