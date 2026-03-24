import { GaugeCircle, Menu, Moon, SunMedium } from 'lucide-react'

function Navbar({ drawerId, isDark, toggleTheme, onPrimaryAction, onProfile, onLogout, onSettings, user }) {
  return (
    <header className="sticky top-0 z-30 border-b border-base-200/70 bg-base-100/90 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-10">
        <div className="flex flex-1 items-center gap-3">
          <label htmlFor={drawerId} className="btn btn-ghost btn-sm lg:hidden" aria-label="Open navigation">
            <Menu className="h-4 w-4" aria-hidden />
          </label>
          <div>
            <p className="eyebrow-text text-xs text-base-content/60">SwiftBridge</p>
            <p className="text-lg font-semibold tracking-tight text-base-content">MT103 Orchestrator</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className="btn btn-ghost btn-sm gap-2" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <SunMedium className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>
          <button type="button" className="btn btn-primary btn-sm hidden md:inline-flex" onClick={onPrimaryAction} aria-label="Start new conversion">
            <GaugeCircle className="h-4 w-4" aria-hidden />
            New conversion
          </button>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="avatar placeholder border border-base-300/80 bg-base-100 shadow-sm" aria-label="User menu">
              <div className="w-11 rounded-full bg-primary/10 text-primary">
                <span className="text-sm font-semibold">{user.initials}</span>
              </div>
            </div>
            <div tabIndex={0} className="dropdown-content z-10 w-64 rounded-3xl border border-base-200 bg-base-100 p-4 shadow-xl">
              <div className="mb-4 rounded-2xl bg-base-200/70 p-3">
                <p className="text-sm font-semibold text-base-content">{user.name}</p>
                <p className="text-xs text-base-content/70">{user.email}</p>
              </div>
              <ul className="menu gap-1 text-sm">
                <li>
                  <button type="button" className="rounded-2xl" onClick={onProfile} aria-label="Open profile">
                    Profile
                  </button>
                </li>
                {typeof onSettings === 'function' ? (
                  <li>
                    <button type="button" className="rounded-2xl" onClick={onSettings} aria-label="Open settings">
                      Settings
                    </button>
                  </li>
                ) : null}
                <li>
                  <button type="button" className="rounded-2xl text-error" onClick={onLogout} aria-label="Logout">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
