import { RefreshCw, UploadCloud } from 'lucide-react'
import ActionBar from '../../../components/ui/ActionBar'
import CardSurface from '../../../components/ui/CardSurface'
import FormField from '../../../components/ui/FormField'
import SectionLabel from '../../../components/ui/SectionLabel'

function UploadCard({
  presetOptions,
  channelOptions,
  selectedFile,
  onFileSelect,
  onGenerate,
  onReset,
  isProcessing,
  errorMessage,
}) {
  function handleFileChange(event) {
    const file = event.target.files?.[0]
    onFileSelect?.(file ?? null)
  }

  return (
    <CardSurface className="lg:col-span-2" padded={false}>
      <div className="space-y-6 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <UploadCloud className="h-5 w-5" aria-hidden />
          </div>
          <SectionLabel title="Upload XML" subtitle="Files are sent to /api/convert" />
        </div>

        <div className="space-y-3 rounded-3xl border border-dashed border-base-300 bg-base-200/60 p-6 text-center transition hover:border-primary/40 hover:bg-primary/5">
          <input
            type="file"
            className="file-input file-input-bordered w-full max-w-md"
            accept=".xml"
            aria-label="Upload XML file"
            onChange={handleFileChange}
          />
          <p className="muted-text">Drag & drop or browse SWIFT XML files (max 10MB).</p>
          {selectedFile ? (
            <p className="text-sm">
              Selected <span className="font-semibold">{selectedFile.name}</span> · {Math.round(selectedFile.size / 1024)} KB
            </p>
          ) : (
            <p className="text-sm text-base-content/60">Awaiting file selection.</p>
          )}
          {errorMessage ? (
            <p className="text-sm text-error">{errorMessage}</p>
          ) : null}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField label="Profile" hint="Select conversion template">
            <select className="select select-bordered" aria-label="Conversion profile" disabled={presetOptions.length === 0}>
              {presetOptions.length === 0 ? <option>No profiles from API</option> : null}
              {presetOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Notification channel" hint="Route completion alerts">
            <select className="select select-bordered" aria-label="Notification channel" disabled={channelOptions.length === 0}>
              {channelOptions.length === 0 ? <option>No channels from API</option> : null}
              {channelOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </FormField>
        </div>
      </div>

      <ActionBar sticky position="top-20" className="rounded-b-[1.5rem] border-t border-base-200/60 bg-base-100/95">
        <button
          type="button"
          className={`btn btn-primary ${isProcessing ? 'loading' : ''}`}
          onClick={onGenerate}
          aria-label="Generate MT103 preview"
          disabled={isProcessing || !selectedFile}
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          {isProcessing ? 'Processing' : 'Generate MT103 preview'}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onReset}
          aria-label="Reset conversion form"
          disabled={isProcessing}
        >
          Reset form
        </button>
      </ActionBar>
    </CardSurface>
  )
}

export default UploadCard
