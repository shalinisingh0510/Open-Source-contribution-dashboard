export const Card = ({ title, subtitle, action, className = "", children }) => (
  <article className={`card ${className}`.trim()}>
    {(title || subtitle || action) && (
      <header className="card-header">
        <div>
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
        {action}
      </header>
    )}
    <div className="card-content">{children}</div>
  </article>
);
