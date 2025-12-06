# Improve Signature Flow

## Summary

Revisi flow minta tanda tangan dengan menambahkan pilihan mode di awal dan menggabungkan step Anotasi + Assign Signer menjadi satu langkah yang lebih intuitif.

## Problem Statement

### Current Flow (4 Steps)
1. Upload → 2. Annotate → 3. Assign Signer → 4. Confirm

Masalah:
- Tidak ada pilihan untuk tanda tangan sendiri (self-sign)
- Step Annotate dan Assign terpisah, padahal logikanya terkait
- User harus mengingat posisi anotasi mana untuk siapa

### Proposed Flow (3-4 Steps)

**Option A: Tanda Tangan Sendiri**
1. Pilih Mode → 2. Upload → 3. Annotate (untuk diri sendiri) → 4. Confirm & Sign

**Option B: Minta Tanda Tangan Orang Lain**
1. Pilih Mode → 2. Upload → 3. Select Person + Place Annotation → 4. Confirm

## Proposed Changes

### 1. Mode Selection Screen (New)

Di awal wizard, tampilkan 2 pilihan:
- **Tanda Tangan Sendiri** - Saya akan menandatangani dokumen ini
- **Minta Tanda Tangan** - Minta orang lain untuk menandatangani

### 2. Combined Annotate + Assign Step

Untuk mode "Minta Tanda Tangan":
- Panel kiri: Daftar user yang bisa dipilih
- Panel tengah: PDF viewer
- Panel kanan: Tools (Signature, Date, Text, Initial)

Flow:
1. User klik nama orang di panel kiri (orang terpilih di-highlight)
2. User klik tool (e.g., Signature)
3. User klik pada PDF → Anotasi muncul dengan badge nama orang tersebut
4. Bisa tambah anotasi untuk orang yang sama atau ganti ke orang lain
5. Setiap anotasi menampilkan siapa yang harus menandatangani

### 3. Self-Sign Mode

Untuk mode "Tanda Tangan Sendiri":
- Tidak perlu pilih orang (otomatis current user)
- Setelah konfirmasi, langsung ditandatangani
- Embed QR code setelah selesai

## UX Benefits

1. **Lebih intuitif** - "Pilih orang → Taruh tanda tangan" lebih natural
2. **Visual feedback** - Setiap anotasi menampilkan nama penanda tangan
3. **Lebih cepat** - 3 step untuk self-sign, 4 step untuk request
4. **Fleksibilitas** - Bisa campur beberapa penanda tangan dalam satu dokumen

## Affected Components

- `SignatureRequestWizard.jsx` - Add mode selection, restructure steps
- `AnnotateStep.jsx` - Merge with signer selection
- `AssignSignerStep.jsx` - Remove (merged into AnnotateStep)
- Backend endpoints - No changes needed
