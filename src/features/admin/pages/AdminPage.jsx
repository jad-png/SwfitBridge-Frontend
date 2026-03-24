import { useEffect, useMemo, useState } from 'react'
import ChartPlaceholder from '../../../components/ui/ChartPlaceholder'
import SectionHeader from '../../../components/ui/SectionHeader'
import AdminStatGrid from '../components/AdminStatGrid'
import UserManagementTable from '../components/UserManagementTable'
import useAdminDashboardData from '../hooks/useAdminDashboardData'
import { getAllUsers } from '../../../services/api/userService'

function normalizeRole(role) {
  return String(role ?? 'ROLE_USER').replace(/^ROLE_/, '')
}

function normalizeStatus(user) {
  if (typeof user?.status === 'string') {
    return user.status.toLowerCase()
  }

  if (typeof user?.active === 'boolean') {
    return user.active ? 'success' : 'failed'
  }

  if (typeof user?.enabled === 'boolean') {
    return user.enabled ? 'success' : 'failed'
  }

  return 'pending'
}

function AdminPage() {
  const { data, error } = useAdminDashboardData()
  const [users, setUsers] = useState([])

  useEffect(() => {
    let isMounted = true

    async function loadUsers() {
      try {
        const response = await getAllUsers()
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : []

        if (!isMounted) {
          return
        }

        setUsers(list.map((user) => ({
          name: user?.username ?? 'Unknown user',
          email: user?.email ?? '—',
          role: normalizeRole(user?.role),
          status: normalizeStatus(user),
        })))
      } catch {
        if (isMounted) {
          setUsers([])
        }
      }
    }

    loadUsers()

    return () => {
      isMounted = false
    }
  }, [])

  const stats = useMemo(() => ([
    {
      title: 'Total users',
      value: String(data?.metrics?.totalUsers ?? 0),
      trend: 'Current registered users',
      tone: 'primary',
    },
    {
      title: 'Total conversions',
      value: String(data?.metrics?.totalConversions ?? 0),
      trend: 'All recorded conversion jobs',
      tone: 'info',
    },
    {
      title: 'Success rate',
      value: `${data?.metrics?.conversionSuccessRate ?? 0}%`,
      trend: 'Based on backend analytics',
      tone: 'success',
    },
  ]), [data?.metrics])

  return (
    <section className="page-stack">
      <SectionHeader
        title="Admin control center"
        description="Govern access, observe conversion KPIs, and simulate user lifecycle actions."
        actions={<button type="button" className="btn btn-primary" aria-label="Invite operator">Invite operator</button>}
      />

      {error ? (
        <div className="alert alert-error">
          <span className="font-semibold">Unable to load admin data</span>
          <span className="text-sm">{error}</span>
        </div>
      ) : null}

      <AdminStatGrid stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartPlaceholder title="Conversion volume" description="Daily MT103 generation per region" />
        <ChartPlaceholder title="Success rate" description="Rolling 14-day comparison" />
      </div>

      <UserManagementTable users={users} />
    </section>
  )
}

export default AdminPage
