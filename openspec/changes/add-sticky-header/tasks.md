# Tasks: Add Sticky Header Navigation

## Implementation Tasks

- [x] **1. Update MainLayout structure**
  - Wrap header in a sticky container
  - Separate header from main content flow
  - Add appropriate padding to main content area
  - Ensure sidebar positioning works with sticky header

- [x] **2. Style Header container for sticky behavior**
  - Add `position: sticky` dengan `top: 0`
  - Set `z-index` tinggi (1000+)
  - Add background color solid (prevent content showing through)
  - Add bottom shadow for visual separation

- [x] **3. Handle responsive layout**
  - Ensure mobile header is also sticky
  - Test dengan sidebar collapsed dan expanded
  - Verify overlay z-index tidak conflict

- [x] **4. Support dark mode**
  - Verify background colors match dark mode
  - Test shadow visibility in dark mode

## Verification

- [ ] Scroll halaman - header tetap di atas
- [ ] Konten tidak tertutup header
- [ ] Sidebar toggle masih berfungsi
- [ ] Dark mode tampilan benar
- [ ] Mobile responsif
