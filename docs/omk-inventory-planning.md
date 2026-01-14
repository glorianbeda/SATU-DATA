# OMK Inventory (Inventaris OMK) - Planning Document

## Overview
A comprehensive inventory management system for OMK with barcode/QR code support and loan management capabilities.

## Features

### 1. Sidebar Navigation
New menu section: **Inventaris OMK** with the following children:
- **Dashboard** - Overview with borrowing workflow
- **Manajemen Asset** - Asset management (Admin+ only)
- **Request Peminjaman** - Loan requests and borrowing logs

### 2. Core Features

#### 2.1 Asset Management (Manajemen Asset)
**Access:** SUPER_ADMIN, ADMIN only

**Features:**
- Create, Read, Update, Delete (CRUD) assets
- Barcode/QR code generation for each asset
- Asset categories
- Asset status tracking (Available, Borrowed, Maintenance, Lost)
- Asset photos/images
- Asset specifications (brand, model, serial number, etc.)
- Location tracking
- Purchase date and price tracking
- Depreciation tracking (optional)
- Bulk import/export assets

**Data Fields:**
- id (auto)
- name (required)
- code/asset_id (unique identifier)
- barcode/qr_code (generated)
- category_id (foreign key)
- status (enum: AVAILABLE, BORROWED, MAINTENANCE, LOST)
- brand
- model
- serial_number
- purchase_date
- purchase_price
- location
- description
- image_url
- created_by (user_id)
- created_at
- updated_at

#### 2.2 Loan Management (Request Peminjaman)
**Access:** All authenticated users

**Features:**
- Request to borrow assets
- Approval workflow (pending → approved → rejected)
- Borrowing duration tracking
- Return process with condition check
- Borrowing history per asset
- Borrowing history per user
- Overdue tracking
- Email notifications for approvals/returns

**Loan Status Flow:**
```
PENDING → APPROVED → BORROWED → RETURNED
                ↓
              REJECTED
```

**Data Fields (Loan/Borrowing):**
- id (auto)
- asset_id (foreign key)
- borrower_id (user_id)
- status (enum: PENDING, APPROVED, BORROWED, RETURNED, REJECTED, OVERDUE)
- request_date
- approved_date
- borrowed_date
- due_date
- returned_date
- approved_by (user_id)
- notes
- return_condition (enum: GOOD, DAMAGED, LOST)
- return_notes
- created_at
- updated_at

**Data Fields (Borrowing Log per Item):**
- id (auto)
- asset_id (foreign key)
- loan_id (foreign key)
- action (enum: BORROWED, RETURNED, MAINTENANCE, DAMAGED)
- action_date
- user_id (who performed action)
- notes
- created_at

#### 2.3 Dashboard (Inventaris OMK Dashboard)
**Access:** All authenticated users

**Features:**
- Overview statistics:
  - Total assets
  - Available assets
  - Borrowed assets
  - Maintenance assets
  - Pending requests
  - Overdue returns
- Recent borrowing activity
- Popular assets (most borrowed)
- Asset status distribution chart
- Quick action buttons (Request Loan, View My Loans)
- Borrowing workflow visualization

**Borrowing Workflow Visualization:**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Request    │───▶│  Approve    │───▶│  Borrow     │───▶│  Return     │
│  Loan       │    │  (Admin)    │    │  Asset      │    │  Asset      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
     │                                    │
     ▼                                    ▼
┌─────────────┐                    ┌─────────────┐
│  View       │                    │  Check      │
│  Status     │                    │  Condition  │
└─────────────┘                    └─────────────┘
```

### 3. Barcode/QR Code System

**Features:**
- Automatic barcode/QR code generation when creating assets
- Print barcode/QR code labels
- Scan barcode/QR code to:
  - View asset details
  - Request loan
  - Update status (admin only)
- Barcode format: `OMK-{category_code}-{sequential_number}`
- QR code format: URL with asset ID for quick access

**Libraries to Consider:**
- Frontend: `react-qr-code` or `qrcode.react`
- Backend: `qrcode` (already installed for documents)

## Database Schema

### New Models

```prisma
model AssetCategory {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  code      String   @unique  // e.g., "LAP", "MON", "PRN"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  assets    Asset[]
}

