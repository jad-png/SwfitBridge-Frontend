import { Suspense, lazy, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, UserCheck, Users } from 'lucide-react'
import { ROUTES } from '../../../app/routes/paths'
import CardSurface from '../../../components/ui/CardSurface'
import SectionHeader from '../../../components/ui/SectionHeader'
import StatCard from '../../../components/ui/StatCard'
import useAdminDashboardData from '../hooks/useAdminDashboardData'

const AdminDashboardCharts = lazy(() => import('../components/AdminDashboardCharts'))

function AdminDashboard() {
  const navigate = useNavigate()
  const { data, isLoading, error, isForbidden } = useAdminDashboardData()

  useEffect(() => {
    if (!isForbidden) {
      return
    }

    navigate(ROUTES.DASHBOARD, { replace: true, state: { permissionDenied: true } })
  }, [isForbidden, navigate])

  const metrics = [
    {
      title: 'Total users',
      value: String(data?.metrics?.totalUsers ?? 0),
      trend: 'Global registered users',
      icon: Users,
      tone: 'primary',
    },
    {
      title: 'Total conversions',
      value: String(data?.metrics?.totalConversions ?? 0),
      trend: 'All conversion requests',
      icon: User,
      tone: 'info',
    },
    {
      title: 'Successful conversions',
      value: String(data?.metrics?.totalSuccessfulConversions ?? 0),
      trend: `${data?.metrics?.conversionSuccessRate ?? 0}% success rate`,
      icon: UserCheck,
      tone: 'success',
    },
    {
      title: 'Guests / visitors',
      value: String(data?.metrics?.totalGuests ?? 0),
      trend: 'Anonymous or guest-level users',
      icon: User,
      tone: 'warning',
    },
  ]

  return (
    <section className="page-stack">
      <SectionHeader
        title="Admin Dashboard"
        description="Global analytics for users, conversion performance, and platform-level trends."
      />

      {error ? (
        <div className="alert alert-error">
          <span className="font-semibold">Unable to load admin analytics</span>
          <span className="text-sm">{error}</span>
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <StatCard key={metric.title} {...metric} />
        ))}
      </div>

      <Suspense
        fallback={(
          <CardSurface title="Analytics" subtitle="Loading visualizations...">
            <span className="loading loading-dots loading-md text-primary" aria-label="Loading charts" />
          </CardSurface>
        )}
      >
        <AdminDashboardCharts
          roleDistribution={data?.roleDistribution ?? []}
          conversionVolume={data?.conversionVolume ?? []}
          successRateTrend={data?.successRateTrend ?? []}
        />
      </Suspense>

      <CardSurface title="Conversion quality monitor" subtitle="Daily success-rate and trend overview">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr className="eyebrow-text text-xs text-base-content/50">
                <th scope="col">Day</th>
                <th scope="col">Total conversions</th>
                <th scope="col">Success rate</th>
              </tr>
            </thead>
            <tbody>
              {(data?.successRateTrend ?? []).slice(-10).map((row) => (
                <tr key={row.day}>
                  <td>{row.day}</td>
                  <td>{row.total}</td>
                  <td>{row.successRate}%</td>
                </tr>
              ))}
              {(data?.successRateTrend ?? []).length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center text-base-content/60">
                    {isLoading ? 'Loading trend data...' : 'No trend data available.'}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </CardSurface>
    </section>
  )
}

export default AdminDashboard
