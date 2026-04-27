import { RideFareSummary } from "./RideFareSummary";
import { RideRouteSummary } from "./RideRouteSummary";
import { RideSheetSection } from "./RideSheetSection";
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
      <RideSheetSection>
        <RideVehicleCard
          label="차량 A-7492"
          badgeLabel="운행중"
          rounded="md"
        />

        <div className="mt-4">
          <RideRouteSummary
            origin={origin}
            destination={destination}
            compact
          />
        </div>

        <div className="mt-4">
          <RideFareSummary formattedEstimatedCost={formattedEstimatedCost} />
        </div>
      </RideSheetSection>
    </div>
  );
}
