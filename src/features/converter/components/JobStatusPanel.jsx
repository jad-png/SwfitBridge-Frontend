import CardSurface from '../../../components/ui/CardSurface'
import SectionLabel from '../../../components/ui/SectionLabel'
import Skeleton from '../../../components/ui/Skeleton'
import StatusBadge from '../../../components/ui/StatusBadge'

function JobStatusPanel({ historyItems, pipelineStatus }) {
  return (
    <CardSurface>
      <SectionLabel title="Job status" subtitle="Live queue" />
      {historyItems.length ? (
        <ul className="space-y-3 text-sm">
          {historyItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-3 rounded-2xl border border-base-200/80 p-3 transition hover:border-primary/30 hover:bg-primary/5"
            >
              <span className="font-mono text-base-content/80">{item.id}</span>
              <StatusBadge status={item.status} />
              <span className="ml-auto text-base-content/60">{item.created}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-base-300/80 p-3 text-sm text-base-content/65">No jobs yet. Run a conversion to add a job.</p>
      )}

      <div>
        <SectionLabel title="Pipeline" size="xs" subtitle="Status overview" />
        <progress className="progress progress-primary mt-3" value={pipelineStatus.progress} max="100" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pipelineStatus.progress} />
        <p className="muted-text mt-1">{pipelineStatus.stages.join(' • ')}</p>
        <div className="mt-3 flex gap-2">
          <Skeleton className="h-2 flex-1" />
          <Skeleton className="h-2 flex-1" />
        </div>
      </div>
    </CardSurface>
  )
}

export default JobStatusPanel
