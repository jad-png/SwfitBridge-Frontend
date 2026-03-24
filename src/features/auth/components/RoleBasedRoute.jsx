import { Navigate, Outlet, useLocation } from 'react-router-dom'
import PageLoader from '../../../components/common/PageLoader'
import { ROUTES } from '../../../app/routes/paths'
import { useAuth } from '../context/useAuth'

function normalizeRole(role) {
  return String(role ?? '').toUpperCase().replace(/^ROLE_/, '')
}

function RoleBasedRoute({ allowedRoles = [] }) {
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

  const normalizedAllowedRoles = allowedRoles.map(normalizeRole)
  const normalizedRoles = userRoles.map(normalizeRole)

  const isAuthorized = normalizedAllowedRoles.length === 0 || normalizedRoles.some((role) => normalizedAllowedRoles.includes(role))

  if (!isAuthorized) {
    return <Navigate to={ROUTES.DASHBOARD} state={{ from: location, permissionDenied: true }} replace />
  }

  return <Outlet />
}

export default RoleBasedRoute
