import SectionLabel from '../../../components/ui/SectionLabel'

function ComparisonList({ title, items }) {
  return (
    <div className="rounded-2xl border border-base-300/70 p-4">
      <SectionLabel title={title} size="xs" />
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-base-content/60">No mapped fields available yet.</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.label} className="flex justify-between">
              <span>{item.label}</span>
              <span className="font-mono text-base-content/70">{item.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ComparisonSection({ fieldMap, mt103Tags }) {
  return (
    <div className="glass-card">
      <div className="card-body gap-4">
        <details open className="rounded-2xl border border-base-300/70 bg-base-100/60 p-4">
          <summary className="cursor-pointer">
            <SectionLabel title="Before / after comparison" subtitle="Collapsible reference" />
          </summary>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <ComparisonList title="XML field map" items={fieldMap} />
            <ComparisonList title="MT103 tags" items={mt103Tags} />
          </div>
        </details>
      </div>
    </div>
  )
}

export default ComparisonSection
