# Panduan Penggunaan ApexCharts

## 📊 Komponen Chart yang Tersedia

Semua komponen chart menggunakan **ApexCharts** - library charting modern dengan dukungan dark mode otomatis.

### 1. LineChart (Grafik Garis)
Cocok untuk menampilkan tren data dari waktu ke waktu.

```jsx
import { LineChart } from '../components/charts';

<LineChart
  categories={['Jan', 'Feb', 'Mar', 'Apr', 'Mei']}
  series={[
    {
      name: 'Pendapatan',
      data: [12000, 19000, 15000, 25000, 22000],
      color: '#2563eb',
    }
  ]}
  title="Pendapatan Bulanan"
  height="100%"
/>
```

### 2. BarChart (Grafik Batang)
Cocok untuk perbandingan data antar kategori.

```jsx
import { BarChart } from '../components/charts';

<BarChart
  categories={['Q1', 'Q2', 'Q3', 'Q4']}
  series={[
    {
      name: 'Penjualan',
      data: [65, 59, 80, 81],
      color: '#10b981',
    }
  ]}
  title="Penjualan Kuartalan"
  height="100%"
/>
```

### 3. PieChart (Grafik Lingkaran)
Cocok untuk menampilkan proporsi/persentase.

```jsx
import { PieChart } from '../components/charts';

<PieChart
  labels={['Langsung', 'Organik', 'Referral', 'Sosial']}
  series={[300, 250, 100, 150]}
  colors={['#2563eb', '#10b981', '#f59e0b', '#ef4444']}
  title="Sumber Traffic"
  height="100%"
/>
```

### 4. DoughnutChart (Grafik Donat)
Mirip dengan PieChart tapi dengan lubang di tengah dan menampilkan total di tengah.

```jsx
import { DoughnutChart } from '../components/charts';

<DoughnutChart
  labels={['Produk A', 'Produk B', 'Produk C']}
  series={[450, 320, 280]}
  colors={['#3b82f6', '#06b6d4', '#14b8a6']}
  title="Distribusi Produk"
  donutSize="65%"
  height="100%"
/>
```

### 5. AreaChart (Grafik Area)
Cocok untuk menampilkan volume dari waktu ke waktu dengan gradient fills.

```jsx
import { AreaChart } from '../components/charts';

<AreaChart
  categories={['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4']}
  series={[
    {
      name: 'Pengguna Aktif',
      data: [4000, 4500, 4200, 5100],
      color: '#8b5cf6',
    }
  ]}
  title="Pertumbuhan Pengguna"
  height="100%"
/>
```

## 🎨 Dark Mode Toggle

Toggle dark mode sudah diimplementasikan di Header dengan:
- ☀️ Icon matahari untuk light mode
- 🌙 Icon bulan untuk dark mode
- Animasi smooth saat toggle
- Icons berada di dalam toggle switch

**ApexCharts otomatis** menyesuaikan dengan dark mode melalui theme context!

## 💡 Tips Penggunaan

### 1. Selalu Bungkus Chart dengan Container yang Punya Height

```jsx
<div className="h-80">
  <LineChart {...props} height="100%" />
</div>
```

### 2. Struktur Data ApexCharts

**Untuk Line, Bar, dan Area Charts:**
```jsx
const categories = ['Jan', 'Feb', 'Mar'];
const series = [
  {
    name: 'Series 1',
    data: [30, 40, 35],
    color: '#2563eb', // opsional
  }
];
```

**Untuk Pie dan Doughnut Charts:**
```jsx
const labels = ['Item 1', 'Item 2', 'Item 3'];
const series = [300, 250, 100];
const colors = ['#2563eb', '#10b981', '#f59e0b']; // opsional
```

### 3. Import Chart yang Dibutuhkan

```jsx
// Import satu chart
import { LineChart } from '../components/charts';

// Import beberapa chart sekaligus
import { LineChart, BarChart, PieChart } from '../components/charts';
```

### 4. Gunakan Warna yang Konsisten

