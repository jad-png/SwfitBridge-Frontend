import EmptyState from '../../../components/ui/EmptyState'
import SectionHeader from '../../../components/ui/SectionHeader'
import HistoryFilters from '../components/HistoryFilters'
import HistoryTable from '../components/HistoryTable'
import useHistoryData from '../hooks/useHistoryData'

function HistoryPage() {
  const { rows, isLoading, error, filters, updateFilters, pagination, goToPage } = useHistoryData()
  const showEmptyState = !isLoading && rows.length === 0

  return (
    <section className="page-stack">
      <SectionHeader
        title="Conversion history"
        description="Audit previously generated MT103 files, inspect status badges, and simulate pagination interactions."
        actions={<button type="button" className="btn btn-outline" aria-label="Export audit log">Export log</button>}
      />

      {error ? (
        <div className="alert alert-error">
          <span className="font-semibold">Unable to load history</span>
          <span className="text-sm">{error}</span>
        </div>
      ) : null}

      <HistoryFilters filters={filters} onFiltersChange={updateFilters} isLoading={isLoading} />

      <HistoryTable rows={rows} isLoading={isLoading} pagination={pagination} onPageChange={goToPage} />

      {showEmptyState ? (
        <EmptyState
          title="No history to display"
          description="Adjust filters or try a different search keyword to find conversion jobs."
          action={
            <button type="button" className="btn btn-outline" aria-label="Clear filters" onClick={() => updateFilters({ query: '', status: 'ALL' })}>
              Reset filters
            </button>
          }
        />
      ) : null}
    </section>
  )
}

export default HistoryPage
