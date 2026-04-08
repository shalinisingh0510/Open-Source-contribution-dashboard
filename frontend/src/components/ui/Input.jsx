export const Input = ({
  id,
  label,
  hint,
  error,
  className = "",
  ...props
}) => (
  <div className={`input-group ${className}`.trim()}>
    {label && (
      <label htmlFor={id} className="input-label">
        {label}
      </label>
    )}
    <input id={id} className={`input ${error ? "input-error" : ""}`.trim()} {...props} />
    {hint && !error && <p className="input-hint">{hint}</p>}
    {error && <p className="input-feedback">{error}</p>}
  </div>
);
