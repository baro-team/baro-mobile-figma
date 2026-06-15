import { useState } from "react";
import { useMobileViewport } from "../../app/hooks/useMobileViewport";
import {
  CarArrivedOverlay,
  MapStage,
  RideBottomSheet,
  RideCompletedOverlay,
  useRideFlow,
} from "../../features/ride";
import { AuthSession } from "../../features/auth";

type RideBookingPageProps = {
  session: AuthSession;
  onLogout: () => void;
};

export function RideBookingPage({ session, onLogout }: RideBookingPageProps) {
  const { isKeyboardOpen, keyboardInset } = useMobileViewport();
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0);
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
    dispatchResult,
    isPreDispatchLoading,
    preDispatchError,
    requestPreDispatchPreview,
    estimatedCost,
    rideState,
    eta,
    searchRadius,
    showCarOverlay,
    vehicleLocation,
    requestRide,
    openDoor,
    resetToBooking,
    cancelRide,
    isDispatchLoading,
    isCancelDispatchLoading,
    dispatchError,
  } = useRideFlow(session.accessToken);
  const shouldUseDropoffRoute = rideState === "riding" || rideState === "completed";
  const dispatchRoutePath =
    shouldUseDropoffRoute
      ? dispatchResult?.dropoffRoutePath
      : dispatchResult?.pickupRoutePath;

  return (
    <div
      className="app-screen app-mobile-frame relative bg-gray-50 overflow-hidden"
      style={{
        paddingTop: "var(--safe-area-top)",
      }}
    >
      <div className="absolute inset-0">
        <MapStage
          origin={origin}
          destination={destination}
          originLocation={selectedOrigin}
          destinationLocation={selectedDestination}
          vehicleLocation={vehicleLocation}
          routePath={dispatchRoutePath ?? preDispatchPreview?.routePath ?? null}
          distanceKm={preDispatchPreview?.distanceKm ?? null}
          rideState={rideState}
          mapViewportBottomInset={bottomSheetHeight + keyboardInset}
        />
      </div>

      <div className="absolute left-4 right-4 top-4 z-40 flex items-center justify-between rounded-2xl border border-white/70 bg-white/90 px-4 py-3 text-sm shadow-lg backdrop-blur">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900">바로 호출</p>
          <p className="truncate text-xs text-slate-500">{session.email}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="tap-target rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
        >
          로그아웃
        </button>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 z-30 px-[var(--safe-area-left)]"
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
          dispatchResult={dispatchResult}
          isPreDispatchLoading={isPreDispatchLoading}
          preDispatchError={preDispatchError}
          isDispatchLoading={isDispatchLoading}
          isCancelDispatchLoading={isCancelDispatchLoading}
          dispatchError={dispatchError}
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
          onHeightChange={setBottomSheetHeight}
        />
      </div>

      <CarArrivedOverlay
        visible={showCarOverlay}
        dispatchResult={dispatchResult}
        onOpenDoor={openDoor}
      />

      <RideCompletedOverlay
        visible={rideState === "completed"}
        onConfirm={resetToBooking}
      />
    </div>
  );
}
