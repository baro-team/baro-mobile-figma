import { useCallback, useEffect, useRef, useState } from "react";
import { RideState, transitionRideState } from "../model/ride-machine";

type TimerId = ReturnType<typeof setTimeout>;

export function useRideFlow() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [rideState, setRideState] = useState<RideState>("booking");
  const [eta, setEta] = useState(5);
  const [searchRadius, setSearchRadius] = useState(5);
  const [showCarOverlay, setShowCarOverlay] = useState(false);

  const timersRef = useRef<TimerId[]>([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const schedule = useCallback((callback: () => void, delayMs: number) => {
    const timer = setTimeout(callback, delayMs);
    timersRef.current.push(timer);
    return timer;
  }, []);

  const requestRide = useCallback(() => {
    if (!origin || !destination) {
      return;
    }

    clearAllTimers();

    setEstimatedCost(Math.floor(Math.random() * 20000) + 5000);
    setRideState((current) => transitionRideState(current, "REQUEST_RIDE"));
    setSearchRadius(5);

    schedule(() => setSearchRadius(10), 1000);
    schedule(() => setSearchRadius(20), 3000);
    schedule(() => {
      setRideState((current) => transitionRideState(current, "CAR_MATCHED"));
      setEta(5);
    }, 4000);
    schedule(() => setShowCarOverlay(true), 8000);
  }, [clearAllTimers, destination, origin, schedule]);

  const openDoor = useCallback(() => {
    setShowCarOverlay(false);
    setRideState((current) => transitionRideState(current, "OPEN_DOOR"));

    clearAllTimers();
    schedule(
      () =>
        setRideState((current) => transitionRideState(current, "COMPLETE_RIDE")),
      10000,
    );
  }, [clearAllTimers, schedule]);

  const resetToBooking = useCallback(() => {
    clearAllTimers();
    setRideState((current) => transitionRideState(current, "RESET_TO_BOOKING"));
    setShowCarOverlay(false);
  }, [clearAllTimers]);

  const cancelRide = useCallback(() => {
    clearAllTimers();
    setRideState((current) => transitionRideState(current, "RESET_TO_BOOKING"));
    setEstimatedCost(null);
    setOrigin("");
    setDestination("");
    setSearchRadius(5);
    setShowCarOverlay(false);
  }, [clearAllTimers]);

  useEffect(() => clearAllTimers, [clearAllTimers]);

  return {
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
  };
}
