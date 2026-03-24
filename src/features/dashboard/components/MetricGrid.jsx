import StatCard from '../../../components/ui/StatCard'

function MetricGrid({ metrics }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <StatCard key={metric.title} {...metric} />
      ))}
    </div>
  )
}

export default MetricGrid
