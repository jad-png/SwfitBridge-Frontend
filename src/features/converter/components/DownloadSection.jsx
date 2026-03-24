import { Download, FileText } from 'lucide-react'
import CardSurface from '../../../components/ui/CardSurface'
import SectionLabel from '../../../components/ui/SectionLabel'
import StatusBadge from '../../../components/ui/StatusBadge'

function DownloadSection({ mt103, warnings = [], isProcessing, processingTimeMs, isReady }) {
  const hasResult = Boolean(mt103) && Boolean(isReady)

  function handleDownload(extension = 'txt') {
    if (!mt103) return

    const blob = new Blob([mt103], { type: 'text/plain;charset=utf-8' })
    const fileUrl = window.URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = fileUrl
    anchor.download = `swiftbridge-mt103.${extension}`
    anchor.click()
    window.URL.revokeObjectURL(fileUrl)
  }

  return (
    <CardSurface>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionLabel
          title="File downloads"
          subtitle={hasResult ? 'Download the latest MT103 payload' : 'Upload a file to generate MT103 output'}
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-primary"
            aria-label="Download MT103 as file"
            onClick={() => handleDownload('mt103')}
            disabled={!hasResult || isProcessing}
          >
            <Download className="h-4 w-4" aria-hidden />
            Download MT103
          </button>
          <button
            type="button"
            className="btn btn-outline"
            aria-label="Download MT103 as text"
            onClick={() => handleDownload('txt')}
            disabled={!hasResult || isProcessing}
          >
            <FileText className="h-4 w-4" aria-hidden />
            Download as TXT
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-base-300/70 p-4">
          <SectionLabel title="Status" size="xs" />
          <StatusBadge status={isProcessing ? 'processing' : hasResult ? 'success' : 'pending'} />
          {processingTimeMs ? <p className="muted-text mt-1">{processingTimeMs} ms</p> : null}
        </div>
        <div className="rounded-2xl border border-base-300/70 p-4">
          <SectionLabel title="Loading state" size="xs" />
          {isProcessing ? (
            <span className="loading loading-dots loading-sm text-primary" aria-label="Loading" />
          ) : (
            <p className="text-sm text-base-content/60">Idle</p>
          )}
        </div>
        <div className="rounded-2xl border border-base-300/70 p-4">
          <SectionLabel title="Warnings" size="xs" />
          {warnings.length === 0 ? (
            <p className="muted-text">No warnings reported.</p>
          ) : (
            <ul className="text-xs text-warning">
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </CardSurface>
  )
}

export default DownloadSection
