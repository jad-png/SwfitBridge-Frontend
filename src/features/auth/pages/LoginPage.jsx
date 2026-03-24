import { Eye, Loader2, ShieldCheck, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../app/routes/paths'
import { useAuth } from '../context/useAuth'

function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [clientErrors, setClientErrors] = useState({})
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth()

  const redirectPath = useMemo(() => location.state?.from?.pathname ?? ROUTES.DASHBOARD, [location.state])

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectPath])

  useEffect(() => () => clearError(), [clearError])

  function validateForm() {
    const nextErrors = {}
    if (!form.username.trim()) {
      nextErrors.username = 'Username is required.'
    }
    if (!form.password.trim()) {
      nextErrors.password = 'Password is required.'
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
    if (!validateForm()) {
      return
    }

    try {
      await login({ username: form.username.trim(), password: form.password })
      navigate(redirectPath, { replace: true })
    } catch {
      /* errors handled via context */
    }
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-12">
      <div className="glass-card w-full max-w-5xl overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <p className="eyebrow-text text-xs text-base-content/60">SwiftBridge</p>
              <h1 className="mt-3 text-3xl font-semibold text-base-content">Sign in to orchestrate MT103</h1>
              <p className="text-sm text-base-content/70">UI-only authentication with validation feedback—no backend wiring.</p>
            </div>

            {error ? (
              <div className="alert alert-error">
                <ShieldCheck className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Authentication failed</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            ) : (
              <div className="alert alert-info">
                <ShieldCheck className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Secure workspace</p>
                  <p className="text-sm">Credentials are sent to the SwiftBridge API over HTTPS.</p>
                </div>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <label className="form-control">
                <div className="label">
                  <span className="label-text font-semibold">Username</span>
                  <span className="label-text-alt text-primary">Required</span>
                </div>
                <input
                  id="username"
                  type="text"
                  name="username"
                  className={`input input-bordered ${clientErrors.username ? 'input-error' : ''}`}
                  placeholder="ops-431"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                />
                <div className="label">
                  {clientErrors.username ? (
                    <span className="label-text-alt text-error">{clientErrors.username}</span>
                  ) : (
                    <span className="label-text-alt text-base-content/60">Use your assigned operator ID.</span>
                  )}
                </div>
              </label>

              <label className="form-control">
                <div className="label">
                  <span className="label-text font-semibold">Password</span>
                  <button type="button" className="btn btn-ghost btn-xs" aria-label="Reveal placeholder">
                    <Eye className="h-4 w-4" />
                    Reveal
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className={`input input-bordered ${clientErrors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <div className="label">
                  {clientErrors.password ? (
                    <span className="label-text-alt text-error">{clientErrors.password}</span>
                  ) : (
                    <span className="label-text-alt text-base-content/60">Minimum 12 characters recommended.</span>
                  )}
                </div>
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <label className="label cursor-pointer gap-2">
                  <span className="label-text">Remember me</span>
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </label>
                <button type="button" className="btn btn-link text-sm">
                  Forgot credential?
                </button>
              </div>

              <button type="submit" className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserRound className="h-4 w-4" />}
                {isLoading ? 'Signing in' : 'Sign in'}
              </button>
            </form>

            <p className="text-center text-sm text-base-content/70">
              Need workspace access? <Link className="link link-primary font-semibold" to={ROUTES.REGISTER}>Create an account</Link>
            </p>
          </div>

          <div className="relative rounded-[2rem] border border-base-200/70 bg-gradient-to-br from-primary/10 via-base-100 to-base-100 p-8 text-base-content">
            <div className="absolute inset-0 -z-10 blur-3xl" aria-hidden>
              <div className="h-full w-full bg-gradient-to-br from-primary/20 via-secondary/10 to-base-100" />
            </div>
            <h2 className="eyebrow-text text-sm text-base-content/70">Session summary</h2>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="rounded-2xl border border-base-200/70 bg-base-100/80 p-4">
                <p className="font-semibold">JWT header</p>
                <p className="font-mono text-xs text-base-content/70">{'{"alg":"HS256","typ":"JWT"}'}</p>
              </li>
              <li className="rounded-2xl border border-base-200/70 bg-base-100/80 p-4">
                <p className="font-semibold">Payload snapshot</p>
                <p className="font-mono text-xs text-base-content/70">{'{"sub":"ops-431","role":"ADMIN"}'}</p>
              </li>
              <li className="rounded-2xl border border-dashed border-base-300/80 bg-base-100/60 p-4">
                <p className="font-semibold">Signature</p>
                <p className="font-mono text-xs text-base-content/60">bUlo...p7zK</p>
              </li>
            </ul>
            <div className="mt-6 rounded-2xl bg-base-100/80 p-4 text-sm">
              <p className="font-semibold text-base-content">Request preview</p>
              <p className="mt-2 font-mono text-xs text-base-content/70">POST /auth/login — skipped (UI only)</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
