import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import CardSurface from '../../../components/ui/CardSurface'

const PIE_COLORS = ['#2563eb', '#7c3aed', '#0ea5e9', '#f59e0b', '#10b981']

function compactDay(day) {
  if (!day) {
    return '—'
  }

  return day.slice(5)
}

function AdminDashboardCharts({ roleDistribution = [], conversionVolume = [], successRateTrend = [] }) {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <CardSurface title="Role distribution" subtitle="Admins vs user roles" className="xl:col-span-1">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={roleDistribution}
                dataKey="count"
                nameKey="role"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
                label={({ role, percentage }) => `${role} ${percentage}%`}
              >
                {roleDistribution.map((entry, index) => (
                  <Cell key={entry.role} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardSurface>

      <CardSurface title="Conversion volume" subtitle="Total conversions over time" className="xl:col-span-1">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={conversionVolume}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="day" tickFormatter={compactDay} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" name="Conversions" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Bar dataKey="success" name="Successful" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardSurface>

      <CardSurface title="Success rate" subtitle="Conversion success trend" className="xl:col-span-1">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={successRateTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="day" tickFormatter={compactDay} />
              <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Line type="monotone" dataKey="successRate" name="Success rate" stroke="#7c3aed" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardSurface>
    </div>
  )
}

export default AdminDashboardCharts