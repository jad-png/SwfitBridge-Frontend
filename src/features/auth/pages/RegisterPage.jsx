import { Mail, Shield, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../app/routes/paths'
import { useAuth } from '../context/useAuth'

const PASSWORD_RULE = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/
const USERNAME_RULE = /^[A-Za-z0-9._-]{3,64}$/

function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [clientErrors, setClientErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState(null)
  const navigate = useNavigate()
  const { register: registerUser, isLoading, error, clearError } = useAuth()

  useEffect(() => () => clearError(), [clearError])

  function validateForm() {
    const nextErrors = {}

    if (!USERNAME_RULE.test(form.username.trim())) {
      nextErrors.username = '3-64 chars; letters, digits, dot, underscore, or dash.'
    }

    if (!form.email.trim() || !form.email.includes('@')) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!PASSWORD_RULE.test(form.password)) {
      nextErrors.password = 'Min 8 chars with uppercase, digit, and symbol.'
    }

    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Passwords must match.'
    }

    setClientErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setClientErrors((prev) => ({ ...prev, [name]: undefined }))
    if (error) {
      clearError()
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSuccessMessage(null)
    if (!validateForm()) {
      return
    }

    try {
      const response = await registerUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      })

      setSuccessMessage(response?.message ?? 'User registered successfully.')
      setForm({ username: '', email: '', password: '', confirmPassword: '' })
      setTimeout(() => {
        navigate(ROUTES.LOGIN, { replace: true })
      }, 1500)
    } catch {
      /* handled by context */
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-12">
      <div className="glass-card w-full max-w-5xl overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <p className="eyebrow-text text-xs text-primary">Provision access</p>
              <h1 className="mt-3 text-3xl font-semibold text-base-content">Create your SwiftBridge identity</h1>
              <p className="text-sm text-base-content/70">Accounts are persisted via the /api/auth/register endpoint.</p>
            </div>

            {successMessage ? (
              <div className="alert alert-success">
                <Shield className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Registration complete</p>
                  <p className="text-sm">{successMessage} Redirecting to sign-in…</p>
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="alert alert-error">
                <Shield className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Request failed</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            ) : null}

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <label className="form-control">
                <div className="label">
                  <span className="label-text font-semibold">Username</span>
                </div>
                <input
                  className={`input input-bordered ${clientErrors.username ? 'input-error' : ''}`}
                  placeholder="ops-431"
                  name="username"
                  autoComplete="username"
                  value={form.username}
                  onChange={handleChange}
                />
                {clientErrors.username ? (
                  <div className="label">
                    <span className="label-text-alt text-error">{clientErrors.username}</span>
                  </div>
                ) : null}
              </label>

              <label className="form-control">
                <div className="label">
                  <span className="label-text font-semibold">Email</span>
                </div>
                <input
                  type="email"
                  className={`input input-bordered ${clientErrors.email ? 'input-error' : ''}`}
                  placeholder="avery@swiftbridge.io"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                />
                {clientErrors.email ? (
                  <div className="label">
                    <span className="label-text-alt text-error">{clientErrors.email}</span>
                  </div>
                ) : null}
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text font-semibold">Password</span>
                  </div>
                  <input
                    type="password"
                    className={`input input-bordered ${clientErrors.password ? 'input-error' : ''}`}
                    placeholder="••••••••"
                    name="password"
                    autoComplete="new-password"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <div className="label">
                    <span className="label-text-alt text-base-content/60">Use uppercase, digit, and symbol.</span>
                  </div>
                </label>

                <label className="form-control">
                  <div className="label">
                    <span className="label-text font-semibold">Confirm password</span>
                  </div>
                  <input
                    type="password"
                    className={`input input-bordered ${clientErrors.confirmPassword ? 'input-error' : ''}`}
                    placeholder="••••••••"
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                  {clientErrors.confirmPassword ? (
                    <div className="label">
                      <span className="label-text-alt text-error">{clientErrors.confirmPassword}</span>
                    </div>
                  ) : null}
                </label>
              </div>

              <button type="submit" className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                <UserPlus className="h-4 w-4" />
                {isLoading ? 'Registering' : 'Register workspace'}
              </button>
            </form>

            <p className="text-center text-sm text-base-content/70">
              Already registered? <Link className="link link-primary font-semibold" to={ROUTES.LOGIN}>Return to sign in</Link>
            </p>
          </div>

          <div className="relative rounded-[2rem] border border-base-200/70 bg-base-100 p-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="eyebrow-text text-sm text-base-content/60">Provisioning</p>
                <p className="text-lg font-semibold text-base-content">API-backed enrollment</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm text-base-content/80">
              <div className="rounded-2xl border border-base-200/70 p-4">
                <p className="font-semibold text-base-content">Validation checklist</p>
                <ul className="mt-3 space-y-2 text-xs">
                  <li className="flex items-center gap-2 text-success">
                    <span className="badge badge-success badge-xs" /> Username unique per tenant
                  </li>
                  <li className="flex items-center gap-2 text-success">
                    <span className="badge badge-success badge-xs" /> Email RFC 5322 compliant
                  </li>
                  <li className="flex items-center gap-2 text-success">
                    <span className="badge badge-success badge-xs" /> Password policy enforced
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-dashed border-base-300/80 p-4">
                <p className="font-semibold">Notes</p>
                <p className="text-sm text-base-content/70">Requests are issued to /api/auth/register and return a userId.</p>
              </div>

              <div className="rounded-2xl border border-base-200/70 bg-base-100 p-4">
                <p className="font-semibold">Security posture</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="badge badge-outline">MFA Suggested</span>
                  <span className="badge badge-outline">Role sync ready</span>
                  <span className="badge badge-outline">JWT via login</span>
                </div>
              </div>

              <div className="rounded-2xl border border-base-200/70 bg-base-100 p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-success" />
                  <span>Tokens issued post-login using /api/auth/login.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RegisterPage
