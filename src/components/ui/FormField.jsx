function FormField({
  label,
  hint,
  error,
  required,
  labelAction,
  children,
  className = '',
}) {
  return (
    <label className={`form-control ${className}`}>
      {label ? (
        <div className="label">
          <span className="label-text font-semibold">
            {label}
            {required ? <span className="ml-1 text-error" aria-hidden>*</span> : null}
          </span>
          {labelAction ? <span className="label-text-alt">{labelAction}</span> : null}
        </div>
      ) : null}
      {children}
      {(hint || error) ? (
        <div className="label">
          {error ? (
            <span className="label-text-alt text-error" role="alert">{error}</span>
          ) : (
            <span className="label-text-alt text-base-content/60">{hint}</span>
          )}
        </div>
      ) : null}
    </label>
  )
}

export default FormField
