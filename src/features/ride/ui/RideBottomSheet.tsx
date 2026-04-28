import { BookingPanel } from "./BookingPanel";
import { PlaceSearchResult, PreDispatchPreview, RideLocation } from "../model/ride-types";
import { MatchedPanel } from "./MatchedPanel";
import { PendingPanel } from "./PendingPanel";
import { RideState } from "../model/ride-machine";
import { RidingPanel } from "./RidingPanel";

type RideBottomSheetProps = {
  rideState: RideState;
  origin: string;
  destination: string;
  selectedOrigin: RideLocation | null;
  selectedDestination: RideLocation | null;
  originSearchResults: PlaceSearchResult[];
  destinationSearchResults: PlaceSearchResult[];
  isOriginSearchLoading: boolean;
  isDestinationSearchLoading: boolean;
  originSearchError: string | null;
  destinationSearchError: string | null;
  preDispatchPreview: PreDispatchPreview | null;
  isPreDispatchLoading: boolean;
  preDispatchError: string | null;
  eta: number;
  searchRadius: number;
  estimatedCost: number | null;
  isKeyboardOpen: boolean;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onOriginSelect: (place: PlaceSearchResult) => void;
  onDestinationSelect: (place: PlaceSearchResult) => void;
  onRequestRide: () => void;
  onCancelRide: () => void;
};

export function RideBottomSheet({
  rideState,
  origin,
  destination,
  selectedOrigin,
  selectedDestination,
  originSearchResults,
  destinationSearchResults,
  isOriginSearchLoading,
  isDestinationSearchLoading,
  originSearchError,
  destinationSearchError,
  preDispatchPreview,
  isPreDispatchLoading,
  preDispatchError,
  eta,
  searchRadius,
  estimatedCost,
  isKeyboardOpen,
  onOriginChange,
  onDestinationChange,
  onOriginSelect,
  onDestinationSelect,
  onRequestRide,
  onCancelRide,
}: RideBottomSheetProps) {
  const arrivalTime = `13:${String(eta).padStart(2, "0")}`;
  const formattedEstimatedCost =
    estimatedCost !== null ? `₩${estimatedCost.toLocaleString("ko-KR")}` : "-";
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
            selectedOrigin={selectedOrigin}
            selectedDestination={selectedDestination}
            originSearchResults={originSearchResults}
            destinationSearchResults={destinationSearchResults}
            isOriginSearchLoading={isOriginSearchLoading}
            isDestinationSearchLoading={isDestinationSearchLoading}
            originSearchError={originSearchError}
            destinationSearchError={destinationSearchError}
            preDispatchPreview={preDispatchPreview}
            isPreDispatchLoading={isPreDispatchLoading}
            preDispatchError={preDispatchError}
            onOriginChange={onOriginChange}
            onDestinationChange={onDestinationChange}
            onOriginSelect={onOriginSelect}
            onDestinationSelect={onDestinationSelect}
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
    <div className="ds-sheet-panel w-full max-w-md mx-auto relative flex shrink-0 flex-col">
      <div className="ds-sheet-handle shrink-0"></div>

      <div
        className="px-5 pt-2"
        style={{ paddingBottom: contentPaddingBottom }}
      >
        {renderPanel()}
      </div>
    </div>
  );
}
