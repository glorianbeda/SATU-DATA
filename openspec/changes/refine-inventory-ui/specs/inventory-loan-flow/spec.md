# Spec: Inventory Loan Flow

## ADDED Requirements

### Requirement: Loan Date Columns
The Loan Request table SHALL display borrow date and due date columns for tracking.

#### Scenario: Date columns visible in table
**Given** an admin views the Loan Request table  
**Then** the table MUST include "Borrow Date" column  
**And** the table MUST include "Due Date" column  
**And** dates MUST be formatted in local format (id-ID)

#### Scenario: Empty date handling
**Given** a loan is still pending approval  
**When** the admin views the table  
**Then** Borrow Date and Due Date cells MUST show "-" placeholder

---

### Requirement: Overdue Visual Indicator
Loans past their due date SHALL be visually highlighted.

#### Scenario: Overdue loan highlighting
**Given** a loan has a due date in the past  
**And** the loan status is BORROWED (not yet returned)  
**When** the table is rendered  
**Then** the row MUST have a visual indicator (e.g., red border or badge)

#### Scenario: Overdue badge
**Given** a loan is overdue  
**Then** the status badge MUST show "Overdue" with error (red) color

---

### Requirement: Status Badge Colors
Loan status badges SHALL use consistent, meaningful colors.

#### Scenario: Status color mapping
**Given** a loan with status PENDING  
**Then** badge MUST be orange/warning color

**Given** a loan with status APPROVED  
**Then** badge MUST be blue/info color

**Given** a loan with status BORROWED  
**Then** badge MUST be green/success color

**Given** a loan with status RETURNED  
**Then** badge MUST be gray/default color

**Given** a loan with status REJECTED  
**Then** badge MUST be red/error color

---

## MODIFIED Requirements

### Requirement: Clear User Flow for Borrowing
Regular users SHALL have a clear path to request and track loans.

#### Scenario: User can view available assets
**Given** a MEMBER user  
**When** they access the inventory section  
**Then** they MUST see a list of available assets they can request to borrow

#### Scenario: User can track their loan requests
**Given** a MEMBER user has submitted loan requests  
**Then** they MUST be able to view their loan history  
**And** see the status of each request (Pending, Approved, Rejected, etc.)
