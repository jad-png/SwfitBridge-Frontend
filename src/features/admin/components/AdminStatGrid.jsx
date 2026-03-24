import StatCard from '../../../components/ui/StatCard'

function AdminStatGrid({ stats }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}

export default AdminStatGrid