model Asset {
  id            Int      @id @default(autoincrement())
  name          String
  assetCode     String   @unique  // e.g., "OMK-LAP-001"
  barcode       String   @unique
  qrCode        String?  // URL or data string
  categoryId    Int
  status        String   @default("AVAILABLE") // AVAILABLE, BORROWED, MAINTENANCE, LOST
  brand         String?
  model         String?
  serialNumber  String?
  purchaseDate   DateTime?
  purchasePrice Float?
  location      String?
  description   String?   @db.Text
  imageUrl      String?   @db.Text
  createdById   Int
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  category      AssetCategory @relation(fields: [categoryId], references: [id])
  createdBy     User         @relation("AssetCreator", fields: [createdById], references: [id])
  loans         Loan[]
  logs          AssetLog[]

  @@index([categoryId])
  @@index([createdById])
  @@index([status])
}

model Loan {
  id            Int      @id @default(autoincrement())
  assetId       Int
  borrowerId    Int
  status        String   @default("PENDING") // PENDING, APPROVED, BORROWED, RETURNED, REJECTED, OVERDUE
  requestDate   DateTime @default(now())
  approvedDate  DateTime?
  borrowedDate  DateTime?
  dueDate       DateTime?
  returnedDate   DateTime?
  approvedById  Int?
  notes         String?  @db.Text
  returnCondition String? // GOOD, DAMAGED, LOST
  returnNotes   String?  @db.Text
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  asset         Asset    @relation(fields: [assetId], references: [id], onDelete: Cascade)
  borrower      User      @relation("Borrower", fields: [borrowerId], references: [id])
  approvedBy    User?     @relation("LoanApprover", fields: [approvedById], references: [id])
  logs          AssetLog[]

  @@index([assetId])
  @@index([borrowerId])
  @@index([status])
  @@index([dueDate])
}

model AssetLog {
  id        Int      @id @default(autoincrement())
  assetId   Int
  loanId    Int?
  action    String   // BORROWED, RETURNED, MAINTENANCE, DAMAGED, STATUS_CHANGE
 actionDate DateTime @default(now())
  userId    Int
  notes     String?  @db.Text
  createdAt DateTime @default(now())
  asset     Asset    @relation(fields: [assetId], references: [id], onDelete: Cascade)
  loan      Loan?    @relation(fields: [loanId], references: [id], onDelete: SetNull)
  user      User      @relation("LogCreator", fields: [userId], references: [id])

  @@index([assetId])
  @@index([actionDate])
}
```

### Model Updates

```prisma
model User {
  // ... existing fields
  createdAssets  Asset[]       @relation("AssetCreator")
  borrowedLoans Loan[]        @relation("Borrower")
  approvedLoans Loan[]?       @relation("LoanApprover")
  assetLogs     AssetLog[]     @relation("LogCreator")
}
```

## Frontend Structure

### Pages
```
frontend/src/pages/inventory/
├── index.jsx                    # Dashboard
├── assets/
│   ├── index.jsx                # Asset list (Admin+)
│   ├── create.jsx              # Create asset (Admin+)
│   ├── [id]/
│   │   ├── index.jsx          # Asset details
│   │   └── edit.jsx          # Edit asset (Admin+)
│   └── categories/
│       └── index.jsx          # Category management (Admin+)
└── loans/
    ├── index.jsx                # My loans / All loans (Admin+)
    ├── request.jsx             # Request new loan
    ├── [id]/
    │   └── index.jsx          # Loan details
    └── history.jsx            # Borrowing history
```

### Features
```
frontend/src/features/inventory/
├── index.js
├── components/
│   ├── AssetCard.jsx
│   ├── AssetForm.jsx
│   ├── AssetTable.jsx
│   ├── BarcodeScanner.jsx
│   ├── LoanRequestForm.jsx
│   ├── LoanTable.jsx
│   ├── LoanStatusBadge.jsx
│   ├── QRCodeDisplay.jsx
│   └── DashboardStats.jsx
├── constants/
│   └── api.js
└── interfaces/
    └── index.js
