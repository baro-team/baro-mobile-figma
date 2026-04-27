import { BookingPanel } from "./BookingPanel";
import { MatchedPanel } from "./MatchedPanel";
import { PendingPanel } from "./PendingPanel";
import { RideState } from "../model/ride-machine";
import { RidingPanel } from "./RidingPanel";

type RideBottomSheetProps = {
  rideState: RideState;
  origin: string;
  destination: string;
  eta: number;
  searchRadius: number;
  estimatedCost: number | null;
  isKeyboardOpen: boolean;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onRequestRide: () => void;
  onCancelRide: () => void;
};

export function RideBottomSheet({
  rideState,
  origin,
  destination,
  eta,
  searchRadius,
  estimatedCost,
  isKeyboardOpen,
  onOriginChange,
  onDestinationChange,
  onRequestRide,
  onCancelRide,
}: RideBottomSheetProps) {
  const arrivalTime = `13:${String(eta).padStart(2, "0")}`;
  const formattedEstimatedCost =
    estimatedCost !== null ? `₩${estimatedCost.toLocaleString("ko-KR")}` : "-";
  const sheetMaxHeight = isKeyboardOpen
    ? "min(32rem, calc(var(--app-viewport-height, 100dvh) * 0.6))"
    : "min(30rem, 48vh)";
  const contentPaddingBottom = isKeyboardOpen
    ? "1.5rem"
    : "calc(1.5rem + var(--safe-area-bottom))";

  const renderPanel = () => {
    switch (rideState) {
      case "booking":
        return (
          <BookingPanel
            origin={origin}
            destination={destination}
            onOriginChange={onOriginChange}
            onDestinationChange={onDestinationChange}
            onRequestRide={onRequestRide}
          />
        );
      case "pending":
        return (
          <PendingPanel
            origin={origin}
            destination={destination}
            searchRadius={searchRadius}
            onCancelRide={onCancelRide}
          />
        );
      case "matched":
        return (
          <MatchedPanel
            origin={origin}
            destination={destination}
            arrivalTime={arrivalTime}
            formattedEstimatedCost={formattedEstimatedCost}
            onCancelRide={onCancelRide}
          />
        );
      case "riding":
        return (
          <RidingPanel
            origin={origin}
            destination={destination}
            formattedEstimatedCost={formattedEstimatedCost}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="w-full max-w-md mx-auto relative flex shrink-0 flex-col bg-white shadow-2xl rounded-t-3xl"
      style={{ maxHeight: sheetMaxHeight }}
    >
      <div className="w-12 h-1 bg-gray-300 mx-auto mt-3 mb-4 shrink-0"></div>

      <div
        className="overflow-y-auto overscroll-contain px-5 pt-2"
        style={{ paddingBottom: contentPaddingBottom }}
      >
        {renderPanel()}
      </div>
    </div>
  );
}
