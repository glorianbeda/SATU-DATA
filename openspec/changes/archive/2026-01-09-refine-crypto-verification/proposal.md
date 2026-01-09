# Proposal: Refine Crypto Verification

## Summary

Perbaikan implementasi crypto verification berdasarkan feedback user:
1. **Tambah terjemahan** - Kosakata baru di halaman validasi belum diterjemahkan
2. **Hapus tab checksum manual** - Hanya gunakan file upload verification
3. **PDF tetap polos** - Hapus QR code & teks "Dokumen Terverifikasi", embed verifikasi di metadata PDF secara invisible

## Motivation

User ingin dokumen PDF tetap bersih tanpa watermark/footer visible. Verifikasi dilakukan via hash check dengan upload file, bukan via QR code atau kode manual.

## Scope

### In Scope
- Tambah translation keys `docs.*` untuk hash verification UI (id.json, en.json)
- Hapus tab "Enter Checksum" dari ValidateDocument.jsx
- Refactor `pdfQrCode.js` untuk embed verification di PDF metadata (XMP atau custom metadata) tanpa visual footprint
- Update sign endpoint untuk tidak memanggil visible QR embed

### Out of Scope
- Perubahan flow signing
- Backend API changes (already working)
