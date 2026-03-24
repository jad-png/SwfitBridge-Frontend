import CopyButton from '../../../components/ui/CopyButton'
import SectionLabel from '../../../components/ui/SectionLabel'
import TabbedPanel from '../../../components/ui/TabbedPanel'

function CodeBlock({ content }) {
  const value = content?.trim() ? content : 'No data loaded yet.'

  return (
    <div className="mockup-code text-sm">
      {value.split('\n').map((line, index) => (
        <pre key={`${line}-${index}`}>
          <code>{line}</code>
        </pre>
      ))}
    </div>
  )
}

function PreviewTabs({ xml, mt103 }) {
  const tabs = [
    { id: 'xml', label: 'Uploaded XML', content: <CodeBlock content={xml} /> },
    { id: 'mt103', label: 'Generated MT103', content: <CodeBlock content={mt103} /> },
  ]

  return (
    <div className="glass-card">
      <div className="card-body gap-6">
        <SectionLabel title="Preview" subtitle="Switch between XML input and MT103 output" />
        <TabbedPanel
          tabs={tabs}
          renderControls={({ activeTab }) => {
            const activeValue = activeTab === 'xml' ? xml : mt103
            return <CopyButton text={activeValue} label="Copy preview" />
          }}
        />
      </div>
    </div>
  )
}

export default PreviewTabs