```

## Backend Structure

### Routes
```
backend/routers/api/inventory/
├── assets/
│   ├── GET__index/index.js           # List assets (Admin+)
│   ├── POST__index/index.js          # Create asset (Admin+)
│   ├── GET__[id]/index.js            # Get asset details
│   ├── PUT__[id]/index.js            # Update asset (Admin+)
│   ├── DELETE__[id]/index.js         # Delete asset (Admin+)
│   ├── POST__generate-barcode/index.js # Generate barcode (Admin+)
│   └── categories/
│       ├── GET__index/index.js       # List categories (Admin+)
│       ├── POST__index/index.js      # Create category (Admin+)
│       └── DELETE__[id]/index.js   # Delete category (Admin+)
├── loans/
│   ├── GET__index/index.js           # List loans
│   ├── POST__index/index.js          # Request loan
│   ├── GET__[id]/index.js            # Get loan details
│   ├── PUT__[id]/approve/index.js     # Approve loan (Admin+)
│   ├── PUT__[id]/reject/index.js      # Reject loan (Admin+)
│   ├── PUT__[id]/borrow/index.js     # Mark as borrowed (Admin+)
│   ├── PUT__[id]/return/index.js      # Return asset
│   └── history/
│       ├── GET__asset/index.js       # Asset history
│       └── GET__user/index.js       # User history
└── dashboard/
    └── GET__index/index.js           # Dashboard stats
