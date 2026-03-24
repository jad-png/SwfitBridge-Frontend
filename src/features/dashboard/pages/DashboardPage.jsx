import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ChartPlaceholder from '../../../components/ui/ChartPlaceholder'
import SectionHeader from '../../../components/ui/SectionHeader'
import MetricGrid from '../components/MetricGrid'
import RecentConversionsTable from '../components/RecentConversionsTable'
import OperationalQueue from '../components/OperationalQueue'
import AlertsPanel from '../components/AlertsPanel'
import useDashboardData from '../hooks/useDashboardData'

function DashboardPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    metrics,
    rows,
    queue,
    alerts,
    cta,
    isLoading,
    error,
  } = useDashboardData()
  const [isPermissionDismissed, setIsPermissionDismissed] = useState(false)
  const showPermissionDenied = Boolean(location.state?.permissionDenied) && !isPermissionDismissed
  const CTAIcon = cta.icon

  useEffect(() => {
    if (!location.state?.permissionDenied) {
      return
    }

    navigate(location.pathname, { replace: true, state: {} })
  }, [location.pathname, location.state, navigate])

  return (
    <section className="page-stack">
      {showPermissionDenied ? (
        <div className="alert alert-error">
          <span className="font-semibold">Permission Denied</span>
          <span className="text-sm">You do not have access to this admin-only section.</span>
          <button type="button" className="btn btn-ghost btn-xs" onClick={() => setIsPermissionDismissed(true)}>
            Dismiss
          </button>
        </div>
      ) : null}

      <SectionHeader
        title="Mission control"
        description="Monitor MT103 orchestration health with real-time insights across conversion, validation, and delivery layers."
        actions={
          <>
            <button type="button" className="btn btn-ghost" aria-label="View reports">
              View reports
            </button>
            <button type="button" className="btn btn-primary" aria-label={cta.label}>
              <CTAIcon className="h-4 w-4" aria-hidden />
              {cta.label}
            </button>
          </>
        }
      />

      {error ? (
        <div className="alert alert-error">
          <span className="font-semibold">Unable to load dashboard data</span>
          <span className="text-sm">{error}</span>
        </div>
      ) : null}

      <MetricGrid metrics={metrics} />

      <div className="grid gap-6 xl:grid-cols-3">
        <RecentConversionsTable rows={rows} isLoading={isLoading} />
        <ChartPlaceholder title="Throughput" description="Average MT103 generation time (ms)" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <OperationalQueue queue={queue} />
        <AlertsPanel alerts={alerts} />
      </div>
    </section>
  )
}

export default DashboardPage
