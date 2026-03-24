import { Navigate, Outlet, useLocation } from 'react-router-dom'
import PageLoader from '../../../components/common/PageLoader'
import { ROUTES } from '../../../app/routes/paths'
import { useAuth } from '../context/useAuth'

function PrivateRoute() {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <PageLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return <Outlet />
}

export default PrivateRoute
