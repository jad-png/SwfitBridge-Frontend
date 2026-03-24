function StatCard({ icon: Icon, title, value, trend, trendLabel, tone = 'primary' }) {
  const toneStyles = {
    primary: 'text-primary bg-primary/10 border-primary/20 shadow-[0_10px_25px_-15px_rgba(37,99,235,0.8)]',
    success: 'text-success bg-success/10 border-success/20 shadow-[0_10px_25px_-15px_rgba(34,197,94,0.7)]',
    warning: 'text-warning bg-warning/10 border-warning/20 shadow-[0_10px_25px_-15px_rgba(245,158,11,0.7)]',
    info: 'text-info bg-info/10 border-info/20 shadow-[0_10px_25px_-15px_rgba(14,165,233,0.7)]',
  }

  const badgeClass = toneStyles[tone] ?? toneStyles.primary
  const trendClass = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info',
  }[tone] ?? 'text-primary'

  return (
    <div className="glass-card h-full">
      <div className="card-body gap-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow-text text-[0.7rem] text-base-content/60">{title}</p>
            <p className="mt-2 text-4xl font-semibold leading-tight text-base-content">{value}</p>
          </div>
          {Icon ? (
            <span className={`rounded-3xl border px-4 py-4 transition-all ${badgeClass}`}>
              <Icon className="h-6 w-6" strokeWidth={1.6} />
            </span>
          ) : null}
        </div>

        {trend ? (
          <p className={`text-sm font-medium ${trendClass}`}>
            {trend}
            {trendLabel ? <span className="ml-1 text-base-content/60 font-normal">{trendLabel}</span> : null}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default StatCard
