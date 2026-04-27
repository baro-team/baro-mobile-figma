import { Car } from "lucide-react";

type RideVehicleCardProps = {
  label: string;
  badgeLabel?: string;
  rounded?: "md" | "2xl";
};

const roundedClassNames = {
  md: "rounded-md",
  "2xl": "rounded-2xl",
};

export function RideVehicleCard({
  label,
  badgeLabel,
  rounded = "2xl",
}: RideVehicleCardProps) {
  return (
    <div className={`p-5 border border-gray-200 ${roundedClassNames[rounded]}`}>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full p-2.5 bg-cyan-400 flex items-center justify-center shadow-sm">
          <Car className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <p className="type-title text-gray-900">{label}</p>
        </div>
        {badgeLabel ? (
          <div className="px-3 py-2 bg-cyan-400 rounded-full">
            <p className="type-caption text-white">{badgeLabel}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
