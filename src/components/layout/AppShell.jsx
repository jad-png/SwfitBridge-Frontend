import { GitCompareArrows, History, LayoutDashboard, Shield, Users } from 'lucide-react'
import { Outlet, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../app/routes/paths'
import { useTheme } from '../../app/providers/useTheme'
import { useAuth } from '../../features/auth/context/useAuth'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import PageContainer from './PageContainer'

const NAVIGATION = [
  { label: 'Overview', to: ROUTES.DASHBOARD, icon: LayoutDashboard, nonAdminOnly: true },
  { label: 'Convert XML', to: ROUTES.CONVERT, icon: GitCompareArrows },
  { label: 'History', to: ROUTES.HISTORY, icon: History, nonAdminOnly: true },
  { label: 'Admin Dashboard', to: ROUTES.ADMIN, icon: Shield, adminOnly: true },
  { label: 'User Management', to: ROUTES.ADMIN_USERS, icon: Users, adminOnly: true },
]

function createInitialsFromUser(user) {
  const source = user?.username || user?.email || 'User'
  const parts = String(source)
    .split(/[@._\s-]+/)
    .filter(Boolean)

  if (parts.length === 0) {
    return 'U'
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
}

function AppShell() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const isDark = theme === 'swiftbridge-dark'
  const drawerId = 'swiftbridge-drawer'
  const navigate = useNavigate()

  function handlePrimaryAction() {
    navigate(ROUTES.CONVERT)
  }

  function handleProfile() {
    navigate(ROUTES.PROFILE)
  }

  function handleLogout() {
    logout()
    navigate(ROUTES.LOGIN, { replace: true })
  }

  const navbarUser = {
    name: user?.username ?? user?.email ?? 'User',
    email: user?.email ?? 'No email available',
    initials: createInitialsFromUser(user),
  }

  return (
    <div className="drawer min-h-screen bg-base-200 lg:drawer-open">
      <input id={drawerId} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex min-h-screen flex-col">
        <Navbar
          drawerId={drawerId}
          isDark={isDark}
          toggleTheme={toggleTheme}
          user={navbarUser}
          onPrimaryAction={handlePrimaryAction}
          onProfile={handleProfile}
          onLogout={handleLogout}
        />
        <PageContainer>
          <Outlet />
        </PageContainer>
      </div>

      <div className="drawer-side z-40 border-r border-base-200">
        <label htmlFor={drawerId} aria-label="close sidebar" className="drawer-overlay" />
        <Sidebar navigation={NAVIGATION} theme={theme} isDark={isDark} userRole={user?.role ?? user?.roles?.[0]} />
      </div>
    </div>
  )
}

export default AppShell
