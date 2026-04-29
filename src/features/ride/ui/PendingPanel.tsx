import { Car } from "lucide-react";
import { RideRouteSummary } from "./RideRouteSummary";
import { RideSheetActions } from "./RideSheetActions";
import { RideSheetPanel } from "./RideSheetPanel";
import { RideSheetSection } from "./RideSheetSection";

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
    <RideSheetPanel
      actions={
        <RideSheetActions>
          <button
            onClick={onCancelRide}
            className="type-title ds-button-secondary w-full"
          >
            취소
          </button>
        </RideSheetActions>
      }
    >
      <RideSheetSection>
        <RideRouteSummary
          origin={origin}
          destination={destination}
          compact
        />

        <div className="mt-4 flex flex-col items-center gap-3 p-3 text-center">
          <div className="ds-icon-badge p-2.5 animate-pulse">
            <Car className="w-5 h-5 text-white" />
          </div>

          <p className="type-title ds-text-primary">
            {searchRadius}km 반경 안의 차량 찾는중...
          </p>
          <div className="flex justify-center">
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
      </RideSheetSection>
    </RideSheetPanel>
  );
}
