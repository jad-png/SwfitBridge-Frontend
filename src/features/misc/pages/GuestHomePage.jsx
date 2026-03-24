import {
  ArrowRight,
  Clock3,
  FileCheck2,
  Github,
  GitMerge,
  LayoutDashboard,
  Moon,
  ShieldCheck,
  Sparkles,
  Sun,
} from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { ROUTES } from '../../../app/routes/paths'
import { useTheme } from '../../../app/providers/useTheme'
import CardSurface from '../../../components/ui/CardSurface'
import SectionHeader from '../../../components/ui/SectionHeader'
import { useAuth } from '../../auth/context/useAuth'

const FEATURES = [
  {
    icon: GitMerge,
    title: 'XML → MT103 conversion',
    description: 'Convert structured XML into compliant MT103 messages with a guided flow and clear output preview.',
  },
  {
    icon: Clock3,
    title: 'Fast processing loop',
    description: 'Submit conversion jobs quickly, monitor status, and move from upload to output in a streamlined path.',
  },
  {
    icon: Sparkles,
    title: 'Simple operator experience',
    description: 'A minimal UI built for daily operations, with focused controls and reduced friction across the workflow.',
  },
]

const TRACKING_STEPS = [
  { label: 'Upload accepted', tone: 'badge-info' },
  { label: 'Validation completed', tone: 'badge-success' },
  { label: 'MT103 generated', tone: 'badge-primary' },
]

const MESSAGING_PRIMER = [
  {
    title: 'About SWIFT messaging',
    description:
      'SWIFT messages are standardized financial formats used between banks to exchange payment and settlement instructions securely.',
    tags: ['Bank-to-bank', 'Standardized', 'Cross-border'],
  },
  {
    title: 'MX: the newer messaging model',
    description:
      'MX messages are based on ISO 20022 XML and provide richer, structured data for better interoperability, automation, and compliance.',
    tags: ['ISO 20022', 'XML native', 'Richer data'],
  },
  {
    title: 'MT103: the legacy payment format',
    description:
      'MT103 is the classic customer credit transfer message in the legacy MT standard, still widely used in many payment flows.',
    tags: ['Legacy MT', 'FIN format', 'Still active'],
  },
]

