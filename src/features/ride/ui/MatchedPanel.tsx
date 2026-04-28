import { RideFareSummary } from "./RideFareSummary";
import { RideRouteSummary } from "./RideRouteSummary";
import { RideSheetActions } from "./RideSheetActions";
import { RideSheetSection } from "./RideSheetSection";
import { RideVehicleCard } from "./RideVehicleCard";

type MatchedPanelProps = {
  origin: string;
  destination: string;
  arrivalTime: string;
  formattedEstimatedCost: string;
  onCancelRide: () => void;
};

export function MatchedPanel({
  origin,
  destination,
  arrivalTime,
  formattedEstimatedCost,
  onCancelRide,
}: MatchedPanelProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center gap-1.5 mb-4">
        <p className="type-display ds-text-primary">{arrivalTime}</p>
        <p className="type-label ds-text-secondary"> 도착 예정 </p>
      </div>

      <RideSheetSection>
        <RideVehicleCard label="123가 1234" rounded="2xl" />
        <div className="relative mt-4">
          <RideRouteSummary
            origin={origin}
            destination={destination}
          />
          <RideFareSummary formattedEstimatedCost={formattedEstimatedCost} />
        </div>
      </RideSheetSection>

      <RideSheetActions>
        <button
          onClick={onCancelRide}
          className="type-title ds-button-secondary flex-1"
        >
          배차 취소
        </button>
      </RideSheetActions>
    </div>
  );
}
