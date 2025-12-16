# Design: Image Splitter Tool

## Context
Fitur ini memungkinkan user untuk membagi gambar menjadi grid sesuai jumlah row dan column yang ditentukan, dengan masing-masing sel berukuran A4 (210mm x 297mm). Gambar yang lebih besar dari area grid akan dipotong, dan user dapat menggeser crop section untuk memilih area yang diinginkan.

## Goals
- Menyediakan interface untuk upload gambar
- Menampilkan preview dengan grid overlay
- Memungkinkan pengaturan row dan column
- Setiap sel berukuran A4 default
- User dapat menggeser (pan) crop section untuk area yang lebih besar
- Export masing-masing sel sebagai file image terpisah

## Non-Goals
- Tidak ada penyimpanan server-side (semua client-side)
- Tidak ada integrasi dengan fitur dokumen lain
- Tidak ada resize otomatis gambar

## Technical Approach

### A4 Size Calculation
- A4 dimensions: 210mm x 297mm (portrait)
- Untuk tampilan layar, gunakan rasio aspek 1:√2 (≈ 1:1.414)
- Setiap sel di preview akan ditampilkan dengan rasio ini

### Component Architecture
```
ImageSplitterPage
├── ImageUploader          # Dropzone untuk upload gambar
├── SplitterPreview        # Canvas dengan gambar dan grid overlay
│   ├── Grid Overlay       # Menampilkan batas sel
│   └── Crop Handler       # Untuk drag/pan area gambar
├── Controls               # Input row, column, dan actions
│   ├── RowInput
│   ├── ColumnInput
│   └── ExportButton
└── PreviewModal           # Preview hasil split sebelum download
```

### Canvas Implementation
- Menggunakan HTML5 Canvas untuk rendering
- Grid overlay dengan stroke dashed untuk batas sel
- Draggable crop area menggunakan mouse events
- Export menggunakan `canvas.toBlob()` untuk setiap sel

### Export Strategy
- Setiap sel di-export sebagai PNG terpisah
- Nama file: `split_{row}_{col}.png`
- Resolusi output: 2480 x 3508 pixels (A4 @ 300 DPI)

## Decisions
1. **Client-side only**: Semua processing dilakukan di browser, tidak ada backend API
2. **Canvas-based**: Menggunakan HTML5 Canvas untuk manipulasi gambar
3. **A4 Portrait default**: Sel menggunakan orientasi portrait A4 sebagai default
4. **No zoom**: Untuk MVP, tidak ada fitur zoom - hanya pan/drag

## Risks / Trade-offs
- **Large images**: Gambar sangat besar bisa menyebabkan memory issues → Mitigasi: Limit max image size
- **Browser compatibility**: Canvas API sudah didukung semua browser modern

## Open Questions
- Apakah perlu dukungan untuk orientasi landscape A4 di masa depan?
- Apakah perlu tambahan ukuran kertas selain A4 (A3, Letter, dll)?
