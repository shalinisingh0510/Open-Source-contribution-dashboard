import { Card } from "../ui/Card.jsx";
import { Skeleton } from "../ui/Loader.jsx";

export const DashboardSkeleton = () => (
  <div className="dashboard-skeleton">
    <Card>
      <Skeleton className="skeleton-line skeleton-line-wide" />
      <Skeleton className="skeleton-line" />
    </Card>
    <div className="skeleton-metrics">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={`metric-skeleton-${index}`}>
          <Skeleton className="skeleton-line" />
          <Skeleton className="skeleton-value" />
        </Card>
      ))}
    </div>
    <div className="skeleton-charts">
      {Array.from({ length: 2 }).map((_, index) => (
        <Card key={`chart-skeleton-${index}`}>
          <Skeleton className="skeleton-chart" />
        </Card>
      ))}
    </div>
  </div>
);
