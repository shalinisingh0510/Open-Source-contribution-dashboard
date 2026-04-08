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

const shorten = (value) => (value.length > 12 ? `${value.slice(0, 11)}…` : value);

export const RepoStarsChart = ({ data = [] }) => (
  <ChartWrapper
    title="Top Repositories by Stars"
    subtitle="Star count distribution across top repositories."
  >
    {data.length ? (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dae4df" />
          <XAxis dataKey="name" tickFormatter={shorten} stroke="#5b6d71" />
          <YAxis stroke="#5b6d71" />
          <Tooltip formatter={(value) => [value, "Stars"]} />
          <Bar dataKey="stars" fill="#f97316" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <div className="chart-empty">No repository star data available.</div>
    )}
  </ChartWrapper>
);