function GuestHomePage() {
  const { isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'swiftbridge-dark'

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return (
    <div className="min-h-screen bg-base-200">
      <header className="border-b border-base-300/70 bg-base-100/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-10">
          <Link to={ROUTES.HOME} className="flex items-center gap-3 text-base-content transition-opacity hover:opacity-90">
            <span className="rounded-2xl bg-primary/10 p-2 text-primary">
              <FileCheck2 className="h-5 w-5" />
            </span>
            <div>
              <p className="eyebrow-text text-[0.65rem] text-base-content/60">SwiftBridge</p>
              <p className="text-sm font-semibold">XML to MT103</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button type="button" className="btn btn-ghost btn-circle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link className="btn btn-ghost btn-sm" to={ROUTES.DOCS}>
              Documentation
            </Link>
            <Link className="btn btn-ghost btn-sm" to={ROUTES.LOGIN}>
              Sign in
            </Link>
            <Link className="btn btn-primary btn-sm" to={ROUTES.REGISTER}>
              Register
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:gap-10 md:px-10 md:py-12">
        <CardSurface className="overflow-hidden" stretch>
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <p className="eyebrow-text text-xs text-primary">Guest workspace</p>
              <h1 className="text-3xl font-semibold tracking-tight text-base-content md:text-5xl">
                XML to MT103 conversion tool for secure payment operations
              </h1>
              <p className="max-w-2xl text-base text-base-content/70 md:text-lg">
                SwiftBridge helps teams convert XML files into MT103 messages quickly, with a clean process and production-ready output.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link to={ROUTES.CONVERT} className="btn btn-primary">
                  Start Converting
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to={ROUTES.REGISTER} className="btn btn-outline">
                  Register
                </Link>
              </div>
            </div>

            <div className="grid gap-3">
              {TRACKING_STEPS.map((step, index) => (
                <div
                  key={step.label}
                  className="rounded-2xl border border-base-300/70 bg-base-100/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-base-content">{step.label}</p>
                    <span className={`badge ${step.tone}`}>Step {index + 1}</span>
                  </div>
                  <progress className="progress progress-primary mt-3 h-2 w-full" value={(index + 1) * 34} max="100" />
                </div>
              ))}
            </div>
          </div>
        </CardSurface>

        <section className="space-y-5">
          <SectionHeader
            title="Core features"
            description="Built for operators who need reliable conversion, fast turnaround, and a workflow that stays easy to use."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <CardSurface
                key={feature.title}
                className="transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
                title={feature.title}
                subtitle={feature.description}
                stretch
              >
                <div className="inline-flex w-fit rounded-2xl border border-primary/20 bg-primary/10 p-3 text-primary">
                  <feature.icon className="h-5 w-5" />
                </div>
              </CardSurface>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <CardSurface
            title="Open source and transparent"
            subtitle="SwiftBridge is open source, so your team can review behavior, validate assumptions, and integrate with confidence."
            className="transition-all duration-300 hover:-translate-y-0.5"
            stretch
          >
            <div className="flex items-center gap-3 text-sm text-base-content/70">
              <span className="rounded-xl border border-base-300 bg-base-100 p-2">
                <Github className="h-4 w-4" />
              </span>
              Public architecture with auditable conversion flow and API contracts.
            </div>
            <div className="mt-1 inline-flex items-center gap-2 rounded-xl border border-success/25 bg-success/10 px-3 py-2 text-sm text-success">
              <ShieldCheck className="h-4 w-4" />
              Built for trust, observability, and maintainability.
            </div>
          </CardSurface>

          <CardSurface
            title="Track every conversion"
            subtitle="Register to unlock full conversion history, status monitoring, and detailed records across your workflows."
            className="transition-all duration-300 hover:-translate-y-0.5"
            stretch
          >
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-outline">Queued</span>
              <span className="badge badge-outline">Validating</span>
              <span className="badge badge-outline">Converted</span>
              <span className="badge badge-outline">Downloaded</span>
            </div>
            <div className="mt-4">
              <Link to={ROUTES.REGISTER} className="btn btn-secondary btn-sm">
                Create account for full access
                <LayoutDashboard className="h-4 w-4" />
              </Link>
            </div>
          </CardSurface>
        </section>

        <section className="space-y-5">
          <SectionHeader
            title="Messaging context"
            description="Understand where SwiftBridge fits between modern ISO 20022 MX messaging and the legacy MT103 payment format."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {MESSAGING_PRIMER.map((item) => (
              <CardSurface key={item.title} title={item.title} subtitle={item.description} stretch className="transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="badge badge-outline">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardSurface>
            ))}
          </div>
          <CardSurface stretch>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-base-300/70 p-4">
                <p className="eyebrow-text text-[0.65rem] text-base-content/60">MX (new)</p>
                <p className="mt-2 text-sm text-base-content/80">Structured XML model with extended semantic fields and modern validation patterns.</p>
              </div>
              <div className="rounded-2xl border border-base-300/70 p-4">
                <p className="eyebrow-text text-[0.65rem] text-base-content/60">MT103 (legacy)</p>
                <p className="mt-2 text-sm text-base-content/80">Traditional SWIFT FIN message used for customer credit transfers and many existing rails.</p>
              </div>
            </div>
          </CardSurface>
        </section>

        <CardSurface className="border-primary/25 bg-gradient-to-r from-primary/10 via-base-100/90 to-secondary/10" stretch>
          <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="eyebrow-text text-xs text-base-content/60">Get started</p>
              <h2 className="mt-2 text-2xl font-semibold text-base-content">Ready to convert with full tracking and controls?</h2>
              <p className="mt-1 text-sm text-base-content/70">Register now to unlock complete conversion history and operational visibility.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to={ROUTES.REGISTER} className="btn btn-primary">
                Register now
              </Link>
              <Link to={ROUTES.LOGIN} className="btn btn-ghost">
                I already have an account
              </Link>
            </div>
          </div>
        </CardSurface>
      </main>

      <footer className="border-t border-base-300/70 bg-base-100/80">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 md:grid-cols-[1.4fr_1fr] md:px-10">
          <div>
            <p className="eyebrow-text text-[0.65rem] text-base-content/60">SwiftBridge</p>
            <p className="mt-2 text-sm text-base-content/80">
              SwiftBridge helps teams move from XML and MX-oriented data toward operational MT103 outputs with traceable, clean workflows.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <Link to={ROUTES.HOME} className="btn btn-ghost btn-sm">
              Home
            </Link>
            <Link to={ROUTES.DOCS} className="btn btn-ghost btn-sm">
              Docs
            </Link>
            <Link to={ROUTES.LOGIN} className="btn btn-ghost btn-sm">
              Sign in
            </Link>
            <Link to={ROUTES.REGISTER} className="btn btn-primary btn-sm">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default GuestHomePage