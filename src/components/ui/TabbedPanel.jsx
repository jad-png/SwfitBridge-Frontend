import { useState } from 'react'

function TabbedPanel({ tabs, defaultTab, renderControls }) {
  const firstTab = defaultTab ?? tabs?.[0]?.id
  const [activeTab, setActiveTab] = useState(firstTab)

  const current = tabs?.find((tab) => tab.id === activeTab) ?? tabs?.[0]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="tabs tabs-boxed">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              className={`tab ${tab.id === activeTab ? 'tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={tab.id === activeTab}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {renderControls ? renderControls({ activeTab, setActiveTab }) : null}
      </div>
      <div className="rounded-3xl border border-base-300/70 bg-base-100">
        {current?.content}
      </div>
    </div>
  )
}

export default TabbedPanel
