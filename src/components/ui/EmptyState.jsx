import { FileQuestion } from 'lucide-react'

function EmptyState({ icon: Icon = FileQuestion, title, description, action }) {
  return (
    <div className="glass-card p-10 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-200/70">
        <Icon className="h-6 w-6 text-base-content/70" />
      </div>
      <h3 className="text-xl font-semibold text-base-content">{title}</h3>
      {description ? <p className="mt-2 text-base text-base-content/70">{description}</p> : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  )
}

export default EmptyState
