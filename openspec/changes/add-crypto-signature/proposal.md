# Proposal: Add Cryptographic Document Verification

## Summary

Implementasi sistem verifikasi dokumen berbasis hash kriptografi yang sesungguhnya untuk OMK-Docs. Saat ini sistem hanya menggunakan checksum sebagai identifier unik. Proposal ini menambahkan:

1. **Hash Integrity Tracking** - Menyimpan hash dokumen asli dan hash dokumen yang sudah ditandatangani
2. **Server-Side Signature** - HMAC signature untuk membuktikan dokumen ditandatangani melalui sistem
3. **File Upload Verification** - User dapat upload file untuk memverifikasi keasliannya

## Motivation

Dari saran user:
> Hash memastikan dokumen tidak diubah (integrity)
> Tanda tangan digital memastikan dokumen memang berasal dari pemilik private key (authenticity)

Sistem saat ini:
- ✅ Menyimpan checksum untuk identifikasi dokumen
- ❌ Tidak menyimpan hash dokumen asli (sebelum tanda tangan)
- ❌ Tidak ada bukti kriptografi bahwa dokumen ditandatangani via sistem
- ❌ Validasi hanya berupa lookup database, bukan verifikasi integritas file

## Scope

### In Scope
- Database schema: Tambah model `DocumentHash`
- Backend crypto utilities untuk hash generation & HMAC signing
- Update upload/sign endpoints untuk store hash
- New endpoint untuk verifikasi via file upload
- Frontend update untuk file upload verification UI

### Out of Scope
- PKI (Public Key Infrastructure) dengan sertifikat digital
- Client-side signing dengan private key user
- Blockchain-based verification
- HSM (Hardware Security Module) integration

## Related Changes

- Depends on: `improve-omk-docs` (COMPLETE)
- See: [design.md](./design.md) for architecture details
