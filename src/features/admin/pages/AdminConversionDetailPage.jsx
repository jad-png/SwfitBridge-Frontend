import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Database, FileText, AlertCircle, CheckCircle2, History, User } from 'lucide-react'
import SectionHeader from '../../../components/ui/SectionHeader'
import useAdminConversionDetail from '../hooks/useAdminConversionDetail'
import { ROUTES } from '../../../app/routes/paths'

function AdminConversionDetailPage() {
    const { id } = useParams()
    const { data, isLoading, error } = useAdminConversionDetail(id)

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-base-content/60 animate-pulse">Retrieving conversion audit data...</p>
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
                    <Link to={ROUTES.ADMIN_HISTORY} className="btn btn-sm btn-ghost mt-2 w-fit -ml-2">
                        Return to History
                    </Link>
                </div>
            </div>
        )
    }

    const isSuccess = data?.conversionStatus?.toLowerCase() === 'success' || data?.status?.toLowerCase() === 'completed'
    const isFailed = data?.conversionStatus?.toLowerCase() === 'failed' || data?.status?.toLowerCase() === 'failed'

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

    return (
        <section className="page-stack">
            <div className="flex items-center gap-2 mb-2">
                <Link to={ROUTES.ADMIN_HISTORY} className="btn btn-ghost btn-sm btn-square">
                    <ChevronLeft className="w-4 h-4" />
                </Link>
                <div className="text-xs uppercase tracking-widest text-base-content/40 font-semibold">
                    Conversion Audit Log
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
                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="card-surface p-6 border border-base-content/5">
                        <h3 className="eyebrow-text text-xs text-base-content/40 mb-4 flex items-center gap-2">
                            <User className="w-3 h-3" /> Metadata
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-base-content/50 block mb-1">Initiated By</label>
                                <div className="font-medium text-lg">{data?.username || data?.user?.username || 'System'}</div>
                            </div>
                            <div>
                                <label className="text-xs text-base-content/50 block mb-1">Timestamp</label>
                                <div className="text-sm">{new Date(data?.requestTimestamp || data?.createdAt).toLocaleString()}</div>
                            </div>
                            <div>
                                <label className="text-xs text-base-content/50 block mb-1">Duration</label>
                                <div className="text-sm">{data?.processingDurationMs ? `${data.processingDurationMs}ms` : '—'}</div>
                            </div>
                            <div>
                                <label className="text-xs text-base-content/50 block mb-1">Message ID</label>
                                <div className="text-xs font-mono bg-base-300/30 p-2 rounded truncate" title={data?.messageReference}>
                                    {data?.messageReference || '—'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {isFailed && (
                        <div className="card-surface p-6 border-2 border-error/20 bg-error/5">
                            <h3 className="eyebrow-text text-xs text-error mb-4 flex items-center gap-2 uppercase font-bold">
                                <ShieldAlert className="w-3 h-3" /> Validation Errors
                            </h3>
                            <div className="space-y-3">
                                {data?.validationErrors && data.validationErrors.length > 0 ? (
                                    data.validationErrors.map((err, idx) => (
                                        <div key={idx} className="p-3 bg-base-100/50 rounded-lg text-sm border border-error/10">
                                            <span className="font-semibold text-error block mb-1">Error #{idx + 1}</span>
                                            <p className="leading-relaxed">{err.message || err}</p>
                                            {err.path && <code className="text-[10px] mt-2 block opacity-50">Path: {err.path}</code>}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm opacity-80 italic">
                                        {data?.errorMessage || 'No specific validation details provided by the engine.'}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Tabs/Sections */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card-surface p-0 border border-base-content/10 overflow-hidden">
                        <div className="bg-base-200/50 p-4 border-b border-base-content/5 flex items-center gap-2">
                            <Database className="w-4 h-4 text-primary" />
                            <span className="font-bold text-sm">Converted Data (Input)</span>
                        </div>
                        <div className="p-4 bg-base-300/30">
                            <pre className="text-xs font-mono overflow-x-auto p-4 leading-normal whitespace-pre-wrap max-h-[400px]">
                                {data?.inputData ? formatXml(data.inputData) : 'No payload data available.'}                            
                            </pre>
                        </div>
                    </div>

                    {(isSuccess || data?.outputContent) && (
                        <div className="card-surface p-0 border border-base-content/10 overflow-hidden shadow-sm">
                            <div className="bg-base-200/50 p-4 border-b border-base-content/5 flex items-center gap-2 justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-success" />
                                    <span className="font-bold text-sm">Result Output (SWIFT MT103)</span>
                                </div>
                                {isSuccess && (
                                    <span className="text-[10px] bg-success/20 text-success px-2 py-1 rounded font-bold uppercase">
                                        Validated
                                    </span>
                                )}
                            </div>
                            <div className="p-4 bg-slate-900 text-slate-100">
                                <pre className="text-xs font-mono overflow-x-auto p-4 leading-relaxed whitespace-pre bg-[#1e1e1e] rounded border border-white/5">
                                    {data?.outputContent || data?.result || 'The resulting file content is empty or could not be retrieved.'}
                                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

function ShieldAlert(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
        </svg>
    )
}

export default AdminConversionDetailPage
