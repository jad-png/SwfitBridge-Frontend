import { Suspense, lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import PageLoader from '../../components/common/PageLoader'
import AppShell from '../../components/layout/AppShell'
import NonAdminRoute from '../../features/auth/components/NonAdminRoute'
import PrivateRoute from '../../features/auth/components/PrivateRoute'
import RoleBasedRoute from '../../features/auth/components/RoleBasedRoute'
import { ROLE, ROUTES } from '../routes/paths'

const LoginPage = lazy(() => import('../../features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('../../features/auth/pages/RegisterPage'))
const GuestHomePage = lazy(() => import('../../features/misc/pages/GuestHomePage'))
const SwiftDocumentationPage = lazy(() => import('../../features/misc/pages/SwiftDocumentationPage'))
const UserOverviewPage = lazy(() => import('../../features/dashboard/pages/UserOverviewPage'))
const ConvertPage = lazy(() => import('../../features/converter/pages/ConvertPage'))
const HistoryPage = lazy(() => import('../../features/history/pages/HistoryPage'))
const HistoryDetailPage = lazy(() => import('../../features/history/pages/HistoryDetailPage'))
const AdminDashboard = lazy(() => import('../../features/admin/pages/AdminDashboard'))
const UserManagementPage = lazy(() => import('../../features/admin/pages/UserManagementPage'))
const AdminHistoryPage = lazy(() => import('../../features/admin/pages/AdminHistoryPage'))
const AdminConversionDetailPage = lazy(() => import('../../features/admin/pages/AdminConversionDetailPage'))
const ProfilePage = lazy(() => import('../../features/profile/pages/ProfilePage'))
const NotFoundPage = lazy(() => import('../../features/misc/pages/NotFoundPage'))

function withSuspense(node) {
  return <Suspense fallback={<PageLoader />}>{node}</Suspense>
}

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: withSuspense(<GuestHomePage />),
  },
  {
    path: ROUTES.LOGIN,
    element: withSuspense(<LoginPage />),
  },
  {
    path: ROUTES.DOCS,
    element: withSuspense(<SwiftDocumentationPage />),
  },
  {
    path: ROUTES.REGISTER,
    element: withSuspense(<RegisterPage />),
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          {
            element: <NonAdminRoute />,
            children: [
              {
                path: ROUTES.DASHBOARD,
                element: withSuspense(<UserOverviewPage />),
              },
            ],
          },
          {
            path: ROUTES.CONVERT,
            element: withSuspense(<ConvertPage />),
          },
          {
            path: ROUTES.HISTORY,
            element: withSuspense(<HistoryPage />),
          },
          {
            path: ROUTES.HISTORY_DETAIL,
            element: withSuspense(<HistoryDetailPage />),
          },
          {
            path: ROUTES.PROFILE,
            element: withSuspense(<ProfilePage />),
          },
          {
            element: <RoleBasedRoute allowedRoles={[ROLE.ADMIN]} />,
            children: [
              {
                path: ROUTES.ADMIN,
                element: withSuspense(<AdminDashboard />),
              },
              {
                path: ROUTES.ADMIN_USERS,
                element: withSuspense(<UserManagementPage />),
              },
              {
                path: ROUTES.ADMIN_HISTORY,
                element: withSuspense(<AdminHistoryPage />),
              },
              {
                path: ROUTES.ADMIN_HISTORY_DETAIL,
                element: withSuspense(<AdminConversionDetailPage />),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: withSuspense(<NotFoundPage />),
  },
])

function AppRouter() {
  return <RouterProvider router={router} />
}

export default AppRouter
