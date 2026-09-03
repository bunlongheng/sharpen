import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line, Pie, Doughnut, Radar, PolarArea } from 'react-chartjs-2'
// Step 7: Chart.js - 6 simple charts
// Concept: wrapping an imperative canvas library (Chart.js) in React via react-chartjs-2.
// - Chart.js is tree-shakeable: you must register the pieces each chart type needs.
// - Each <Chart> takes `data` (labels + datasets) and `options`.
ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
)
const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const values = [12, 19, 8, 15, 22, 13]
const palette = ['#4f46e5', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#a855f7']
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
}
export default function Charts() {
  const barLine = {
    labels,
    datasets: [
      { label: 'Sales', data: values, backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
    ],
  }
  const circular = {
    labels,
    datasets: [{ label: 'Sales', data: values, backgroundColor: palette }],
  }
  const radar = {
    labels,
    datasets: [
      {
        label: 'Sales',
        data: values,
        backgroundColor: 'rgba(79,70,229,0.2)',
        borderColor: '#4f46e5',
      },
    ],
  }
  return (
    <section className="card">
      <h2>7. Chart.js - 6 charts</h2>
      <p className="muted">Bar, line, pie, doughnut, radar, polar area.</p>

      <div className="chart-grid">
        <div className="chart-box">
          <span className="chart-title">Bar</span>
          <div className="chart">
            <Bar data={barLine} options={options} />
          </div>
        </div>
        <div className="chart-box">
          <span className="chart-title">Line</span>
          <div className="chart">
            <Line data={barLine} options={options} />
          </div>
        </div>
        <div className="chart-box">
          <span className="chart-title">Pie</span>
          <div className="chart">
            <Pie data={circular} options={options} />
          </div>
        </div>
        <div className="chart-box">
          <span className="chart-title">Doughnut</span>
          <div className="chart">
            <Doughnut data={circular} options={options} />
          </div>
        </div>
        <div className="chart-box">
          <span className="chart-title">Radar</span>
          <div className="chart">
            <Radar data={radar} options={options} />
          </div>
        </div>
        <div className="chart-box">
          <span className="chart-title">Polar Area</span>
          <div className="chart">
            <PolarArea data={circular} options={options} />
          </div>
        </div>
      </div>
    </section>
  )
}
