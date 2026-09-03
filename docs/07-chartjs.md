# Step 7: Chart.js - 6 Charts

**File:** `src/steps/Charts.tsx`

## What you're building

The same dataset shown 6 ways: bar, line, pie, doughnut, radar, and polar area.

## The big idea: wrapping a non-React library

Chart.js is a popular charting library, but it's **imperative** - it draws onto an HTML `<canvas>`
and manages that canvas itself. React is **declarative** - you describe UI and React updates the DOM.
These two styles clash.

`react-chartjs-2` is the bridge. It's a thin wrapper that hands the canvas lifecycle to Chart.js
while letting you write normal React:

```tsx
<Bar data={data} options={options} />
```

This pattern - a React wrapper around an imperative library - shows up constantly (maps, editors,
video players). Interviewers like to see you understand *why* the wrapper exists.

## The registration gotcha

Chart.js v4 is **tree-shakeable**: to keep bundles small, it ships nothing by default. You must
register the pieces each chart needs, or the chart renders blank:

```tsx
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, /* ... */)
```

If a chart is mysteriously empty, a missing registration is the usual cause. (Bar/Line need scales +
their elements; Pie/Doughnut/PolarArea need `ArcElement`; Radar needs `RadialLinearScale`.)

## Data shape

Every chart takes the same shape:

```tsx
const data = {
  labels: ['Jan', 'Feb', 'Mar'],           // x-axis / slice labels
  datasets: [{ label: 'Sales', data: [12, 19, 8], backgroundColor: '...' }],
}
```

`labels` line up with each number in `data`. `datasets` is an array because a chart can show multiple
series at once.

## Responsiveness

```tsx
options = { responsive: true, maintainAspectRatio: false }
```

With `maintainAspectRatio: false`, the chart fills its parent - so we give each chart box a fixed
height in CSS (`.chart { height: 200px }`). Otherwise charts can grow infinitely or collapse.

## Try it yourself

1. Add a second dataset to the bar chart (two bars per month).
2. Turn the legend on: `plugins: { legend: { display: true } }`.
3. Add a 7th chart type (e.g. a stacked bar).

## Interview questions

- **Why do you need a wrapper like react-chartjs-2?** Chart.js is imperative/canvas-based; the wrapper
  reconciles its lifecycle with React's declarative rendering.
- **Why is my chart blank?** Likely a missing `ChartJS.register(...)` for a scale or element.
- **How do you keep charts performant?** Keep `data`/`options` referentially stable (memoize) so the
  chart doesn't rebuild on every render.
