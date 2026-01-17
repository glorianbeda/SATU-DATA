# Spec: Return Verification with Proof

## MODIFIED Requirements

### Requirement: User Return Flow
Users MUST be able to initiate the return process and provide photographic proof of the asset's condition.

#### Scenario: Return Action
GIVEN I have an active loan (Status: `BORROWED`)
WHEN I view "My Loans"
THEN I see a "Return" (`Kembalikan`) button

#### Scenario: Uploading Return Proof
GIVEN I click the "Return" button
THEN I am presented with a dialog to upload a "Proof of Return" photo
AND I cannot submit without selecting an image

#### Scenario: Status Transition to Verification
GIVEN I submit the return proof
THEN the Loan status changes to `RETURN_VERIFICATION`
AND the uploaded image URL is saved to `returnProofImage`
AND the item moves to a "Verification Pending" list for admins

### Requirement: Admin Verification
Admins SHALL verify the returned asset's condition via the uploaded proof before finalizing the return.

#### Scenario: Admin Verification
GIVEN I am an admin
AND there is a loan in `RETURN_VERIFICATION` status
WHEN I verify the return
THEN I can view the proof image
AND I can "Approve" (Status -> `RETURNED`) or "Reject/Request Info" (Status -> `BORROWED` or stay `RETURN_VERIFICATION` with notes)
