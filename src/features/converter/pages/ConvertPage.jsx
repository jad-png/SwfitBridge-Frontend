import { useEffect, useMemo, useState } from 'react'
import SectionHeader from '../../../components/ui/SectionHeader'
import CardSurface from '../../../components/ui/CardSurface'
import ComparisonSection from '../components/ComparisonSection'
import DownloadSection from '../components/DownloadSection'
import JobStatusPanel from '../components/JobStatusPanel'
import PreviewTabs from '../components/PreviewTabs'
import UploadCard from '../components/UploadCard'
import { convertXmlToMt103 } from '../../../services/api/conversionService'
import { fetchHistory } from '../../../services/api/historyService'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

function extractXmlFieldMap(xml) {
  if (!xml?.trim()) {
    return []
  }

  try {
    const parser = new DOMParser()
    const document = parser.parseFromString(xml, 'application/xml')
    const entries = [
      ['MsgId', document.querySelector('MsgId')?.textContent?.trim()],
      ['CreDtTm', document.querySelector('CreDtTm')?.textContent?.trim()],
      ['IntrBkSttlmAmt', document.querySelector('IntrBkSttlmAmt')?.textContent?.trim()],
    ]

    return entries
      .filter(([, value]) => Boolean(value))
      .map(([label, value]) => ({ label, value }))
  } catch {
    return []
  }
}

function extractMt103Tags(mt103) {
  if (!mt103?.trim()) {
    return []
  }

  return mt103
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith(':'))
    .slice(0, 6)
    .map((line) => {
      const delimiter = line.indexOf(':', 1)
      if (delimiter <= 0) {
        return null
      }

      return {
        label: line.slice(0, delimiter + 1),
        value: line.slice(delimiter + 1).trim() || '—',
      }
    })
    .filter(Boolean)
}

function normalizeHistoryJob(item) {
  const status = String(item?.conversionStatus ?? item?.status ?? 'pending').toLowerCase()
  const createdAt = item?.requestTimestamp ?? item?.createdAt ?? item?.created

  return {
    id: item?.transactionId ?? item?.messageReference ?? item?.id ?? `job-${Date.now()}`,
    status,
    created: createdAt ? new Date(createdAt).toLocaleTimeString() : '—',
  }
}

function ConvertPage() {
  const [presetProfiles] = useState([])
  const [channelOptions] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [xmlPreview, setXmlPreview] = useState('')
  const [mt103Preview, setMt103Preview] = useState('')
  const [lastGenerated, setLastGenerated] = useState(null)
  const [conversionWarnings, setConversionWarnings] = useState([])
  const [processingTime, setProcessingTime] = useState(null)
  const [jobHistory, setJobHistory] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadRecentJobs() {
      try {
        const response = await fetchHistory({ size: 6, page: 0 })
        const rows = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : []

        if (!isMounted) {
          return
        }

        setJobHistory(rows.map(normalizeHistoryJob))
      } catch {
        if (isMounted) {
          setJobHistory([])
        }
      }
    }

    loadRecentJobs()

    return () => {
      isMounted = false
    }
  }, [])

  function handleFileSelect(file) {
    setErrorMessage(null)

    if (!file) {
      setSelectedFile(null)
      setXmlPreview('')
      return
    }

    if (!file.name.toLowerCase().endsWith('.xml')) {
      setErrorMessage('Only XML files are accepted.')
      setSelectedFile(null)
      setXmlPreview('')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('File size exceeds 10MB limit.')
      setSelectedFile(null)
      setXmlPreview('')
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = (event) => setXmlPreview(event.target?.result ?? '')
    reader.onerror = () => setXmlPreview('')
    reader.readAsText(file)
  }

  function appendJob(status, reference) {
    const job = {
      id: reference ?? `JOB-${Date.now()}`,
      status,
      created: new Date().toLocaleTimeString(),
    }
    setJobHistory((prev) => [job, ...prev].slice(0, 6))
  }

  async function handleGenerate() {
    if (!selectedFile) {
      setErrorMessage('Select an XML file before converting.')
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)
    setConversionWarnings([])

    try {
      const response = await convertXmlToMt103(selectedFile)
      setMt103Preview(response?.mt103?.trim() ?? '')
      setConversionWarnings(response?.warnings ?? [])
      setProcessingTime(response?.processingTimeMs ?? null)
      setLastGenerated(new Date())
      appendJob('success', response?.messageReference ?? response?.transactionId)

      try {
        const latest = await fetchHistory({ size: 6, page: 0 })
        const rows = Array.isArray(latest?.data) ? latest.data : []
        setJobHistory(rows.map(normalizeHistoryJob))
      } catch {
        // no-op: keep local job update
      }
    } catch (conversionError) {
      const message = conversionError?.response?.data?.message ?? conversionError.message ?? 'Conversion failed.'
      setErrorMessage(message)
      setMt103Preview('')
      setProcessingTime(null)
      appendJob('failed')
    } finally {
      setIsProcessing(false)
    }
  }

  function handleReset() {
    setSelectedFile(null)
    setXmlPreview('')
    setMt103Preview('')
    setLastGenerated(null)
    setConversionWarnings([])
    setProcessingTime(null)
    setErrorMessage(null)
  }

  const fieldMap = useMemo(() => extractXmlFieldMap(xmlPreview), [xmlPreview])
  const mt103Tags = useMemo(() => extractMt103Tags(mt103Preview), [mt103Preview])

  const pipelineSnapshot = useMemo(() => {
    if (isProcessing) {
      return {
        progress: 92,
        stages: ['Uploading XML', 'Awaiting MT103'],
      }
    }

    const latestJob = jobHistory[0]
    if (!latestJob) {
      return {
        progress: 0,
        stages: ['No active jobs'],
      }
    }

    if (latestJob.status === 'success') {
      return {
        progress: 100,
        stages: ['Validation complete', 'MT103 generated'],
      }
    }

    if (latestJob.status === 'failed') {
      return {
        progress: 100,
        stages: ['Validation failed', 'Conversion halted'],
      }
    }

    return {
      progress: 65,
      stages: ['Request accepted', 'Processing conversion'],
    }
  }, [isProcessing, jobHistory])

  return (
    <section className="page-stack">
      <SectionHeader
        title="XML → MT103 workspace"
        description="Upload SWIFT XML payloads, review the transformed MT103 structure, and distribute files across channels."
        actions={<button type="button" className="btn btn-outline" aria-label="Open conversion presets">Conversion presets</button>}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <UploadCard
          presetOptions={presetProfiles}
          channelOptions={channelOptions}
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onGenerate={handleGenerate}
          onReset={handleReset}
          isProcessing={isProcessing}
          errorMessage={errorMessage}
        />
        <JobStatusPanel historyItems={jobHistory} pipelineStatus={pipelineSnapshot} />
      </div>

      {lastGenerated ? (
        <CardSurface
          title="Latest generation"
          subtitle={`Generated at ${lastGenerated.toLocaleTimeString?.() ?? lastGenerated}`}
          className="border border-success/30 bg-success/5"
        >
          <p className="text-sm text-success">Preview refreshed with the latest MT103 output.</p>
        </CardSurface>
      ) : null}

      <PreviewTabs xml={xmlPreview} mt103={mt103Preview} />

      <ComparisonSection fieldMap={fieldMap} mt103Tags={mt103Tags} />

      <DownloadSection
        mt103={mt103Preview}
        warnings={conversionWarnings}
        isProcessing={isProcessing}
        processingTimeMs={processingTime}
        isReady={Boolean(lastGenerated)}
      />
    </section>
  )
}

export default ConvertPage
