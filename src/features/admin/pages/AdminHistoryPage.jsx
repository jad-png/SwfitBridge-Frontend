import { Link } from 'react-router-dom'
import { Eye, ShieldAlert, ArrowRight } from 'lucide-react'
import EmptyState from '../../../components/ui/EmptyState'
import SectionHeader from '../../../components/ui/SectionHeader'
import HistoryFilters from '../../history/components/HistoryFilters'
import useAdminHistoryData from '../hooks/useAdminHistoryData'
import { ROUTES } from '../../../app/routes/paths'

function AdminHistoryPage() {
    const { rows, isLoading, error, filters, updateFilters, pagination, goToPage } = useAdminHistoryData()
    const showEmptyState = !isLoading && rows.length === 0
    
    return (
        <section className="page-stack">
            <SectionHeader
                title="Global Conversion History"
                description="Monitor and audit all conversion activities across the platform."
            />

            {error ? (
                <div className="alert alert-error">
                    <ShieldAlert className="w-5 h-5" />
                    <div>
                        <span className="font-semibold text-error-content">Unable to load history</span>
                        <p className="text-sm opacity-90">{error}</p>
                    </div>
                </div>
            ) : null}

            <HistoryFilters filters={filters} onFiltersChange={updateFilters} isLoading={isLoading} />

            <div className="card-surface p-0 overflow-hidden border border-base-content/10">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead className="bg-base-200/50">
                            <tr className="eyebrow-text text-xs text-base-content/60 border-b border-base-content/10">
                                <th scope="col" className="py-4">Transaction ID</th>
                                <th scope="col">Reference</th>
                                <th scope="col">Type</th>
                                <th scope="col">Status</th>
                                <th scope="col">Date & Time</th>
                                <th scope="col">Duration</th>
                                <th scope="col" className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <tr key={row.id} className="hover:bg-base-200/30 transition-colors">
                                    <td className="font-mono text-xs opacity-70">{row.id}</td>
                                    <td className="max-w-[150px] truncate" title={row.reference}>{row.reference}</td>
                                    <td>
                                        <span className="badge badge-outline badge-xs">{row.messageType}</span>
                                    </td>
                                    <td>
                                        <span className={`badge badge-sm ${row.status === 'success' || row.status === 'completed' ? 'badge-success' :
                                            row.status === 'failed' ? 'badge-error' : 'badge-ghost'
                                            }`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="text-sm opacity-80 whitespace-nowrap">{row.created}</td>
                                    <td className="text-xs opacity-70">{row.duration}</td>
                                    <td className="text-right">
                                        <Link
                                            to={ROUTES.ADMIN_HISTORY_DETAIL.replace(':id', row.id)}
                                            className="btn btn-ghost btn-sm btn-square"
                                            aria-label="View details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {isLoading && rows.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="text-center py-12">
                                        <span className="loading loading-spinner loading-md text-primary"></span>
                                        <p className="mt-2 text-sm text-base-content/60">Loading global records...</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.pages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-base-content/10 bg-base-100">
                        <span className="text-xs text-base-content/50">
                            Page {pagination.page + 1} of {pagination.pages}
                        </span>
                        <div className="join">
                            <button
                                className="join-item btn btn-xs px-4"
                                disabled={!pagination.hasPrev}
                                onClick={() => goToPage(pagination.page - 1)}
                            >
                                Previous
                            </button>
                            <button
                                className="join-item btn btn-xs px-4"
                                disabled={!pagination.hasNext}
                                onClick={() => goToPage(pagination.page + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showEmptyState ? (
                <EmptyState
                    title="No history found"
                    description="We couldn't find any conversion records matching your current filters."
                    action={
                        <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            onClick={() => updateFilters({ query: '', status: 'ALL' })}
                        >
                            Clear filters
                        </button>
                    }
                />
            ) : null}
        </section>
    )
}

export default AdminHistoryPage