```jsx
const colors = {
  biru: '#2563eb',
  hijau: '#10b981',
  kuning: '#f59e0b',
  merah: '#ef4444',
  ungu: '#8b5cf6',
};
```

### 5. Contoh Card dengan Chart

Lihat file berikut untuk contoh implementasi:
- `TrafficSourcesCard.jsx` - Contoh PieChart
- `WeeklySalesCard.jsx` - Contoh BarChart
- `SummaryCard.jsx` - Contoh AreaChart mini dengan sparkline

## 📁 Struktur File

```
src/
├── components/
│   └── charts/
│       ├── LineChart.jsx
│       ├── BarChart.jsx
│       ├── PieChart.jsx
│       ├── DoughnutChart.jsx
│       ├── AreaChart.jsx
│       └── index.js
```

## 🔧 Props Umum

### LineChart & AreaChart

| Prop | Tipe | Default | Keterangan |
|------|------|---------|------------|
| `categories` | Array | `[]` | Label untuk sumbu x |
| `series` | Array | `[]` | Array of {name, data, color} |
| `title` | String | `''` | Judul chart |
| `showLegend` | Boolean | `true` | Tampilkan legenda |
| `showGrid` | Boolean | `true` | Tampilkan grid |
| `curve` | String | `'smooth'` | 'smooth', 'straight', 'stepline' |
| `height` | String | `'100%'` | Tinggi chart |

### BarChart

| Prop | Tipe | Default | Keterangan |
|------|------|---------|------------|
| `categories` | Array | `[]` | Label untuk sumbu x |
| `series` | Array | `[]` | Array of {name, data, color} |
| `title` | String | `''` | Judul chart |
| `horizontal` | Boolean | `false` | Bar horizontal |
| `stacked` | Boolean | `false` | Stack bars |
| `height` | String | `'100%'` | Tinggi chart |

### PieChart & DoughnutChart

| Prop | Tipe | Default | Keterangan |
|------|------|---------|------------|
| `labels` | Array | `[]` | Label untuk setiap slice |
| `series` | Array | `[]` | Array nilai data |
| `colors` | Array | `[]` | Array warna (opsional) |
| `title` | String | `''` | Judul chart |
| `legendPosition` | String | `'bottom'` | 'top', 'bottom', 'left', 'right' |
| `height` | String | `'100%'` | Tinggi chart |

**DoughnutChart tambahan:**
- `donutSize` - String (default: '65%') - Ukuran lubang tengah

## 🚀 Cara Membuat Chart Baru

1. Buat file component baru (misal: `MyChart.jsx`)
2. Import chart yang dibutuhkan dari `../components/charts`
3. Siapkan data dalam format ApexCharts
4. Render chart dengan props yang sesuai

Contoh lengkap ada di `ChartExamples.jsx`

## 🎯 Keunggulan ApexCharts

✅ **Animasi smooth** - Chart ter-animate dengan halus
✅ **Dark mode built-in** - Otomatis mengikuti theme
✅ **Responsive** - Otomatis adjust ke ukuran container
✅ **Interactive** - Hover, zoom, tooltip yang bagus
✅ **Modern design** - Tampilan yang lebih modern
✅ **Lightweight** - Performa yang baik

## ✅ Yang Sudah Selesai

- ✅ 5 jenis chart (Line, Bar, Pie, Doughnut, Area)
- ✅ Dark mode support otomatis via ApexCharts theme
- ✅ Toggle switch dengan icon matahari/bulan
- ✅ Semua komponen dashboard sudah support dark mode
- ✅ Contoh implementasi di dashboard
- ✅ Dokumentasi lengkap

Default mode: **Light Mode** ☀️

## 📝 Perbedaan dengan Chart.js

| Fitur | Chart.js | ApexCharts |
|-------|----------|------------|
| Dark Mode | Manual config | Built-in theme |
| Animasi | Sederhana | Lebih smooth |
| Interaktivitas | Basic | Lebih advanced |
| Bundle Size | Lebih kecil | Sedikit lebih besar |
| Learning Curve | Mudah | Mudah |

**ApexCharts lebih cocok untuk dashboard modern!** 🚀
