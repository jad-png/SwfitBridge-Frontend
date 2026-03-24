import CardSurface from '../../../components/ui/CardSurface'
import CopyButton from '../../../components/ui/CopyButton'
import StatusBadge from '../../../components/ui/StatusBadge'

function RecentConversionsTable({ rows, isLoading }) {
  return (
    <CardSurface
      title="Recent conversions"
      subtitle="Latest XML → MT103 jobs"
      actions={<button type="button" className="btn btn-sm btn-outline" aria-label="Export CSV">Export CSV</button>}
      className="xl:col-span-2"
    >
      <div className="overflow-hidden rounded-3xl border border-base-200/80">
        <table className="table table-zebra">
          <thead>
            <tr className="eyebrow-text text-xs text-base-content/50">
              <th scope="col">Job ID</th>
              <th scope="col">Counterparty</th>
              <th scope="col">Amount</th>
              <th scope="col">Status</th>
              <th scope="col">Elapsed</th>
              <th scope="col" className="sr-only">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="text-sm transition hover:bg-base-200/60">
                <td className="font-mono text-base-content/80">{row.id}</td>
                <td className="font-medium text-base-content">{row.counterparty}</td>
                <td className="text-base-content/80">{row.amount}</td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td className="text-base-content/70">{row.time}</td>
                <td className="text-right">
                  <CopyButton text={row.id} label={`Copy ${row.id}`} size="xs" />
                </td>
              </tr>
            ))}
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-base-content/70">Loading recent conversions...</td>
              </tr>
            ) : null}
            {!isLoading && rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-base-content/70">No recent conversions available.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </CardSurface>
  )
}

export default RecentConversionsTable
