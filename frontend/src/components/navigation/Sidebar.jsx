const navItems = [
  { id: "overview", label: "Overview" },
  { id: "languages", label: "Languages" },
  { id: "activity", label: "Activity" },
  { id: "repositories", label: "Repositories" }
];

export const Sidebar = ({ activeSection = "overview" }) => (
  <aside className="sidebar">
    <p className="sidebar-title">Sections</p>
    <nav>
      <ul className="sidebar-list">
        {navItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`sidebar-link ${activeSection === item.id ? "active" : ""}`.trim()}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);
