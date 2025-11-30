# Project Planning: Satu Data+

## Vision
A future-proof, minimalist, and professional web application for data management, starting with OMK financial reports and a digital signature system.

## Tech Stack
-   **Frontend**: React (Vite), Material UI (MUI)
-   **Backend**: Node.js (Express), File-based routing
-   **Database**: MySQL, Prisma ORM
-   **Infrastructure**: Docker, Docker Compose

## Features

### 1. OMK Financial Reports (Penyesuaian Saldo)
-   **Input**: Pemasukan (Income), Pengeluaran (Expense)
-   **Reporting**:
    -   Export to PDF
    -   Send to WhatsApp (Integration required)
-   **Real-time Editing**: Spreadsheet-like interface for quick edits.

### 2. Sign System (Digital Signature)
-   **Concept**: Similar to DIGISIGN.
-   **Functionality**: Store and manage user signatures securely.
-   **Usage**: Signing documents within the system.

### 3. User Management
-   **Authentication**: Login, Register.
-   **Structure**:
    -   `/user/login`
    -   `/user/register`
    -   `/user/data`

## Design Guidelines
-   **Theme**: Blue and White (Primary).
-   **Modes**: Light and Dark support.
-   **Style**: Minimalist, Professional, "Glassmorphism" touches where appropriate.
-   **Components**: Reusable Material UI components.
