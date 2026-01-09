# Design: Cryptographic Document Verification

## Problem Statement

Saat ini sistem OMK-Docs menggunakan checksum (SHA-256) untuk **identifikasi dokumen** (unique identifier), namun belum mengimplementasikan **digital signature** yang sesungguhnya dengan pasangan kunci publik/privat. 

Pengguna meminta implementasi verifikasi dokumen berbasis hash yang benar secara kriptografi:
1. Dokumen asli → di-hash → menghasilkan digest
2. Digest ditandatangani dengan private key
3. Verifikasi menggunakan public key untuk validasi integritas

## Current State Analysis

```
┌─────────────────────────────────────────────────────────────┐
│                    CURRENT FLOW                              │
├─────────────────────────────────────────────────────────────┤
│  Upload PDF → SHA-256 checksum → Store in Document.checksum │
│                        ↓                                     │
│  Sign → Embed signatures → New checksum → Update Document   │
│                        ↓                                     │
│  Validate → Lookup checksum in DB → Return document info    │
└─────────────────────────────────────────────────────────────┘
```

**Limitations:**
- Checksum digunakan untuk lookup, bukan verifikasi kriptografi
- Tidak ada penyimpanan hash dokumen asli (before signing)
- Tidak ada signature data yang bisa diverifikasi secara independen
- Validasi bergantung pada kecocokan database, bukan integritas dokumen

## Proposed Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROPOSED FLOW                                 │
├─────────────────────────────────────────────────────────────────┤
│  Upload PDF                                                      │
│      ↓                                                          │
│  SHA-256(document) → Store as originalHash                      │
│      ↓                                                          │
│  Store in DocumentHash table                                    │
├─────────────────────────────────────────────────────────────────┤
│  Sign PDF (each signer)                                         │
│      ↓                                                          │
│  SHA-256(modified_document) → signedHash                        │
│      ↓                                                          │
│  HMAC-SHA256(signedHash, server_secret) → signatureData         │
│      ↓                                                          │
│  Update DocumentHash with signedHash + signatureData            │
├─────────────────────────────────────────────────────────────────┤
│  Validate Document                                              │
│      ↓                                                          │
│  Option 1: Upload file → SHA-256 → Compare with signedHash      │
│  Option 2: Enter code → Lookup → Return verification info       │
│      ↓                                                          │
│  Verify signatureData with HMAC → Confirm server signed it      │
│      ↓                                                          │
│  Return: Valid/Invalid + Document details + Signer info         │
└─────────────────────────────────────────────────────────────────┘
```

## Key Design Decisions

### 1. Server-Side Signing (HMAC) vs PKI

**Decision: Use HMAC-SHA256 with server secret**

**Rationale:**
- Tidak memerlukan infrastruktur PKI (Certificate Authority)
- Lebih sederhana untuk implementasi awal
- Cocok untuk use case internal dimana server adalah authority
- Bisa di-upgrade ke PKI di masa depan jika diperlukan

**Trade-off:**
- Tidak bisa diverifikasi secara offline tanpa akses server
- Server menjadi single point of trust

### 2. Hash Storage Strategy

**Decision: Simpan hash di tahap tertentu dalam lifecycle dokumen:**
- `originalHash`: Hash saat pertama kali upload (sebelum tanda tangan)
- `signedHash`: Hash final setelah semua tanda tangan + QR code

**Rationale:**
- Memungkinkan verifikasi bahwa dokumen tidak dimodifikasi setelah signing
- originalHash berguna untuk audit trail

### 3. Verification Code Format

**Decision: Pertahankan format existing (8-char dari checksum prefix)**

Current: `ABC1-2DEF` (dari checksum)

**Rationale:**
- Backward compatible dengan dokumen yang sudah ada
- User sudah familiar dengan format ini

## Database Schema Changes

```prisma
model DocumentHash {
  id            Int       @id @default(autoincrement())
  documentId    Int       @unique
  document      Document  @relation(fields: [documentId], references: [id], onDelete: Cascade)
  originalHash  String    // SHA-256 of original uploaded PDF
  signedHash    String?   // SHA-256 of final signed PDF (null until fully signed)
  signatureData String?   @db.Text // HMAC signature of signedHash
  algorithm     String    @default("SHA256") // Hash algorithm used
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

**Alternative Considered:** Add fields directly to Document model
- Rejected: Separation of concerns, Document model already has many fields

## API Changes

### Modified Endpoints

| Endpoint | Change |
|----------|--------|
| `POST /upload` | Generate & store originalHash in DocumentHash |
| `POST /sign` | Update signedHash after signing complete |
| `GET /validate/:checksum` | Add hash verification info in response |

### New Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /validate-upload` | Accept file upload, compute hash, verify against DB |

## Security Considerations

1. **Server Secret Management**
   - Store `DOCUMENT_SIGNING_SECRET` in environment variables
   - Minimum 32 bytes random value
   - Rotate periodically

2. **Hash Algorithm**
   - SHA-256 (current) is sufficient for integrity checking
   - Stored algorithm field allows future migration if needed

3. **Timing Attacks**
   - Use constant-time comparison for hash verification

## File Changes Summary

| File | Change Type |
|------|-------------|
| `backend/prisma/schema.prisma` | Add DocumentHash model |
| `backend/utils/documentCrypto.js` | NEW: Hash & signature utilities |
| `backend/routers/api/documents/POST__upload/index.js` | Store originalHash |
| `backend/routers/api/documents/POST__sign/index.js` | Update signedHash |
| `backend/routers/api/documents/GET__validate-[checksum]/index.js` | Enhanced response |
| `backend/routers/api/documents/POST__validate-upload/index.js` | NEW: File verification |
| `frontend/src/pages/docs/validate.jsx` | Add file upload verification UI |
