import { Activity, CheckCircle2, History } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SectionHeader from '../../../components/ui/SectionHeader'
import StatCard from '../../../components/ui/StatCard'
import StatusBadge from '../../../components/ui/StatusBadge'
import useUserOverviewData from '../hooks/useUserOverviewData'

function formatDate(value) {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return date.toLocaleString()
}

function UserOverviewPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { data, isLoading, error } = useUserOverviewData()
  const [isPermissionDismissed, setIsPermissionDismissed] = useState(false)
  const showPermissionDenied = Boolean(location.state?.permissionDenied) && !isPermissionDismissed

  useEffect(() => {
    if (!location.state?.permissionDenied) {
      return
    }

    navigate(location.pathname, { replace: true, state: {} })
  }, [location.pathname, location.state, navigate])

  const metrics = [
    {
      title: 'My conversions',
      value: String(data?.totalConversions ?? 0),
      trend: 'Personal conversion count',
      icon: History,
      tone: 'primary',
    },
    {
      title: 'Successful',
      value: String(data?.successfulConversions ?? 0),
      trend: 'Completed without errors',
      icon: CheckCircle2,
      tone: 'success',
    },
    {
      title: 'Success rate',
      value: `${data?.successRate ?? 0}%`,
      trend: 'Your recent conversion quality',
      icon: Activity,
      tone: 'info',
    },
  ]

  return (
    <section className="page-stack">
      {showPermissionDenied ? (
        <div className="alert alert-error">
          <span className="font-semibold">Permission Denied</span>
          <span className="text-sm">You do not have access to that admin section.</span>
          <button type="button" className="btn btn-ghost btn-xs" onClick={() => setIsPermissionDismissed(true)}>
            Dismiss
          </button>
        </div>
      ) : null}

      <SectionHeader
        title="User Overview"
        description="A focused view of your personal conversion activity and outcomes."
      />

      {error ? (
        <div className="alert alert-error">
          <span className="font-semibold">Unable to load overview</span>
          <span className="text-sm">{error}</span>
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <StatCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="glass-card">
        <div className="card-body gap-4">
          <p className="eyebrow-text text-xs text-base-content/60">Recent personal activity</p>
          {isLoading ? (
            <span className="loading loading-dots loading-md text-primary" aria-label="Loading user activity" />
          ) : (
            <ul className="space-y-3">
              {(data?.recentActivity ?? []).map((item) => (
                <li key={item.id} className="flex items-center justify-between rounded-2xl border border-base-200/80 p-4">
                  <div>
                    <p className="font-mono text-sm text-base-content/80">{item.id}</p>
                    <p className="text-xs text-base-content/60">{formatDate(item.createdAt)}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </li>
              ))}
              {!isLoading && (data?.recentActivity ?? []).length === 0 ? (
                <li className="rounded-2xl border border-dashed border-base-300/70 p-4 text-sm text-base-content/60">
                  No personal activity found yet.
                </li>
              ) : null}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

export default UserOverviewPage
