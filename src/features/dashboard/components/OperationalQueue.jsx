import CardSurface from '../../../components/ui/CardSurface'
import StatusBadge from '../../../components/ui/StatusBadge'

function OperationalQueue({ queue }) {
  return (
    <CardSurface title="Operational queue" subtitle="Escalations pending review" className="lg:col-span-2">
      {queue.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-base-300/80 p-4 text-sm text-base-content/70">No operational queue items at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {queue.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-4 rounded-2xl border border-base-200/80 p-4 transition hover:border-primary/40 hover:bg-primary/5"
            >
              <div className="flex flex-col">
                <span className="font-medium text-base-content">{item.label}</span>
                <span className="text-sm text-base-content/70">{item.owner} • {item.eta}</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <StatusBadge status={item.status ?? 'pending'} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </CardSurface>
  )
}

export default OperationalQueue
