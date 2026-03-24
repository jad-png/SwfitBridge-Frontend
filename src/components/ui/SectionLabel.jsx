function SectionLabel({ title, subtitle, tone = 'muted', size = 'sm', align = 'start' }) {
  const sizeStyles = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
  }

  const toneStyles = {
    muted: 'text-base-content/60',
    primary: 'text-primary',
    info: 'text-info',
    danger: 'text-error',
  }

  const alignStyles = {
    start: 'items-start text-left',
    center: 'items-center text-center',
  }

  return (
    <div className={`flex flex-col ${alignStyles[align] ?? alignStyles.start}`}>
      <p className={`eyebrow-text ${sizeStyles[size] ?? sizeStyles.sm} ${toneStyles[tone] ?? toneStyles.muted}`}>{title}</p>
      {subtitle ? <p className="mt-1 text-sm text-base-content/70">{subtitle}</p> : null}
    </div>
  )
}

export default SectionLabel
