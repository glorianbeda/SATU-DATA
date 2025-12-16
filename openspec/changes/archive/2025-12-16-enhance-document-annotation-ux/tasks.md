# Tasks: Enhance Document Annotation UX

## 1. Verify Language Persistence

- [x] 1.1 Confirm `i18n.js` saves language preference to localStorage (already implemented)
- [x] 1.2 Test language switch persists across page reload

## 2. Auto-show Signature in Self-Mode

- [x] 2.1 Update `AnnotateStep.jsx` to pass `currentUser.sign` to `DraggableAnnotation`
- [x] 2.2 Update `DraggableAnnotation` to display actual signature image when `type === 'signature'` and signer is current user
- [x] 2.3 If no signature exists, show placeholder text

## 3. Real-Time Preview for Annotations

- [x] 3.1 Ensure date annotation shows actual formatted date (already implemented in `getLabel()`)
- [x] 3.2 Text annotation shows live-typed text (already implemented)
- [x] 3.3 Initial/Paraf shows user's initial letters from name

## 4. Font Size Control

- [x] 4.1 Add fontSize state to `AnnotateStep.jsx` (default: 12px)
- [x] 4.2 Add slider component in tools panel for font size (8-24px range)
- [x] 4.3 Pass fontSize prop to `DraggableAnnotation`
- [x] 4.4 Apply fontSize to text content in annotations
- [x] 4.5 Store fontSize in annotation object for per-annotation sizing

## 5. Thicken Signature Stroke

- [x] 5.1 Update `ProfileEditForm.jsx` → `SignatureCanvas`
- [x] 5.2 Add `minWidth={2}` and `maxWidth={4}` props for thicker strokes
- [x] 5.3 Test signature drawing and verify thickness improvement

## 6. Verification

- [x] 6.1 Run `yarn dev` in frontend
- [x] 6.2 Test language switch → reload → verify language persists
- [x] 6.3 Go to Profile → Draw signature → verify thicker stroke
- [x] 6.4 Go to OMK Docs → Request Signature (self-mode) → verify signature preview
- [x] 6.5 Test font size slider → verify preview updates in real-time
- [x] 6.6 Run `yarn build` to ensure no build errors
