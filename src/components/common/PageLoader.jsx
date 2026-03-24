function PageLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-base-200 text-center" role="status" aria-live="polite">
      <span className="loading loading-ring loading-lg text-primary" aria-hidden />
      <div>
        <p className="eyebrow-text text-sm text-base-content/60">Loading</p>
        <p className="text-base text-base-content/70">Preparing the interface...</p>
      </div>
    </div>
  )
}

export default PageLoader
