import { Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import CardSurface from '../../../components/ui/CardSurface'
import SectionLabel from '../../../components/ui/SectionLabel'
import Skeleton from '../../../components/ui/Skeleton'
import StatusBadge from '../../../components/ui/StatusBadge'
import { ROUTES } from '../../../app/routes/paths'

function HistoryTable({ rows, isLoading, pagination, onPageChange }) {
  const pageCount = Math.max(pagination.pages, 1)
  const currentPage = pagination.page + 1

  function handlePrev() {
    if (pagination.hasPrev) {
      onPageChange(pagination.page - 1)
    }
  }

  function handleNext() {
    if (pagination.hasNext) {
      onPageChange(pagination.page + 1)
    }
  }

  return (
    <CardSurface>
      <div className="overflow-x-auto rounded-3xl border border-base-200/80" role="region" aria-live="polite">
        <table className="table table-zebra">
          <thead>
            <tr className="eyebrow-text text-xs text-base-content/50">
              <th scope="col">Job ID</th>
              <th scope="col">Reference</th>
              <th scope="col">Message type</th>
              <th scope="col">Status</th>
              <th scope="col">Created</th>
              <th scope="col">Duration</th>
              <th scope="col" className="text-right">Preview</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-base-200/60">
                <td className="font-mono text-base-content/80">{row.id}</td>
                <td className="font-medium text-base-content">{row.reference}</td>
                <td>
                  <span className="badge badge-outline">{row.messageType}</span>
                </td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td>{row.created}</td>
                <td>{row.duration}</td>
                <td className="text-right">
                  <Link
                    to={ROUTES.HISTORY_DETAIL.replace(':id', row.id)}
                    className="btn btn-ghost btn-xs btn-square"
                    aria-label={`Preview ${row.id}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))}
            {isLoading ? (
              <tr className="bg-base-100/80">
                <td colSpan={7} className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <SectionLabel title="Loading" size="xs" />
                    <Skeleton className="h-2 w-24" />
                    <Skeleton className="h-2 w-32" />
                    <Skeleton className="h-2 w-16" />
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
        <p className="text-base-content/70">
          Showing {rows.length} of {pagination.total} jobs · Page {currentPage}/{pageCount}
        </p>
        <div className="join">
          <button
            type="button"
            className="btn btn-outline join-item"
            aria-label="Previous page"
            onClick={handlePrev}
            disabled={!pagination.hasPrev}
          >
            Prev
          </button>
          <button type="button" className="btn btn-primary join-item" aria-current="page">
            {currentPage}
          </button>
          <button
            type="button"
            className="btn btn-outline join-item"
            aria-label="Next page"
            onClick={handleNext}
            disabled={!pagination.hasNext}
          >
            Next
          </button>
        </div>
      </div>
    </CardSurface>
  )
}

export default HistoryTable
