const STATUS_VARIANTS = {
  success: 'bg-success/15 text-success border-success/20',
  failed: 'bg-error/15 text-error border-error/20',
  pending: 'bg-warning/15 text-warning border-warning/20',
  processing: 'bg-info/15 text-info border-info/20',
  scheduled: 'bg-accent/15 text-accent border-accent/20',
}

function StatusBadge({ status }) {
  const key = status?.toLowerCase?.() ?? 'pending'
  const badgeClass = STATUS_VARIANTS[key] ?? 'bg-neutral/15 text-neutral border-neutral/20'
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending'

  return (
    <span className={`inline-flex items-center gap-1 rounded-2xl border px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wide ${badgeClass}`}>
      <span className="h-2 w-2 rounded-full bg-current" />
      {label}
    </span>
  )
}

export default StatusBadge
