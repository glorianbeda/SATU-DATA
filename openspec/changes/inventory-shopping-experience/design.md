# Design: Inventory Shopping Experience

## 1. Data Model Changes

### `Loan` Model (Prisma)
We need to store the proof of return image and potentially track the verification status.

```prisma
model Loan {
  // ... existing fields
  returnProofImage String?  // URL to the uploaded proof image
  
  // Status additions/clarifications:
  // PENDING: Requested
  // APPROVED: Awaiting pickup/handover? (Or directly BORROWED if immediate)
  // BORROWED: Currently with user
  // RETURN_VERIFICATION: User has submitted return + photo, waiting for admin
  // RETURNED: Admin confirmed return
}
```

## 2. Frontend Components

### Asset "Shop" (`/inventory/shop`)
- **Layout:** Grid of `AssetCard` components.
- **Interactions:** "Add to Cart" button toggles selection.
- **Cart:** Floating action button or top bar indicator showing count. Clicking opens a summary dialog.

### Checkout Flow
- **Input:** "Tanggal Pengembalian" (Due Date) - applies to all items in cart.
- **Confirmation:** Summary list of assets.
- **Action:** POST to `/api/inventory/loans/batch`.

### Return Flow (`/inventory/loans/my-loans`)
- **Action:** "Kembalikan" button on `BORROWED` items.
- **Modal:** `ReturnAssetDialog`.
  - Input: File upload (Image).
  - Preview: Show image before submit.
  - Action: PUT to `/api/inventory/loans/:id/return` with image.
- **Status Update:** Loan status changes to `RETURN_VERIFICATION`.

### Admin Verification (`/inventory/loans`)
- **Filter:** New tab/filter for `Verification Needed`.
- **Action:** "Verifikasi Pengembalian".
- **View:** Shows asset details + User's uploaded proof photo.
- **Decision:** "Confirm Return" (sets `RETURNED`) or "Reject" (reverts to `BORROWED` or stays in verification with notes).

### Visual Timeline ("Alur Peminjaman")
- A custom SVG or CSS-based component depicting the flow:
  `Select` -> `Request` -> `Approval` -> `Use` -> `Return (Upload)` -> `Verification` -> `Done`
- Layout: "Snake" layout (S-shape) as requested, possibly responsive.

## 3. Workflow Updates
- **Dashboard:** Show "Active Loans" and "Pending Returns" prominently.
- **Sidebar:** Add `Shop` or update `Asset Management` for non-admins to point to the Shop view.
