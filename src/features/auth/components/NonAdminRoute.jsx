import { Navigate, Outlet, useLocation } from 'react-router-dom'
import PageLoader from '../../../components/common/PageLoader'
import { ROUTES } from '../../../app/routes/paths'
import { useAuth } from '../context/useAuth'

function normalizeRole(role) {
  return String(role ?? '').toUpperCase().replace(/^ROLE_/, '')
}

function NonAdminRoute() {
  const location = useLocation()
  const { user, isLoading, isFetchingUser, isAuthenticated } = useAuth()

  if (isLoading || (isAuthenticated && isFetchingUser && !user)) {
    return <PageLoader />
  }

  const userRoles = Array.isArray(user?.roles)
    ? user.roles
    : user?.role
      ? [user.role]
      : []

  const isAdmin = userRoles.map(normalizeRole).includes('ADMIN')

  if (isAdmin) {
    return <Navigate to={ROUTES.ADMIN} state={{ from: location }} replace />
  }

  return <Outlet />
}

export default NonAdminRoute
