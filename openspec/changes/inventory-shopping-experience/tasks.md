# Implementation Tasks

## Backend Core
- [ ] Update Prisma Schema: Add `returnProofImage` to `Loan` model <!-- id: schema-update -->
- [ ] Update API: `POST /api/inventory/loans` to support batch creation <!-- id: api-batch-loan -->
- [ ] Update API: `POST /api/inventory/loans/:id/return` to handle image upload and status change to `RETURN_VERIFICATION` <!-- id: api-return-upload -->
- [ ] Update API: `POST /api/inventory/loans/:id/verify` for admin to finalize return <!-- id: api-verify -->

## Frontend: Shopping & Checkout
- [ ] Create `CartContext` or use local state for shopping cart <!-- id: fe-cart-logic -->
- [ ] Refactor Asset List to support "Shop Mode" (Grid view, Add to Cart) <!-- id: fe-shop-view -->
- [ ] Implement `CheckoutDialog` with Due Date picker <!-- id: fe-checkout -->
- [ ] Integrate batch loan API <!-- id: fe-checkout-integrate -->

## Frontend: Return Flow
- [ ] Create `ReturnAssetDialog` with image upload preview <!-- id: fe-return-dialog -->
- [ ] Update `MyLoans` to show "Return" button and status `RETURN_VERIFICATION` <!-- id: fe-my-loans-return -->
- [ ] Integrate return API <!-- id: fe-return-integrate -->

## Frontend: Admin Verification
- [ ] Update `LoanList` to filter/show `RETURN_VERIFICATION` items <!-- id: fe-admin-list -->
- [ ] Create `VerifyReturnDialog` displaying proof image <!-- id: fe-verify-dialog -->

## UI/UX Polish
- [ ] Implement "Snake" Timeline component for loan stages <!-- id: ui-snake-timeline -->
- [ ] Update Dashboard helper text/visuals <!-- id: ui-dashboard -->
- [ ] Add "New" badge to relevant menus (optional) <!-- id: ui-badges -->
