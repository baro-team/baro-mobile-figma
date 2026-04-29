import { useMobileViewport } from "../../app/hooks/useMobileViewport";
import {
  CarArrivedOverlay,
  MapStage,
  RideBottomSheet,
  RideCompletedOverlay,
  useRideFlow,
} from "../../features/ride";

export function RideBookingPage() {
  const { isKeyboardOpen, keyboardInset } = useMobileViewport();
  const {
    origin,
    setOrigin,
    destination,
    setDestination,
    selectedOrigin,
    selectedDestination,
    originSearchResults,
    destinationSearchResults,
    isOriginSearchLoading,
    isDestinationSearchLoading,
    originSearchError,
    destinationSearchError,
    selectOriginPlace,
    selectDestinationPlace,
    preDispatchPreview,
    isPreDispatchLoading,
    preDispatchError,
    requestPreDispatchPreview,
    estimatedCost,
    rideState,
    eta,
    searchRadius,
    showCarOverlay,
    requestRide,
    openDoor,
    resetToBooking,
    cancelRide,
  } = useRideFlow();

  return (
    <div
      className="relative w-full max-w-md mx-auto bg-gray-50 overflow-hidden"
      style={{
        height: "100dvh",
        paddingTop: "var(--safe-area-top)",
      }}
    >
      <div className="absolute inset-0">
        <MapStage
          origin={origin}
          destination={destination}
          originLocation={selectedOrigin}
          destinationLocation={selectedDestination}
          routePath={preDispatchPreview?.routePath ?? null}
          distanceKm={preDispatchPreview?.distanceKm ?? null}
          rideState={rideState}
        />
      </div>

      <div
        className="absolute inset-x-0 bottom-0 z-30"
        style={{ bottom: `${keyboardInset}px` }}
      >
        <RideBottomSheet
          rideState={rideState}
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
          eta={eta}
          searchRadius={searchRadius}
          estimatedCost={estimatedCost}
          isKeyboardOpen={isKeyboardOpen}
          onOriginChange={setOrigin}
          onDestinationChange={setDestination}
          onOriginSelect={selectOriginPlace}
          onDestinationSelect={selectDestinationPlace}
          onRequestPreview={requestPreDispatchPreview}
          onRequestRide={requestRide}
          onCancelRide={cancelRide}
        />
      </div>

      <CarArrivedOverlay visible={showCarOverlay} onOpenDoor={openDoor} />

      <RideCompletedOverlay
        visible={rideState === "completed"}
        onConfirm={resetToBooking}
      />
    </div>
  );
}
