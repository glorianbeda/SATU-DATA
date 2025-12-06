# Refine Signature Setup Flow

## Summary
Memindahkan pemilihan penanda tangan ke langkah Upload dan menambahkan opsi "Saya ikut tanda tangan".

## Problem
Saat ini pemilihan penanda tangan dilakukan di langkah Anotasi, yang mungkin membingungkan. Pengguna ingin menentukan siapa saja yang menandatangani dokumen *sebelum* mulai menempatkan anotasi.

## Solution
1.  **Update `DocumentUploadStep`**:
    *   Tambahkan input pencarian pengguna (Autocomplete) untuk menambahkan penanda tangan.
    *   Tampilkan daftar penanda tangan yang telah dipilih.
    *   Tambahkan checkbox "Saya juga akan menandatangani dokumen ini".
2.  **Update `SignatureRequestWizard`**:
    *   Manage state `signers` di level wizard.
    *   Pass `signers` ke `AnnotateStep`.
3.  **Update `AnnotateStep`**:
    *   Gunakan daftar `signers` yang diterima dari props.
    *   Hapus fitur pencarian pengguna dari sidebar (cukup tampilkan list untuk dipilih saat anotasi).

## UX Flow
1.  **Step 1: Upload & Setup**
    *   Upload File.
    *   "Siapa yang perlu tanda tangan?" -> Search & Add User.
    *   [x] Saya juga ikut tanda tangan.
2.  **Step 2: Annotate**
    *   Sidebar kiri menampilkan list orang yang dipilih tadi.
    *   User klik nama orang -> drag signature box ke PDF.
3.  **Step 3: Confirm**
    *   Review & Send.

## Note
Mode "Self-Sign" (Tanda Tangan Sendiri) tetap ada sebagai shortcut jika hanya ingin tanda tangan sendiri tanpa orang lain. Flow di atas berlaku utama untuk mode "Minta Tanda Tangan".
