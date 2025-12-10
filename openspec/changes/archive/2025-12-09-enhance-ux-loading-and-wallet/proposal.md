# Enhance UX: Page Loading and Wallet UI

## Summary
This change addresses two UX issues:
1. **Page transition feels laggy** - Navigation freezes with no feedback; loading indicator appears too late
2. **Saldo Asli with date-based logic** - Wallet UI to view/edit initial balance, affecting only transactions newer than the balance date

## Motivation
- Users navigating between pages (e.g., Pemasukan → Pengeluaran) see no feedback during data loading
- The "Saldo Asli" needs to be editable with a date reference point for calculating balance

## Scope
- **Frontend**: Fix loading indicator timing (show immediately on navigation, not after data loads)
- **Frontend + Backend**: Wallet UI with balance modification and audit logging

## Key Design Decisions

### 1. Page Loading Indicator
- Show loading **immediately** when route changes (before data fetching)
- Use NProgress for route-level loading + skeleton/spinner for data loading
- Fix current issue where loading appears only after data is ready

### 2. Wallet UI for Saldo
- Premium wallet card design with glassmorphism
- "Saldo Asli" has a date field - only transactions **after** this date are calculated
- Formula: `currentBalance = saldoAsli + income(after date) - expense(after date)`
- Audit log for all balance changes
