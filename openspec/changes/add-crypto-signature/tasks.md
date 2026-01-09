# Tasks: Add Cryptographic Document Verification

## Phase 1: Database & Utilities

### 1.1 Add DocumentHash Model
- [x] Add `DocumentHash` model to `backend/prisma/schema.prisma`
- [x] Add relation to `Document` model
- [x] Run `yarn prisma db push` to sync schema
- [x] Verify migration success

### 1.2 Create Crypto Utilities
- [x] Create `backend/utils/documentCrypto.js`
- [x] Implement `generateHash(buffer)` - SHA-256 hash
- [x] Implement `createSignature(hash, secret)` - HMAC-SHA256
- [x] Implement `verifySignature(hash, signature, secret)` - Constant-time comparison

---

## Phase 2: Backend Integration

### 2.1 Update Upload Endpoint
- [x] Modify `POST /api/documents/upload`
- [x] After storing document, create `DocumentHash` record with `originalHash`

### 2.2 Update Sign Endpoint  
- [x] Modify `POST /api/documents/sign`
- [x] After all signatures complete (when QR embedded):
  - Calculate new `signedHash`
  - Create `signatureData` with HMAC
  - Update `DocumentHash` record

### 2.3 Update Validate Endpoint
- [x] Modify `GET /api/documents/validate/:checksum`
- [x] Include hash verification info in response:
  - `originalHash`
  - `signedHash`
  - `isSignatureValid` (HMAC verification result)
  - `algorithm`

### 2.4 Update File Verification Endpoint
- [x] Update `POST /api/documents/validate-upload`
- [x] Use `generateHash` from documentCrypto
- [x] Find matching `DocumentHash` by `signedHash` OR `originalHash`
- [x] Return verification result with document details and hashInfo

---

## Phase 3: Frontend Updates

### 3.1 Update Validate Page
- [x] Modify `ValidateDocument.jsx`
- [x] File upload dropzone already exists
- [x] Display verification result with hashInfo:
  - Server Signature Valid/Invalid status
  - Algorithm and match type
  - Original and Signed hash values

---

## Phase 4: Verification & Testing

### 4.1 Integration Testing
- [ ] Upload new document → Hash stored correctly
- [ ] Sign document → signedHash & signature updated
- [ ] Verify via code → Enhanced response works
- [ ] Verify via file upload → Hash comparison works

### 4.2 Backward Compatibility
- [x] Existing documents without DocumentHash → Fallback to Document.checksum