```

### Utilities
```
backend/utils/
├── barcode.js          # Barcode generation
├── qrCode.js          # QR code generation (extend existing)
└── inventory.js        # Inventory-specific helpers
```

## Implementation Phases

### Phase 1: Database & Backend Setup
- [x] Create Prisma models (AssetCategory, Asset, Loan, AssetLog)
- [x] Run migrations
- [x] Create backend routes structure
- [x] Implement basic CRUD for assets
- [x] Implement basic CRUD for categories

### Phase 2: Asset Management Frontend
- [x] Create asset list page
- [x] Create asset form (create/edit)
- [x] Implement barcode/QR code display
- [x] Create category management
- [x] Add image upload for assets

### Phase 3: Loan System Backend
- [x] Implement loan request API
- [x] Implement loan approval/rejection APIs
- [x] Implement borrowing/returning APIs
- [x] Create loan history endpoints
- [x] Implement asset logging system (database model ready)

### Phase 4: Loan System Frontend
- [x] Create loan request form
- [x] Create loan list page (for users and admins)
- [x] Implement approval interface (Admin+)
- [x] Create return interface
- [x] Add loan history view

### Phase 5: Dashboard
- [x] Create inventory dashboard
- [x] Implement statistics cards
- [x] Add charts for asset distribution
- [x] Show recent activity
- [x] Implement borrowing workflow visualization

### Phase 6: Barcode/QR Code Features
- [x] Implement barcode generation
- [x] Implement QR code generation
- [x] Create barcode scanner component
- [x] Add print functionality for labels
- [x] Implement scan-to-view functionality

### Phase 7: Notifications & Polish
- [x] Add email notifications for loan status changes
- [x] Implement overdue tracking (backend logic ready)
- [ ] Add bulk import/export
- [ ] Polish UI/UX
- [x] Add accessibility features

## Role Permissions

**Status:** ✅ DONE - Permissions added to frontend/src/config/roles.js

Update `frontend/src/config/roles.js`:

```javascript
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: {
    // ... existing permissions
    canManageInventory: true,
    canApproveLoans: true,
    canViewAllLoans: true,
  },
  [ROLES.ADMIN]: {
    // ... existing permissions
    canManageInventory: true,
    canApproveLoans: true,
    canViewAllLoans: true,
  },
  [ROLES.MEMBER]: {
    // ... existing permissions
    canManageInventory: false,
    canApproveLoans: false,
    canViewAllLoans: false,
    canRequestLoans: true,
  },
};
```

## Navigation Config Update

**Status:** ✅ DONE - Inventory section already added in navigation.js (lines 233-259)

Add to `frontend/src/config/navigation.js`:

```javascript
export const navigationConfig = {
  // ... existing sections

  // INVENTARIS OMK section
  inventory: {
    labelKey: "sidebar.inventory",
    icon: InventoryIcon, // Need to import
    collapsible: true,
    items: [
      {
        id: "inventory-dashboard",
        labelKey: "sidebar.inventory_dashboard",
        icon: DashboardIcon,
        path: "/inventory",
      },
      {
        id: "asset-management",
        labelKey: "sidebar.asset_management",
        icon: AssetIcon, // Need to import
        path: "/inventory/assets",
        permission: "canManageInventory",
      },
      {
        id: "loan-requests",
        labelKey: "sidebar.loan_requests",
        icon: RequestIcon, // Need to import
        path: "/inventory/loans",
      },
    ],
  },
};
```

## API Endpoints Summary

**Status:** ✅ DONE - All core endpoints implemented

| Method | Endpoint | Description | Access | Status |
|---------|-----------|-------------|---------|--------|
| GET | `/api/inventory/assets` | List assets with filters | Admin+ | ✅ |
| POST | `/api/inventory/assets` | Create asset | Admin+ | ✅ |
| GET | `/api/inventory/assets/:id` | Get asset details | Authenticated | ✅ |
| PUT | `/api/inventory/assets/:id` | Update asset | Admin+ | ✅ |
| DELETE | `/api/inventory/assets/:id` | Delete asset | Admin+ | ✅ |
| POST | `/api/inventory/assets/generate-barcode` | Generate QR code | Admin+ | ✅ |
| GET | `/api/inventory/categories` | List categories | Admin+ | ✅ |
| POST | `/api/inventory/categories` | Create category | Admin+ | ✅ |
| DELETE | `/api/inventory/categories/:id` | Delete category | Admin+ | ✅ |
| GET | `/api/inventory/loans` | List loans | Authenticated (filtered by role) | ✅ |
| POST | `/api/inventory/loans` | Request loan | Authenticated | ✅ |
| GET | `/api/inventory/loans/:id` | Get loan | Authenticated | ✅ |
| PUT | `/api/inventory/loans/:id/approve` | Approve loan | Admin+ | ✅ |
| PUT | `/api/inventory/loans/:id/reject` | Reject loan | Admin+ | ✅ |
| PUT | `/api/inventory/loans/:id/borrow` | Mark borrowed | Admin+ | ✅ |
| PUT | `/api/inventory/loans/:id/return` | Return asset | Authenticated | ✅ |
| GET | `/api/inventory/history/asset` | Asset history | Authenticated | ✅ |
| GET | `/api/inventory/history/user` | User history | Authenticated | ✅ |

## i18n Keys

**Status:** ✅ DONE - Inventory translations added to id.json (lines 404-487) and en.json (lines 315-399)

Add to `frontend/src/locales/id.json` and `en.json`:

```json
{
  "sidebar": {
    "inventory": "Inventaris OMK",
    "inventory_dashboard": "Dashboard",
    "asset_management": "Manajemen Asset",
    "loan_requests": "Request Peminjaman"
  },
  "inventory": {
    "total_assets": "Total Aset",
    "available": "Tersedia",
    "borrowed": "Dipinjam",
    "maintenance": "Perbaikan",
    "pending_requests": "Permintaan Pending",
    "overdue": "Terlambat",
    "request_loan": "Ajukan Peminjaman",
    "my_loans": "Peminjaman Saya",
    "asset_code": "Kode Aset",
    "barcode": "Barcode",
    "qr_code": "QR Code",
    "scan_barcode": "Scan Barcode",
    "print_label": "Cetak Label"
  }
}
```

## Technical Considerations

### Barcode Generation
- Use `bwip-js` or similar library for barcode generation
- Support multiple barcode formats (Code 128, EAN-13, etc.)
- Store barcode as string in database

### QR Code Generation
- Extend existing `qrcode` library usage
- Generate QR codes containing asset URL: `${BASE_URL}/inventory/assets/${id}`
- Allow download of QR code image

### Asset Status Transitions
```
AVAILABLE → BORROWED → AVAILABLE
AVAILABLE → MAINTENANCE → AVAILABLE
AVAILABLE → LOST
BORROWED → OVERDUE → RETURNED
```

### Loan Duration Limits
- Default: 7 days
- Configurable per category
- Admin can override

### Email Notifications
- Loan request received (admin)
- Loan approved (borrower)
- Loan rejected (borrower)
- Loan due reminder (borrower)
- Loan overdue (borrower + admin)
- Asset returned (admin)

## Testing Checklist

- [x] Asset CRUD operations
- [x] Category management
- [x] Barcode/QR code generation and display
- [x] Loan request flow
- [x] Loan approval/rejection flow
- [x] Asset borrowing flow
- [x] Asset return flow
- [x] Status transitions
- [x] Role-based access control
- [ ] Dashboard statistics accuracy
- [ ] Email notifications
- [ ] Bulk import/export
- [ ] Barcode scanning functionality
