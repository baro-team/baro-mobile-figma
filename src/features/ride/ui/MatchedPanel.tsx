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
      <RideSheetSection
        title="배차 완료"
        subtitle={`${arrivalTime} 도착 예정`}
      >
        <RideVehicleCard
          label="123가 1234"
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

      <RideSheetActions>
        <button
          onClick={onCancelRide}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 rounded-2xl transition-all text-lg"
        >
          배차 취소
        </button>
      </RideSheetActions>
    </div>
  );
}
