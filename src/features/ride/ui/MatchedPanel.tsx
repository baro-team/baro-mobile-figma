import { RideFareSummary } from "./RideFareSummary";
import { RideRouteSummary } from "./RideRouteSummary";
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
        <p className="text-gray-900 font-bold text-xl">{arrivalTime}</p>
        <p className="text-gray-500"> 도착 예정 </p>
      </div>

      <RideVehicleCard
        label="123가 1234"
        rounded="2xl"
      />

      <div className="relative">
        <RideRouteSummary
          origin={origin}
          destination={destination}
        />
        <RideFareSummary formattedEstimatedCost={formattedEstimatedCost} />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCancelRide}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 rounded-md transition-all text-lg"
        >
          배차 취소
        </button>
      </div>
    </div>
  );
}
