import { useRideFlow } from "../features/ride/hooks/useRideFlow";
import { CarArrivedOverlay } from "../features/ride/ui/CarArrivedOverlay";
import { MapStage } from "../features/ride/ui/MapStage";
import { RideBottomSheet } from "../features/ride/ui/RideBottomSheet";
import { RideCompletedOverlay } from "../features/ride/ui/RideCompletedOverlay";

export default function App() {
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
    setShowCarOverlay,
    requestRide,
    openDoor,
    resetToBooking,
    cancelRide,
  } = useRideFlow();

  return (
    <div className="size-full bg-gray-50 flex flex-col overflow-hidden max-w-md mx-auto">
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
        onOriginChange={setOrigin}
        onDestinationChange={setDestination}
        onRequestRide={requestRide}
        onCancelRide={cancelRide}
      />

      <CarArrivedOverlay
        visible={showCarOverlay}
        onDismiss={() => setShowCarOverlay(false)}
        onOpenDoor={openDoor}
      />

      <RideCompletedOverlay
        visible={rideState === "completed"}
        onConfirm={resetToBooking}
      />
    </div>
  );
}
