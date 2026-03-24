import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../app/routes/paths'
import CardSurface from '../../../components/ui/CardSurface'
import FormField from '../../../components/ui/FormField'
import SectionHeader from '../../../components/ui/SectionHeader'
import { deleteUser, getAllUsers, toggleUserStatus, updateUser } from '../../../services/api/userService'

function normalizeRole(role) {
  return String(role ?? '').toUpperCase().replace(/^ROLE_/, '')
}

function toStatusValue(user) {
  if (typeof user?.status === 'string') {
    return user.status
  }

  if (typeof user?.active === 'boolean') {
    return user.active ? 'ACTIVE' : 'BANNED'
  }

  if (typeof user?.enabled === 'boolean') {
    return user.enabled ? 'ACTIVE' : 'BANNED'
  }

  return 'ACTIVE'
}

function getUserId(user) {
  return user?.id ?? user?.userId ?? null
}

function UserManagementPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState({ email: '', role: 'ROLE_USER' })

  const adminCount = useMemo(() => users.filter((user) => normalizeRole(user.role) === 'ADMIN').length, [users])
  const regularCount = Math.max(users.length - adminCount, 0)
  const adminPercent = users.length ? Math.round((adminCount / users.length) * 100) : 0

  const handleForbidden = useCallback(() => {
    navigate(ROUTES.DASHBOARD, { replace: true, state: { permissionDenied: true } })
  }, [navigate])

  const loadUsers = useCallback(async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await getAllUsers()
      const list = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : []

      const normalizedUsers = list.map((user) => ({
        ...user,
        id: getUserId(user),
        userId: user?.userId ?? getUserId(user),
      }))

      setUsers(normalizedUsers)
    } catch (reason) {
      if (reason?.response?.status === 403) {
        handleForbidden()
        return
      }

      setErrorMessage(reason?.response?.data?.message ?? reason?.message ?? 'Unable to load users.')
    } finally {
      setIsLoading(false)
    }
  }, [handleForbidden])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  function openEditModal(user) {
    setEditingUser(user)
    setForm({
      email: user?.email ?? '',
      role: user?.role ?? 'ROLE_USER',
    })
  }

  function closeEditModal() {
    setEditingUser(null)
    setForm({ email: '', role: 'ROLE_USER' })
  }

  function handleFormChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSaveUser(event) {
    event.preventDefault()
    const targetUserId = getUserId(editingUser)
    if (!targetUserId) {
      return
    }

    setIsSubmitting(true)

    try {
      await updateUser(targetUserId, {
        email: form.email.trim(),
        role: form.role,
      })
      await loadUsers()
      closeEditModal()
    } catch (reason) {
      if (reason?.response?.status === 403) {
        handleForbidden()
        return
      }

      setErrorMessage(reason?.response?.data?.message ?? reason?.message ?? 'Unable to update user.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeleteUser(user) {
    const targetUserId = getUserId(user)
    if (!targetUserId) {
      return
    }

    const shouldDelete = window.confirm(`Are you sure you want to delete ${user.username || user.email}?`)
    if (!shouldDelete) {
      return
    }

    setIsSubmitting(true)

    try {
      await deleteUser(targetUserId)
      await loadUsers()
    } catch (reason) {
      if (reason?.response?.status === 403) {
        handleForbidden()
        return
      }

      setErrorMessage(reason?.response?.data?.message ?? reason?.message ?? 'Unable to delete user.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleToggleStatus(user) {
    const targetUserId = getUserId(user)
    if (!targetUserId) {
      return
    }

    const currentStatus = toStatusValue(user)
    const nextStatus = currentStatus === 'BANNED' ? 'ACTIVE' : 'BANNED'

    setIsSubmitting(true)

    try {
      await toggleUserStatus(targetUserId, nextStatus)
      await loadUsers()
    } catch (reason) {
      if (reason?.response?.status === 403) {
        handleForbidden()
        return
      }

      setErrorMessage(reason?.response?.data?.message ?? reason?.message ?? 'Unable to update user status.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-stack">
      <SectionHeader
        title="User Management"
        description="Admin-only user administration with role and account status controls."
      />

      {errorMessage ? (
        <div className="alert alert-error">
          <span className="font-semibold">Operation failed</span>
          <span className="text-sm">{errorMessage}</span>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <CardSurface className="lg:col-span-2" title="Users" subtitle="Current tenant users">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr className="eyebrow-text text-xs text-base-content/50">
                  <th scope="col">ID</th>
                  <th scope="col">Username</th>
                  <th scope="col">Email</th>
                  <th scope="col">Role</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const status = toStatusValue(user)
                  const userId = String(getUserId(user) ?? user?.email ?? user?.username ?? 'unknown-user')
                  return (
                    <tr key={userId}>
                      <td className="font-mono text-xs">{getUserId(user) ?? '—'}</td>
                      <td>{user.username ?? '—'}</td>
                      <td>{user.email ?? '—'}</td>
                      <td>
                        <span className="badge badge-outline">{user.role ?? 'ROLE_USER'}</span>
                      </td>
                      <td>
                        <span className={`badge ${status === 'BANNED' ? 'badge-error' : 'badge-success'}`}>
                          {status}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="btn btn-xs btn-outline"
                            onClick={() => openEditModal(user)}
                            disabled={isSubmitting}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={`btn btn-xs ${status === 'BANNED' ? 'btn-success' : 'btn-warning'}`}
                            onClick={() => handleToggleStatus(user)}
                            disabled={isSubmitting}
                          >
                            {status === 'BANNED' ? 'Unban' : 'Ban'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-xs btn-error"
                            onClick={() => handleDeleteUser(user)}
                            disabled={isSubmitting}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {!isLoading && users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-base-content/60">No users found.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {isLoading ? <span className="loading loading-dots loading-md text-primary" aria-label="Loading users" /> : null}
        </CardSurface>

        <CardSurface title="Role Distribution" subtitle="Admins vs Users">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-base-content/70">Admin users</p>
              <p className="text-2xl font-semibold">{adminCount}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70">Regular users</p>
              <p className="text-2xl font-semibold">{regularCount}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70">Admin ratio</p>
              <progress className="progress progress-primary w-full" value={adminPercent} max="100" />
              <p className="mt-1 text-xs text-base-content/60">{adminPercent}% admins</p>
            </div>
          </div>
        </CardSurface>
      </div>

      {editingUser ? (
        <dialog className="modal modal-open" aria-modal="true" role="dialog">
          <div className="modal-box">
            <h3 className="text-lg font-semibold">Edit user</h3>
            <p className="text-sm text-base-content/70">Update email or role for {editingUser.username ?? editingUser.email}.</p>

            <form className="mt-4 grid gap-4" onSubmit={handleSaveUser}>
              <FormField label="Email">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleFormChange}
                  className="input input-bordered"
                  required
                />
              </FormField>

              <FormField label="Role">
                <select name="role" value={form.role} onChange={handleFormChange} className="select select-bordered">
                  <option value="ROLE_USER">ROLE_USER</option>
                  <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                </select>
              </FormField>

              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={closeEditModal} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </dialog>
      ) : null}
    </section>
  )
}

export default UserManagementPage
