# Design: Page Loading and Wallet UI

## 1. Page Loading Indicator

### Problem Analysis
Current behavior: Loading appears **after** data is fetched, which is too late.
Expected behavior: Loading should appear **immediately** on navigation.

### Root Cause
Data loading happens inside page components. The loading state is internal and not visible during route transition.

### Solution
1. **Route-level loading**: Use NProgress or React Suspense with lazy loading
2. **Immediate feedback**: Show loading on `useNavigate()` or `<Link>` click
3. **Data loading skeleton**: Show skeleton while fetching API data

### Implementation
```jsx
// Option A: NProgress with React Router
// Listen to navigation start/end events

// Option B: React.lazy + Suspense
const IncomePage = React.lazy(() => import('./pages/finance/income'));
<Suspense fallback={<PageLoader />}>
  <Routes>...</Routes>
</Suspense>
```

## 2. Wallet UI for Saldo

### Data Model
```prisma
model FinanceSettings {
  id             Int      @id @default(autoincrement())
  initialBalance Float    @default(0)
  balanceDate    DateTime @default(now())  // Reference date
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

model BalanceAuditLog {
  id          Int      @id @default(autoincrement())
  oldBalance  Float
  newBalance  Float
  oldDate     DateTime
  newDate     DateTime
  changedBy   Int      // User ID
  changedAt   DateTime @default(now())
}
```

### Balance Calculation Logic
```sql
-- Only sum transactions AFTER the balance date
SELECT
  fs.initialBalance +
  COALESCE(SUM(CASE WHEN f.type='income' AND f.date > fs.balanceDate THEN f.amount ELSE 0 END), 0) -
  COALESCE(SUM(CASE WHEN f.type='expense' AND f.date > fs.balanceDate THEN f.amount ELSE 0 END), 0)
  AS currentBalance
FROM FinanceSettings fs
LEFT JOIN Finance f ON f.date > fs.balanceDate
```

### UI Design
```
┌─────────────────────────────────────────────────────────┐
│  💳 DOMPET DIGITAL                        [Riwayat 📜]  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Saldo Asli                                       │  │
│  │  Rp 1.000.000                     [✏️ Ubah]       │  │
│  │  📅 Berlaku sejak: 01 Desember 2025               │  │
│  │                                                   │  │
│  │  ─────────────────────────────────────────        │  │
│  │  + Pemasukan (setelah tgl)  : Rp    500.000       │  │
│  │  - Pengeluaran (setelah tgl): Rp    200.000       │  │
│  │  ─────────────────────────────────────────        │  │
│  │  💰 Saldo Saat Ini: Rp 1.300.000                  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Backend API
- `GET /api/finance/initial-balance` - Get initial balance + date
- `PUT /api/finance/initial-balance` - Update balance + date (creates audit log)
- `GET /api/finance/balance-history` - Get audit log

### Frontend Components
- `WalletCard.jsx` - Premium wallet display
- `BalanceHistoryModal.jsx` - Show audit log
- `EditBalanceModal.jsx` - Edit balance and date
