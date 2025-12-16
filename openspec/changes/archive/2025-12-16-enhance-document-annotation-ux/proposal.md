# Change: Enhance Document Annotation UX

## Why

Beberapa peningkatan UX diperlukan untuk fitur anotasi dokumen:
1. **Language title** perlu disimpan ke localStorage (sudah dilakukan di i18n.js, tapi perlu diverifikasi)
2. **Auto-show signature** saat drag-drop di self-mode — jika user menandatangani dokumen sendiri, langsung tampilkan tanda tangan asli di preview
3. **Real-time preview** untuk tooltip — tanggal harus menampilkan tanggal asli (sudah), teks harus menampilkan teks yang diketik
4. **Font size control** — user bisa mengatur ukuran font anotasi dengan slider dan langsung refresh preview
5. **Thicker signature stroke** — tanda tangan yang digambar terlalu tipis, perlu penebalan

## What Changes

1. **Language storage** — Verifikasi dan pastikan title bahasa tersimpan (kemungkinan sudah berfungsi)
2. **Auto-signature preview in self-mode** — Saat user di mode "Tanda tangan sendiri" dan menempatkan signature box, langsung tampilkan gambar signature asli mereka
3. **Real-time annotation preview** — Semua annotation menampilkan nilai sebenarnya (tanggal asli, teks yang diketik) bukan placeholder
4. **Font size control** — Tambah slider di tools panel untuk mengatur font size anotasi (8-24px) dengan live refresh
5. **Signature thickness** — Ubah `minWidth` di SignatureCanvas dari default (0.5) ke 2-3px

## Impact

- **Affected specs**: `omk-docs` (MODIFIED)
- **Affected code**:
  - `frontend/src/features/profile/components/ProfileEditForm.jsx` — signature canvas thickness
  - `frontend/src/features/omk-docs/components/wizard/AnnotateStep.jsx` — font size control, auto-signature
  - `frontend/src/features/omk-docs/components/wizard/AnnotateStep.jsx` → `DraggableAnnotation` — real-time preview
  - `frontend/src/i18n.js` — verify language persistence (likely no change needed)
- **Breaking changes**: Tidak ada
