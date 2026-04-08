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
      <div className="language-chart-layout">
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
                <Cell
                  key={entry.name}
                  fill={entry.color || COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="language-legend">
          {data.slice(0, 5).map((entry, index) => (
            <p key={entry.name} className="legend-item">
              <span
                className="legend-dot"
                style={{ backgroundColor: entry.color || COLORS[index % COLORS.length] }}
              />
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      </div>
    ) : (
      <div className="chart-empty">No language data found.</div>
    )}
  </ChartWrapper>
);
