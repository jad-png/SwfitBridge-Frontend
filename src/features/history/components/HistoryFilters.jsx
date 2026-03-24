import { Calendar, Filter, Search } from 'lucide-react'
import CardSurface from '../../../components/ui/CardSurface'
import FormField from '../../../components/ui/FormField'

const STATUS_OPTIONS = [
  { label: 'Any', value: 'ALL' },
  { label: 'Success', value: 'SUCCESS' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Failed', value: 'FAILED' },
]

function HistoryFilters({ filters, onFiltersChange, isLoading }) {
  function handleQueryChange(event) {
    onFiltersChange({ query: event.target.value })
  }

  function handleStatusChange(event) {
    onFiltersChange({ status: event.target.value })
  }

  return (
    <CardSurface>
      <div className="grid gap-4 lg:grid-cols-4">
        <FormField label="Search" className="lg:col-span-2">
          <label className="input input-bordered flex items-center gap-2" aria-label="Search history">
            <Search className="h-4 w-4 text-base-content/50" aria-hidden />
            <input
              type="text"
              className="grow"
              placeholder="Search transaction or reference"
              value={filters.query}
              onChange={handleQueryChange}
              disabled={isLoading}
            />
          </label>
        </FormField>

        <FormField label="Status">
          <select
            className="select select-bordered"
            aria-label="Filter by status"
            value={filters.status}
            onChange={handleStatusChange}
            disabled={isLoading}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Date">
          <label className="input input-bordered flex items-center gap-2" aria-label="Filter by date">
            <Calendar className="h-4 w-4 text-base-content/50" aria-hidden />
            <input type="date" className="grow" />
          </label>
        </FormField>
      </div>

      <div className="rounded-2xl border border-dashed border-base-300/80 p-4 text-sm text-base-content/70">
        <Filter className="mr-2 inline h-4 w-4" aria-hidden /> Filters drive live API requests to /api/history.
      </div>
    </CardSurface>
  )
}

export default HistoryFilters
