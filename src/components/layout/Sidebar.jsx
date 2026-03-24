import { NavLink } from 'react-router-dom'

function normalizeRole(role) {
  return String(role ?? '').toUpperCase().replace(/^ROLE_/, '')
}

function Sidebar({ navigation, theme, isDark, userRole }) {
  const isAdmin = normalizeRole(userRole) === 'ADMIN'

  const visibleNavigation = navigation.filter((item) => {
    if (item.adminOnly && !isAdmin) {
      return false
    }

    if (item.nonAdminOnly && isAdmin) {
      return false
    }

    return true
  })

  return (
    <aside className="flex w-80 flex-col gap-8 bg-base-100 px-4 py-6">
      <div className="rounded-3xl border border-base-200 bg-base-100 p-4 shadow-soft">
        <p className="eyebrow-text text-xs text-base-content/60">Environment</p>
        <p className="text-base font-semibold text-base-content">{theme}</p>
        <div className="mt-4 flex items-center justify-between text-sm text-base-content/70">
          <span>Theme</span>
          <span className="badge badge-outline">{isDark ? 'Midnight' : 'Daylight'}</span>
        </div>
      </div>

      <nav className="menu gap-2 text-sm font-medium" aria-label="Primary navigation">
        {visibleNavigation.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-2xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? 'bg-primary/15 text-primary shadow-inner ring-1 ring-primary/30'
                  : 'text-base-content/60 hover:bg-base-200 hover:text-base-content hover:ring-1 hover:ring-base-300'
              }`
            }
          >
            <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-dashed border-base-300/70 bg-base-200/60 p-4">
        <p className="text-sm font-semibold text-base-content">Health checks</p>
        <p className="muted-text mt-1">MT103 pipeline nominal</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <span className="badge badge-success badge-outline">API</span>
          <span className="badge badge-success badge-outline">Parser</span>
          <span className="badge badge-info badge-outline">Queue</span>
          <span className="badge badge-warning badge-outline">SLA 94%</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
