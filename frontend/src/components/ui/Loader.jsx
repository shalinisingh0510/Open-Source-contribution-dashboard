export const Loader = ({ label = "Loading dashboard..." }) => (
  <div className="loader-wrap" role="status" aria-live="polite">
    <div className="loader" />
    <p className="loader-label">{label}</p>
  </div>
);

export const Skeleton = ({ className = "" }) => (
  <div className={`skeleton ${className}`.trim()} aria-hidden="true" />
);
