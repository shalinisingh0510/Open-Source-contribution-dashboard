import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ChartWrapper } from "./ChartWrapper.jsx";

const formatDate = (value) => value.slice(5);

export const ActivityBarChart = ({ data = [] }) => (
  <ChartWrapper
    title="Contribution Activity"
    subtitle="Recent contribution volume in the last 14 days."
  >
    {data.length ? (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d2d9d4" />
          <XAxis dataKey="date" tickFormatter={formatDate} stroke="#536569" />
          <YAxis stroke="#536569" />
          <Tooltip
            labelFormatter={(value) => `Date: ${value}`}
            formatter={(value) => [value, "Contributions"]}
          />
          <Bar dataKey="contributions" fill="#0f766e" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <div className="chart-empty">No recent activity available.</div>
    )}
  </ChartWrapper>
);
