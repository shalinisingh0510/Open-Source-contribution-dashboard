import { Card } from "../ui/Card.jsx";

export const ChartWrapper = ({ title, subtitle, children, className = "" }) => (
  <Card title={title} subtitle={subtitle} className={`chart-card ${className}`.trim()}>
    <div className="chart-area">{children}</div>
  </Card>
);
