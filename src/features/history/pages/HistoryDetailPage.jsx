import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Database, FileText, AlertCircle, CheckCircle2, History } from 'lucide-react'
import SectionHeader from '../../../components/ui/SectionHeader'
import { fetchHistoryDetail } from '../../../services/api/historyService'
import { ROUTES } from '../../../app/routes/paths'
import { useEffect, useState, useCallback } from 'react'

function HistoryDetailPage() {
    const { id } = useParams()
    const [data, setData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const load = useCallback(async () => {
        if (!id) return
        setIsLoading(true)
        setError(null)
        try {
            const result = await fetchHistoryDetail(id)
            setData(result)
        } catch (reason) {
            setError(reason?.response?.data?.message ?? reason.message ?? 'Unable to load conversion details.')
        } finally {
            setIsLoading(false)
        }
    }, [id])

    useEffect(() => {
        load()
    }, [load])


    const formatXml = (xml) => {
        try {
            const parser = new DOMParser()
            const xmlDoc = parser.parseFromString(xml, "application/xml")

            const serializer = new XMLSerializer()
            const formatted = serializer.serializeToString(xmlDoc)

            return formatted
        } catch (e) {
            return xml
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-base-content/60 animate-pulse">Retrieving conversion data...</p>
            </div>
        )
    }

    if (error || (!data && !isLoading)) {
        return (
            <div className="alert alert-error max-w-2xl mx-auto mt-12 shadow-lg">
                <AlertCircle className="w-6 h-6" />
                <div className="flex flex-col gap-1">
                    <span className="font-bold">Error loading record</span>
                    <p className="text-sm opacity-90">{error || 'Record not found.'}</p>
                    <Link to={ROUTES.HISTORY} className="btn btn-sm btn-ghost mt-2 w-fit -ml-2">
                        Return to History
                    </Link>
                </div>
            </div>
        )
    }

    const isSuccess = data?.conversionStatus?.toLowerCase() === 'success' || data?.status?.toLowerCase() === 'completed'
    const isFailed = data?.conversionStatus?.toLowerCase() === 'failed' || data?.status?.toLowerCase() === 'failed'

    return (
        <section className="page-stack">
            <div className="flex items-center gap-2 mb-2">
                <Link to={ROUTES.HISTORY} className="btn btn-ghost btn-sm btn-square">
                    <ChevronLeft className="w-4 h-4" />
                </Link>
                <div className="text-xs uppercase tracking-widest text-base-content/40 font-semibold">
                    Conversion Preview
                </div>
            </div>

            <SectionHeader
                title={`Conversion Detail`}
                description={`Transaction ${id}`}
                actions={
                    <div className={`badge badge-lg p-4 font-bold border-2 ${isSuccess ? 'badge-success border-success/20' :
                        isFailed ? 'badge-error border-error/20' :
                            'badge-ghost border-base-content/10'
                        }`}>
                        {isSuccess ? <CheckCircle2 className="w-4 h-4 mr-2" /> : isFailed ? <AlertCircle className="w-4 h-4 mr-2" /> : <History className="w-4 h-4 mr-2" />}
                        {data?.conversionStatus || data?.status || 'Unknown'}
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="space-y-6">
                    <div className="card-surface p-6 border border-base-content/5">
                        <h3 className="eyebrow-text text-xs text-base-content/40 mb-4 flex items-center gap-2">
                            Metadata
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-base-content/50 block mb-1">Timestamp</label>
                                <div className="text-sm">{new Date(data?.requestTimestamp || data?.createdAt).toLocaleString()}</div>
                            </div>
                            <div>
                                <label className="text-xs text-base-content/50 block mb-1">Duration</label>
                                <div className="text-sm">{data?.processingDurationMs ? `${data.processingDurationMs}ms` : '—'}</div>
                            </div>
                            <div>
                                <label className="text-xs text-base-content/50 block mb-1">Message Identifier</label>
                                <div className="text-xs font-mono bg-base-300/30 p-2 rounded truncate" title={data?.messageReference}>
                                    {data?.messageReference || '—'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {isFailed && data?.errorMessage && (
                        <div className="alert alert-warning text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{data.errorMessage}</span>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="card-surface p-0 border border-base-content/10 overflow-hidden">
                        <div className="bg-base-200/50 p-4 border-b border-base-content/5 flex items-center gap-2">
                            <Database className="w-4 h-4 text-primary" />
                            <span className="font-bold text-sm">Input Payload (source)</span>
                        </div>
                        <div className="p-4 bg-base-300/30">
                            <pre className="text-xs font-mono overflow-x-auto p-4 leading-normal whitespace-pre-wrap max-h-[400px]">
                                {data?.inputData ? formatXml(data.inputData) : 'No payload data available.'}                            </pre>
                        </div>
                    </div>

                    {(isSuccess || data?.outputContent) && (
                        <div className="card-surface p-0 border border-base-content/10 overflow-hidden shadow-sm">
                            <div className="bg-base-200/50 p-4 border-b border-base-content/5 flex items-center gap-2 justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-success" />
                                    <span className="font-bold text-sm">Result Output (SWIFT MT103)</span>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-900 text-slate-100">
                                <pre className="text-xs font-mono overflow-x-auto p-4 leading-relaxed whitespace-pre bg-[#1e1e1e] rounded border border-white/5">
                                    {data?.outputContent || data?.result || 'The resulting file content is empty.'}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default HistoryDetailPage


