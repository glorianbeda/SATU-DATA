# Enhance Document Signing Feature

## Summary

Revisi fitur Dokumen OMK untuk meningkatkan user experience dan fungsionalitas, meliputi:

1. Redesign halaman "Minta Tanda Tangan" agar lebih premium dan tidak polos
2. Implementasi tools panel drag & drop untuk menambah annotations (signature, date, text)
3. Perbaikan validasi dokumen dengan upload file (bukan input checksum manual) dan embed QR code pada dokumen yang telah ditanda tangani

## Problem Statement

### Current Issues

1. **Halaman Minta Tanda Tangan terlalu minimalis**
   - Tampilan sederhana dengan hanya upload button dan file name
   - Tidak ada visual feedback atau progress indication yang menarik
   - Kurang panduan step-by-step untuk user

2. **Tools Panel belum implementasi lengkap**
   - Saat ini hanya ada satu draggable box "Sign Here"
   - Belum ada panel tools di sisi kanan PDF viewer
   - Tidak bisa menambahkan elemen lain seperti tanggal dan teks

3. **Validasi dokumen tidak user-friendly**
   - User harus input checksum secara manual
   - Tidak jelas bagaimana user mendapatkan checksum dari dokumen yang ditanda tangani
   - Tidak ada mekanisme embed checksum/QR ke dalam dokumen final

## Proposed Solution

### 1. Redesign "Minta Tanda Tangan" Page

- Step-by-step wizard dengan progress indicator (Upload → Place Annotations → Select Signer → Submit)
- Drag-and-drop upload area dengan animasi dan preview
- Card-based layout dengan visual yang lebih premium
- Thumbnail preview dokumen sebelum lanjut ke step berikutnya

### 2. Tools Panel (Right Sidebar)

Saat PDF terbuka, tampilkan panel di sisi kanan dengan tools:

- **Signature Box** - Kotak untuk tanda tangan (sudah ada, perlu dipindah ke panel)
- **Date Field** - Insert tanggal otomatis (format: DD MMM YYYY)
- **Text Field** - Insert teks bebas
- **Initial/Paraf** - Kotak kecil untuk paraf

Setiap elemen dapat di-drag ke posisi yang diinginkan di PDF.

### 3. Validasi Dokumen Berbasis Upload

- User upload file PDF untuk validasi (bukan input checksum)
- Backend menghitung checksum dari file yang diupload
- Bandingkan dengan database
- Tampilkan hasil valid/invalid beserta detail dokumen

### 4. Embed QR Code pada Dokumen Final

Ketika dokumen selesai ditanda tangani:

- Generate QR code berisi link validasi (e.g., `https://domain/validate?id=XXXX`)
- Embed QR code ke PDF di posisi tertentu (footer atau corner)
- QR code memungkinkan siapa saja untuk memvalidasi keaslian dokumen

## Affected Components

### Frontend

- `frontend/src/features/omk-docs/components/DocumentUpload.jsx` - Redesign
- `frontend/src/features/omk-docs/components/SignaturePlacer.jsx` - Add tools panel
- `frontend/src/features/omk-docs/components/ValidateDocument.jsx` - File upload validation

### Backend

- `backend/routers/api/documents/POST__validate-upload/` - New endpoint
- `backend/routers/api/documents/POST__sign/` - Embed QR on completion
- Add pdf-lib or similar for PDF manipulation

## Success Criteria

1. Halaman Minta Tanda Tangan terlihat premium dengan wizard steps
2. Tools panel muncul di sisi kanan saat PDF terbuka
3. User bisa drag & drop signature, date, dan text ke PDF
4. User bisa upload file untuk validasi (tanpa input manual checksum)
5. Dokumen yang selesai ditanda tangani memiliki QR code untuk validasi
