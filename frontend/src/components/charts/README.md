# Chart Components

Reusable Chart.js components with dark mode support and Material UI theme integration.

## Available Charts

- **LineChart** - Line charts with optional fill
- **BarChart** - Vertical and horizontal bar charts
- **PieChart** - Pie charts with percentage tooltips
- **DoughnutChart** - Doughnut charts with customizable cutout
- **AreaChart** - Area charts with gradient fills

## Installation

All required dependencies are already installed:
- `chart.js` - Core charting library
- `react-chartjs-2` - React wrapper for Chart.js

## Usage

### Import Charts

```jsx
import { LineChart, BarChart, PieChart, DoughnutChart, AreaChart } from '../components/charts';
```

### LineChart Example

```jsx
<LineChart
  labels={['Jan', 'Feb', 'Mar', 'Apr', 'May']}
  datasets={[
    {
      label: 'Revenue',
      data: [12000, 19000, 15000, 25000, 22000],
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
    }
  ]}
  title="Monthly Revenue"
  showLegend={true}
  showGrid={true}
  fill={false}
  tension={0.4}
/>
```

### BarChart Example

```jsx
<BarChart
  labels={['Q1', 'Q2', 'Q3', 'Q4']}
  datasets={[
    {
      label: 'Sales',
      data: [65, 59, 80, 81],
      backgroundColor: '#10b981',
    }
  ]}
  title="Quarterly Sales"
  horizontal={false}
/>
```

### PieChart Example

```jsx
<PieChart
  labels={['Direct', 'Organic', 'Referral', 'Social']}
  data={[300, 250, 100, 150]}
  backgroundColor={['#2563eb', '#10b981', '#f59e0b', '#ef4444']}
  title="Traffic Sources"
  legendPosition="right"
/>
```

### DoughnutChart Example

```jsx
<DoughnutChart
  labels={['Product A', 'Product B', 'Product C']}
  data={[450, 320, 280]}
  backgroundColor={['#3b82f6', '#06b6d4', '#14b8a6']}
  title="Product Distribution"
  cutout="60%"
/>
```

### AreaChart Example

```jsx
<AreaChart
  labels={['Week 1', 'Week 2', 'Week 3', 'Week 4']}
  datasets={[
    {
      label: 'Active Users',
      data: [4000, 4500, 4200, 5100],
      borderColor: '#8b5cf6',
    }
  ]}
  title="User Growth"
  stacked={false}
/>
```

## Common Props

All chart components support these common props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `labels` | Array | `[]` | Labels for x-axis |
| `datasets` | Array | `[]` | Array of dataset objects (LineChart, BarChart, AreaChart) |
| `data` | Array | `[]` | Array of data values (PieChart, DoughnutChart) |
| `title` | String | `''` | Chart title |
| `showLegend` | Boolean | `true` | Show/hide legend |
| `showGrid` | Boolean | `true` | Show/hide grid (not applicable to Pie/Doughnut) |
| `options` | Object | `{}` | Additional Chart.js options |

## Chart-Specific Props

### LineChart & AreaChart
- `fill` - Boolean, fill area under line (default: false for Line, true for Area)
- `tension` - Number, line curve tension (default: 0.4)

### BarChart
- `horizontal` - Boolean, horizontal orientation (default: false)

### PieChart & DoughnutChart
- `backgroundColor` - Array of colors
- `borderColor` - Array of border colors
- `legendPosition` - String, legend position (default: 'right')

### DoughnutChart
- `cutout` - String or Number, cutout size (default: '60%')

### AreaChart
- `stacked` - Boolean, stack areas (default: false)

## Dark Mode

All charts automatically adapt to dark mode using the `ThemeContext`. The charts will:
- Change text colors
- Adjust grid colors
- Update tooltip backgrounds
- Modify border colors

No additional configuration needed!

## Dataset Configuration

For LineChart, BarChart, and AreaChart, you can customize each dataset:

```jsx
{
  label: 'Dataset Name',
  data: [10, 20, 30, 40],
  borderColor: '#2563eb',        // Line/border color
  backgroundColor: '#2563eb',     // Fill/bar color
  borderWidth: 2,                 // Border width
  tension: 0.4,                   // Line curve (Line/Area only)
  pointRadius: 3,                 // Point size (Line/Area only)
  pointHoverRadius: 5,            // Point hover size (Line/Area only)
  fill: true,                     // Fill area (Line/Area only)
  borderRadius: 8,                // Bar corner radius (Bar only)
}
```

## Advanced Usage

### Custom Chart.js Options

You can pass additional Chart.js options via the `options` prop:

```jsx
<LineChart
  labels={labels}
  datasets={datasets}
  options={{
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Custom: ${context.parsed.y}`;
          }
        }
      }
    }
  }}
/>
```

### Hiding Axes

```jsx
<AreaChart
  labels={labels}
  datasets={datasets}
  showLegend={false}
  showGrid={false}
  options={{
    scales: {
      x: { display: false },
      y: { display: false }
    }
  }}
/>
```

## Examples

See `ChartExamples.jsx` for comprehensive examples of all chart types with various configurations.

## Color Palette

Recommended colors for consistency:

```js
const colors = {
  blue: '#2563eb',
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899',
  indigo: '#6366f1',
  cyan: '#06b6d4',
  teal: '#14b8a6',
};
```

## Tips

1. **Container Height**: Always wrap charts in a container with a defined height:
   ```jsx
   <div className="h-80">
     <LineChart {...props} />
   </div>
   ```

2. **Responsive**: Charts are responsive by default and will resize with their container.

3. **Performance**: For large datasets, consider reducing `pointRadius` to 0 for better performance.

4. **Gradients**: AreaChart automatically generates gradients from borderColor if backgroundColor is not provided.

5. **Tooltips**: Pie and Doughnut charts automatically show percentages in tooltips.
