import { DispatchResult } from "../model/pre-dispatch-types";
import { RideFareSummary } from "./RideFareSummary";
import { RideSheetPanel } from "./RideSheetPanel";
import { RideRouteSummary } from "./RideRouteSummary";
import { RideSheetSection } from "./RideSheetSection";
import { RideVehicleCard } from "./RideVehicleCard";

type RidingPanelProps = {
  origin: string;
  destination: string;
  formattedEstimatedCost: string;
  dispatchResult: DispatchResult | null;
};

function getVehicleLabel(dispatchResult: DispatchResult | null) {
  if (!dispatchResult) {
    return "배차 차량 확인 중";
  }

  return `차량 ID ${dispatchResult.carId}`;
}

export function RidingPanel({
  origin,
  destination,
  formattedEstimatedCost,
  dispatchResult,
}: RidingPanelProps) {
  return (
    <RideSheetPanel>
      <RideSheetSection>
        <RideVehicleCard
          label={getVehicleLabel(dispatchResult)}
          badgeLabel={dispatchResult?.dispatchStatus || "운행중"}
          metaItems={[
            dispatchResult ? `배차 #${dispatchResult.dispatchId}` : null,
            dispatchResult ? `승강장 #${dispatchResult.standId}` : null,
            dispatchResult ? `예상 주행 ${dispatchResult.estimatedRideTime}분` : null,
          ]}
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
    </RideSheetPanel>
  );
}
