import { RideFareSummary } from "./RideFareSummary";
import { RideRouteSummary } from "./RideRouteSummary";
import { RideSheetActions } from "./RideSheetActions";
import { RideSheetPanel } from "./RideSheetPanel";
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
    <RideSheetPanel
      header={(
        <div className="flex flex-row items-center gap-1.5">
          <p className="type-display ds-text-primary">{arrivalTime}</p>
          <p className="type-label ds-text-secondary"> 도착 예정 </p>
        </div>
      )}
      actions={
        <RideSheetActions>
          <button
            onClick={onCancelRide}
            className="type-title ds-button-secondary flex-1"
          >
            배차 취소
          </button>
        </RideSheetActions>
      }
    >
      <RideSheetSection>
        <RideVehicleCard label="123가 1234" rounded="2xl" />
        <div className="mt-4">
          <RideRouteSummary
            origin={origin}
            destination={destination}
          />
        </div>

        <div className="mt-4">
          <RideFareSummary formattedEstimatedCost={formattedEstimatedCost} />
        </div>
      </RideSheetSection>
    </RideSheetPanel>
  );
}
