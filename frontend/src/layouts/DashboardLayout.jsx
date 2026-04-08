import { Navbar } from "../components/navigation/Navbar.jsx";
import { Sidebar } from "../components/navigation/Sidebar.jsx";

export const DashboardLayout = ({
  username,
  activeSection,
  onReset,
  children
}) => (
  <div className="app-shell">
    <Navbar username={username} onReset={onReset} />
    <div className="app-body">
      <Sidebar activeSection={activeSection} />
      <main className="content">{children}</main>
    </div>
  </div>
);
