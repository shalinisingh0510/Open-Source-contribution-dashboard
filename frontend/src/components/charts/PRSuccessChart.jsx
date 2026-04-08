import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartWrapper } from "./ChartWrapper.jsx";

export const PRSuccessChart = ({ mergedPRs = 0, totalPRs = 0 }) => {
  if (totalPRs === 0) {
    return (
      <ChartWrapper
        title="PR Success Rate"
        subtitle="Merged pull requests versus total pull requests."
      >
        <div className="chart-empty">No pull request data available.</div>
      </ChartWrapper>
    );
  }

  const openOrUnmerged = Math.max(totalPRs - mergedPRs, 0);
  const chartData = [
    { name: "Merged", value: mergedPRs, fill: "#0f766e" },
    { name: "Other", value: openOrUnmerged, fill: "#fbbf24" }
  ];

  return (
    <ChartWrapper
      title="PR Success Rate"
      subtitle="Merged pull requests versus total pull requests."
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={64}
            outerRadius={98}
            paddingAngle={2}
          />
          <Tooltip formatter={(value) => value} />
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
};
