# Show Self-Sign Signature Preview

## Why

When signing a document yourself (self-sign mode), the preview shows "XX" placeholder instead of displaying the user's actual signature. Since the user already has a saved signature in their profile, the preview should show the real signature image.

## What Changes

Fix the signature preview in self-sign mode to show the actual signature image from the current user's profile instead of placeholder text.

## Root Cause Analysis

The issue is in the self-sign flow:
1. User selects "Tanda Tangan Sendiri" (self-sign mode)
2. They place a signature annotation on the document
3. Preview shows "XX" instead of their actual signature

The `getSignatureUrl` function in `AnnotateStep.jsx` checks `currentUser?.sign`, but:
- The API may return `signature` instead of `sign`
- Or the signature field might not be included in the profile response

## Proposed Changes

1. Verify the correct field name from profile API response
2. Update `getSignatureUrl` to use correct field name
3. Ensure profile API includes signature URL in response

## Affected Files

- `frontend/src/features/omk-docs/components/wizard/AnnotateStep.jsx`
- Possibly `backend/routers/profileRoutes.js` (if signature not included)
