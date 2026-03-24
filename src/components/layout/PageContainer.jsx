function PageContainer({ children, className = '' }) {
  return <main className={`mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-10 md:py-12 ${className}`}>{children}</main>
}

export default PageContainer
