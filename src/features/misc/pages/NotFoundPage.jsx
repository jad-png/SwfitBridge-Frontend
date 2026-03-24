import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../app/routes/paths'
import useNotFoundMeta from '../hooks/useNotFoundMeta'

function NotFoundPage() {
  const { title, description, cta } = useNotFoundMeta()

  return (
    <section className="grid min-h-screen place-items-center bg-base-200 px-4 py-16">
      <div className="glass-card max-w-lg p-10 text-center">
        <div className="mx-auto mb-6 w-16 rounded-2xl bg-primary/10 p-4 text-primary">
          <Compass className="h-8 w-8" aria-hidden />
        </div>
        <p className="eyebrow-text text-sm text-base-content/50">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-base-content">{title}</h1>
        <p className="mt-2 text-base-content/70">{description}</p>
        <Link className="btn btn-primary mt-8" to={ROUTES.DASHBOARD} aria-label={cta}>
          {cta}
        </Link>
      </div>
    </section>
  )
}

export default NotFoundPage
