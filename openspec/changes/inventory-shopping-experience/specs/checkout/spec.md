# Spec: Checkout Process

## ADDED Requirements

### Requirement: Batch Checkout Flow
The system MUST support checking out multiple assets in a single transaction with a unified due date.

#### Scenario: Checkout Configuration
GIVEN I have items in my cart
WHEN I proceed to checkout
THEN I am prompted to select a "Return Due Date"
AND this date applies to all items in the current batch

#### Scenario: Batch Request Submission
GIVEN I have confirmed my selection and due date
WHEN I submit the request
THEN a `Loan` record is created for EACH asset
AND the status for all records is set to `PENDING`
AND the `requestDate` is set to now
AND the `dueDate` is set to the selected date

#### Scenario: Post-Checkout Feedback
GIVEN I have successfully submitted a request
THEN the cart is cleared
AND I am redirected to "My Loans" to see the pending requests
