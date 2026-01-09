# UI Layout Specification

## ADDED Requirements

### Requirement: Sticky Header Navigation
The system SHALL display the header navigation at a fixed/sticky position at the top of the viewport. The header MUST remain visible when the user scrolls.

#### Scenario: User scrolls down the page
- **Given** user berada di halaman manapun dalam aplikasi
- **When** user melakukan scroll ke bawah
- **Then** header navigation tetap visible di bagian atas viewport
- **And** header memiliki shadow untuk visual separation dari konten

#### Scenario: Content is not covered by sticky header
- **Given** header menggunakan posisi sticky/fixed
- **When** halaman di-render
- **Then** konten utama memiliki padding atas yang sesuai dengan tinggi header
- **And** tidak ada konten yang tersembunyi di balik header

#### Scenario: Header works with sidebar toggle
- **Given** user mengklik tombol hamburger/menu
- **When** sidebar muncul/berubah state
- **Then** header tetap pada posisinya
- **And** tidak ada visual glitch atau layout shift

### Requirement: Responsive Sticky Header
The system MUST ensure the sticky header works correctly on all screen sizes (mobile, tablet, desktop).

#### Scenario: Mobile view with sticky header
- **Given** user mengakses via mobile device (viewport < 768px)
- **When** user melakukan scroll
- **Then** header tetap sticky di bagian atas
- **And** header menampilkan layout mobile (hamburger menu, compact icons)

#### Scenario: Desktop view with sticky header
- **Given** user mengakses via desktop (viewport >= 1024px)
- **When** sidebar dalam state collapsed atau expanded
- **Then** header menyesuaikan posisi sesuai lebar sidebar
- **And** header tetap sticky di bagian atas

### Requirement: Dark Mode Support for Sticky Header
The system SHALL support dark mode styling for the sticky header with appropriate background and shadow colors.

#### Scenario: Header in dark mode
- **Given** user mengaktifkan dark mode
- **When** user melakukan scroll
- **Then** header memiliki background color dark yang solid
- **And** shadow terlihat dengan kontras yang sesuai
