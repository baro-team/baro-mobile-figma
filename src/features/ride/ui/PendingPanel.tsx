import { Car } from "lucide-react";
import { RideRouteSummary } from "./RideRouteSummary";

type PendingPanelProps = {
  origin: string;
  destination: string;
  searchRadius: number;
  onCancelRide: () => void;
};

export function PendingPanel({
  origin,
  destination,
  searchRadius,
  onCancelRide,
}: PendingPanelProps) {
  return (
    <>
      <div className="mb-3">
        <RideRouteSummary
          origin={origin}
          destination={destination}
          compact
        />
      </div>

      <div className="flex flex-col items-center gap-3 mb-4 p-3 text-center">
        <div className="p-2.5 bg-cyan-400 rounded-full animate-pulse shadow-sm">
          <Car className="w-5 h-5 text-white" />
        </div>

        <p className="text-gray-900 font-medium text-lg mb-2">
          {searchRadius}km 반경 안의 차량 찾는중...
        </p>
        <div className="flex justify-center mb-4">
          <div className="flex gap-1.5">
            <div
              className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>

      <button
        onClick={onCancelRide}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 rounded-md transition-all text-lg"
      >
        취소
      </button>
    </>
  );
}
