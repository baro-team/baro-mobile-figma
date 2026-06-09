import { Car } from "lucide-react";

type RideVehicleCardProps = {
  label: string;
  badgeLabel?: string;
  metaItems?: Array<string | null | undefined>;
  rounded?: "md" | "2xl";
};

const roundedClassNames = {
  md: "rounded-md",
  "2xl": "rounded-2xl",
};

export function RideVehicleCard({
  label,
  badgeLabel,
  metaItems = [],
  rounded = "2xl",
}: RideVehicleCardProps) {
  const visibleMetaItems = metaItems.filter(Boolean);

  return (
    <div className={`ds-card p-5 ${roundedClassNames[rounded]}`}>
      <div className="flex items-center gap-4">
        <div className="ds-icon-badge w-14 h-14 p-2.5 flex items-center justify-center">
          <Car className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <p className="type-title ds-text-primary">{label}</p>
          {visibleMetaItems.length > 0 ? (
            <p className="type-caption ds-text-secondary mt-1">
              {visibleMetaItems.join(" · ")}
            </p>
          ) : null}
        </div>
        {badgeLabel ? (
          <div className="ds-icon-badge px-3 py-2">
            <p className="type-caption text-white">{badgeLabel}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
