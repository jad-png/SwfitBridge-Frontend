import { useEffect, useMemo, useState } from 'react'
import { ROLE } from '../../../app/routes/paths'
import FormField from '../../../components/ui/FormField'
import SectionHeader from '../../../components/ui/SectionHeader'
import CardSurface from '../../../components/ui/CardSurface'
import SectionLabel from '../../../components/ui/SectionLabel'
import { useAuth } from '../../auth/context/useAuth'

function getPrimaryRole(user) {
  if (typeof user?.role === 'string' && user.role.trim()) {
    return user.role.trim()
  }

  if (Array.isArray(user?.roles) && user.roles.length > 0) {
    return String(user.roles[0]).trim()
  }

  return ROLE.USER
}

function hasAdminRole(user) {
  const roles = Array.isArray(user?.roles)
    ? user.roles
    : typeof user?.role === 'string'
      ? [user.role]
      : []

  return roles.some((role) => String(role).toUpperCase() === ROLE.ADMIN)
}

function ProfilePage() {
  const { user, isFetchingUser, updateCurrentUserProfile } = useAuth()
  const [form, setForm] = useState({ email: '', role: ROLE.USER })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const isAdmin = useMemo(() => hasAdminRole(user), [user])
  const currentRole = useMemo(() => getPrimaryRole(user), [user])

  useEffect(() => {
    setForm({
      email: user?.email ?? '',
      role: currentRole,
    })
  }, [currentRole, user?.email])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
    setErrorMessage(null)
    setSuccessMessage(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const payload = {}
    const nextEmail = form.email.trim()

    if (nextEmail && nextEmail !== user?.email) {
      payload.email = nextEmail
    }

    if (isAdmin) {
      const nextRole = form.role.trim()
      if (nextRole && nextRole !== currentRole) {
        payload.role = nextRole
      }
    }

    if (Object.keys(payload).length === 0) {
      setSuccessMessage('No changes detected.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      await updateCurrentUserProfile(payload)
      setSuccessMessage('Profile updated successfully.')
    } catch (reason) {
      setErrorMessage(reason?.message ?? 'Unable to update profile.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-stack">
      <SectionHeader
        title="Operator profile"
        description="Manage your account data synced with the backend user profile."
      />

      <CardSurface>
        <SectionLabel title="Profile details" />

        {isFetchingUser && !user ? <p className="text-sm text-base-content/70">Loading profile...</p> : null}

        {errorMessage ? (
          <div className="alert alert-error my-4">
            <span>{errorMessage}</span>
          </div>
        ) : null}

        {successMessage ? (
          <div className="alert alert-success my-4">
            <span>{successMessage}</span>
          </div>
        ) : null}

        <form className="mt-4 grid gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
          <FormField label="Email" hint="Used for account notifications">
            <input
              type="email"
              name="email"
              className="input input-bordered"
              value={form.email}
              onChange={handleChange}
              required
            />
          </FormField>

          {isAdmin ? (
            <FormField label="Role" hint="Admin can update role">
              <select name="role" className="select select-bordered" value={form.role} onChange={handleChange}>
                <option value={ROLE.USER}>{ROLE.USER}</option>
                <option value={ROLE.ADMIN}>{ROLE.ADMIN}</option>
              </select>
            </FormField>
          ) : null}

          <div className="md:col-span-2">
            <button type="submit" className={`btn btn-primary w-full md:w-auto ${isSubmitting ? 'loading' : ''}`} disabled={isSubmitting || isFetchingUser || !user}>
              {isSubmitting ? 'Saving profile' : 'Save profile'}
            </button>
          </div>
        </form>
      </CardSurface>
    </section>
  )
}

export default ProfilePage
