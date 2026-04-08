import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { ChartWrapper } from "./ChartWrapper.jsx";

const COLORS = [
  "#0f766e",
  "#f97316",
  "#155e75",
  "#84cc16",
  "#dc2626",
  "#14b8a6",
  "#0ea5e9",
  "#9333ea"
];

export const LanguagePieChart = ({ data = [] }) => (
  <ChartWrapper
    title="Language Distribution"
    subtitle="Top languages across repositories."
    className="language-chart"
  >
    {data.length ? (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value}%`} />
        </PieChart>
      </ResponsiveContainer>
    ) : (
      <div className="chart-empty">No language data found.</div>
    )}
  </ChartWrapper>
);
