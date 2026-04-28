import { Dot } from "lucide-react";

type RideRouteSummaryProps = {
  origin: string;
  destination: string;
  compact?: boolean;
};

export function RideRouteSummary({
  origin,
  destination,
  compact = false,
}: RideRouteSummaryProps) {
  const containerClassName = compact
    ? "ds-route-surface relative p-1"
    : "relative p-3";

  return (
    <div className={containerClassName}>
      <div className="flex items-center">
        <Dot className="w-10 h-10 text-black" />
        <p className="type-body ds-text-secondary">{origin}</p>
      </div>
      <div className="flex items-center">
        <Dot className="w-10 h-10 text-cyan-400" />
        <p className="type-body ds-text-secondary">{destination}</p>
      </div>
    </div>
  );
}
