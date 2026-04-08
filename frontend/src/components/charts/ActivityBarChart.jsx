import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
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
    subtitle="Recent contributions and commit trend."
  >
    {data.length ? (
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d2d9d4" />
          <XAxis dataKey="date" tickFormatter={formatDate} stroke="#536569" />
          <YAxis stroke="#536569" />
          <Tooltip
            labelFormatter={(value) => `Date: ${value}`}
            formatter={(value, name) => [
              value,
              name === "contributions" ? "Contributions" : "Commits"
            ]}
          />
          <Bar dataKey="contributions" fill="#0f766e" radius={[6, 6, 0, 0]} />
          <Line
            type="monotone"
            dataKey="commits"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    ) : (
      <div className="chart-empty">No recent activity available.</div>
    )}
  </ChartWrapper>
);
