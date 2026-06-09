import { DispatchResult } from "../model/pre-dispatch-types";
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
  dispatchResult: DispatchResult | null;
  onCancelRide: () => void;
};

function getVehicleLabel(dispatchResult: DispatchResult | null) {
  if (!dispatchResult) {
    return "배차 차량 확인 중";
  }

  return `차량 ID ${dispatchResult.carId}`;
}

export function MatchedPanel({
  origin,
  destination,
  arrivalTime,
  formattedEstimatedCost,
  dispatchResult,
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
        <RideVehicleCard
          label={getVehicleLabel(dispatchResult)}
          badgeLabel={dispatchResult?.dispatchStatus}
          metaItems={[
            dispatchResult ? `배차 #${dispatchResult.dispatchId}` : null,
            dispatchResult ? `승강장 #${dispatchResult.standId}` : null,
            dispatchResult ? `요청 #${dispatchResult.requestId}` : null,
          ]}
          rounded="2xl"
        />
        <div className="relative mt-4">
          <RideRouteSummary
            origin={origin}
            destination={destination}
          />
          <RideFareSummary formattedEstimatedCost={formattedEstimatedCost} />
        </div>
      </RideSheetSection>
    </RideSheetPanel>
  );
}
