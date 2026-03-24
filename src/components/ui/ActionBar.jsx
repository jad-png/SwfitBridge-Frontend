function ActionBar({ children, sticky = false, position = 'top-0', className = '' }) {
  const stickyClass = sticky ? `sticky z-20 ${position} bg-base-100/90 backdrop-blur border-b border-base-200/80` : ''

  return (
    <div className={`flex flex-wrap items-center gap-3 p-3 ${stickyClass} ${className}`}>
      {children}
    </div>
  )
}

export default ActionBar
