import { useMobileViewport } from "./hooks/useMobileViewport";
import { useRideFlow } from "../features/ride/hooks/useRideFlow";
import { CarArrivedOverlay } from "../features/ride/ui/CarArrivedOverlay";
import { MapStage } from "../features/ride/ui/MapStage";
import { RideBottomSheet } from "../features/ride/ui/RideBottomSheet";
import { RideCompletedOverlay } from "../features/ride/ui/RideCompletedOverlay";

export default function App() {
  const { isKeyboardOpen, keyboardInset } = useMobileViewport();
  const {
    origin,
    setOrigin,
    destination,
    setDestination,
    preDispatchPreview,
    isPreDispatchLoading,
    preDispatchError,
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
          preDispatchPreview={preDispatchPreview}
          isPreDispatchLoading={isPreDispatchLoading}
          preDispatchError={preDispatchError}
          eta={eta}
          searchRadius={searchRadius}
          estimatedCost={estimatedCost}
          isKeyboardOpen={isKeyboardOpen}
          onOriginChange={setOrigin}
          onDestinationChange={setDestination}
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
