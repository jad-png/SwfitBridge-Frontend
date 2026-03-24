import CardSurface from '../../../components/ui/CardSurface'

function alertToneClass(tone) {
  switch (tone) {
    case 'warning':
      return 'alert-warning'
    case 'info':
      return 'alert-info'
    default:
      return 'alert'
  }
}

function AlertsPanel({ alerts }) {
  return (
    <CardSurface title="Alerts" subtitle="Latest system notices">
      {alerts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-base-300/80 p-4 text-sm text-base-content/70">No active alerts.</p>
      ) : (
        <div className="space-y-4 text-sm">
          {alerts.map((alert) => {
            const Icon = alert.icon
            return (
              <div key={alert.id} className={`alert ${alertToneClass(alert.tone)} shadow-sm`} role="status">
                <Icon className="h-4 w-4" aria-hidden />
                <span>{alert.message}</span>
              </div>
            )
          })}
        </div>
      )}
    </CardSurface>
  )
}

export default AlertsPanel
