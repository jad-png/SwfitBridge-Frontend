function CardSurface({ as: Component = 'section', title, subtitle, actions, children, className = '', padded = true, stretch = false }) {
  return (
    <Component className={`glass-card ${stretch ? 'h-full' : ''} ${className}`}>
      <div className={`card-body ${padded ? '' : 'p-0'} gap-5`}>
        {(title || subtitle || actions) ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              {title ? <p className="eyebrow-text text-sm text-base-content/60">{title}</p> : null}
              {subtitle ? <p className="text-sm text-base-content/70">{subtitle}</p> : null}
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>
        ) : null}
        {children}
      </div>
    </Component>
  )
}

export default CardSurface
