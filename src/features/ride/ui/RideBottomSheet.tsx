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
  onOriginChange,
  onDestinationChange,
  onRequestRide,
  onCancelRide,
}: RideBottomSheetProps) {
  const arrivalTime = `13:${String(eta).padStart(2, "0")}`;
  const formattedEstimatedCost =
    estimatedCost !== null ? `₩${estimatedCost.toLocaleString("ko-KR")}` : "-";

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
    <div className="w-full h-max flex flex-col bg-white max-w-md mx-auto relative shadow-2xl">
      <div className="w-12 h-1 bg-gray-300 mx-auto mt-3 mb-4"></div>

      <div className="px-5 pb-6">{renderPanel()}</div>
    </div>
  );
}
