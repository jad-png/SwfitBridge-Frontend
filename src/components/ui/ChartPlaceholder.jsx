function ChartPlaceholder({ title, description }) {
  return (
    <div className="glass-card h-full">
      <div className="card-body gap-6">
        <div>
          <p className="eyebrow-text text-xs text-base-content/50">{title}</p>
          {description ? <p className="mt-1 text-sm text-base-content/70">{description}</p> : null}
        </div>
        <div
          className="relative h-64 w-full overflow-hidden rounded-[1.75rem] border border-dashed border-base-300/70 bg-gradient-to-br from-base-200 via-base-100 to-base-100/40"
          aria-hidden
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,#94a3b840_1px,transparent_0)] bg-[length:28px_28px] opacity-60" />
          <div className="relative flex h-full w-full items-center justify-center text-sm font-medium text-base-content/50">
            Chart placeholder
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChartPlaceholder
