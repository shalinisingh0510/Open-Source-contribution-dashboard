export const Navbar = ({ username, onReset }) => (
  <header className="navbar">
    <div className="brand-block">
      <p className="brand-eyebrow">Open Source Insights</p>
      <h1 className="brand-title">GitHub Contribution Dashboard</h1>
      <p className="brand-subtitle">
        Production dashboard for repositories, pull requests, and language analytics.
      </p>
    </div>
    <div className="navbar-actions">
      {username ? <span className="username-pill">@{username}</span> : null}
      <button type="button" className="ghost-btn" onClick={onReset}>
        Reset
      </button>
    </div>
  </header>
);
