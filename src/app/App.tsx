import { useMobileViewport } from "./hooks/useMobileViewport";
import { useRideFlow } from "../features/ride/hooks/useRideFlow";
import { CarArrivedOverlay } from "../features/ride/ui/CarArrivedOverlay";
import { MapStage } from "../features/ride/ui/MapStage";
import { RideBottomSheet } from "../features/ride/ui/RideBottomSheet";
import { RideCompletedOverlay } from "../features/ride/ui/RideCompletedOverlay";

export default function App() {
  const { isKeyboardOpen, viewportHeight } = useMobileViewport();
  const {
    origin,
    setOrigin,
    destination,
    setDestination,
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
      className="relative w-full max-w-md mx-auto bg-gray-50 flex flex-col overflow-hidden"
      style={{
        height: viewportHeight ? `${viewportHeight}px` : "100dvh",
        paddingTop: "var(--safe-area-top)",
      }}
    >
      <MapStage
        origin={origin}
        destination={destination}
        rideState={rideState}
      />

      <RideBottomSheet
        rideState={rideState}
        origin={origin}
        destination={destination}
        eta={eta}
        searchRadius={searchRadius}
        estimatedCost={estimatedCost}
        isKeyboardOpen={isKeyboardOpen}
        onOriginChange={setOrigin}
        onDestinationChange={setDestination}
        onRequestRide={requestRide}
        onCancelRide={cancelRide}
      />

      <CarArrivedOverlay visible={showCarOverlay} onOpenDoor={openDoor} />

      <RideCompletedOverlay
        visible={rideState === "completed"}
        onConfirm={resetToBooking}
      />
    </div>
  );
}
