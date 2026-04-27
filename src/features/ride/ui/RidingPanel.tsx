import { RideFareSummary } from "./RideFareSummary";
import { RideRouteSummary } from "./RideRouteSummary";
import { RideVehicleCard } from "./RideVehicleCard";

type RidingPanelProps = {
  origin: string;
  destination: string;
  formattedEstimatedCost: string;
};

export function RidingPanel({
  origin,
  destination,
  formattedEstimatedCost,
}: RidingPanelProps) {
  return (
    <div className="flex flex-col">
      <div className="p-5 rounded-md">
        <RideVehicleCard
          label="차량 A-7492"
          badgeLabel="운행중"
          rounded="md"
        />

        <RideRouteSummary
          origin={origin}
          destination={destination}
          compact
        />
      </div>

      <RideFareSummary formattedEstimatedCost={formattedEstimatedCost} />
    </div>
  );
}
