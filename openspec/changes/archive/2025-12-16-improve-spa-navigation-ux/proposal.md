# Change: Improve SPA Navigation UX

## Why

Saat ini navigasi antar halaman menampilkan **full-screen loading overlay** yang membuat React SPA terasa seperti website multi-page tradisional (MPA). Ini bertentangan dengan harapan UX SPA di mana layout (sidebar, header) tetap stabil dan hanya area konten yang berubah.

**Masalah utama:**
- `GlobalLoader` menampilkan overlay fullscreen dengan `backdrop-blur` (z-index 9999)
- `PageLoader` (Suspense fallback) juga menampilkan fullscreen loader
- Setiap navigasi terasa seperti "reload halaman" karena seluruh viewport tertutup

## What Changes

1. **Hapus full-screen overlay dari GlobalLoader** - Pertahankan hanya NProgress bar di atas
2. **Buat PageLoader lebih subtle** - Gunakan inline loader (skeleton/spinner) di area konten, bukan fullscreen
3. **Tambah content transition animation** - Fade transition halus saat konten berubah (opsional)
4. **Pertahankan instant feedback** - NProgress bar tetap muncul segera saat klik navigasi

## Impact

- **Affected specs**: `page-loading` (MODIFIED)
- **Affected code**:
  - `frontend/src/components/GlobalLoader.jsx`
  - `frontend/src/components/PageLoader.jsx`
  - `frontend/src/App.jsx` (minor)
- **Breaking changes**: Tidak ada
- **UX improvement**: Navigasi terasa instant dan modern seperti Gmail, Notion, atau dashboard profesional lainnya

## Senior Developer Recommendation

Pendekatan yang saya rekomendasikan mengikuti pola yang digunakan oleh aplikasi SPA profesional:

| App | Loading Strategy |
|-----|------------------|
| Gmail | Layout stabil, loading bar di atas, skeleton di konten |
| Notion | Sidebar stabil, fade transition konten |
| Linear | NProgress bar + subtle content fade |

**Rekomendasi final:**
1. **NProgress bar only** - Slim loading bar di atas viewport (sudah ada)
2. **Inline PageLoader** - Spinner kecil di tengah area konten, bukan fullscreen
3. **Smooth fade transition** - Animasi opacity halus saat konten berubah
4. **No backdrop blur** - Tidak ada overlay yang menghalangi UI
