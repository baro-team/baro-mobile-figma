import { useCallback, useEffect, useRef, useState } from "react";
import { resolvePlaceInput } from "../lib/place-catalog";
import { requestPreDispatch } from "../lib/pre-dispatch-api";
import { RideState, transitionRideState } from "../model/ride-machine";
import { PreDispatchPreview } from "../model/ride-types";

type TimerId = ReturnType<typeof setTimeout>;

export function useRideFlow() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [preDispatchPreview, setPreDispatchPreview] =
    useState<PreDispatchPreview | null>(null);
  const [isPreDispatchLoading, setIsPreDispatchLoading] = useState(false);
  const [preDispatchError, setPreDispatchError] = useState<string | null>(null);
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
    if (!origin || !destination || !preDispatchPreview) {
      return;
    }

    clearAllTimers();

    setEstimatedCost(preDispatchPreview.fare);
    setEta(preDispatchPreview.estimatedTime);
    setRideState((current) => transitionRideState(current, "REQUEST_RIDE"));
    setSearchRadius(5);

    schedule(() => setSearchRadius(10), 1000);
    schedule(() => setSearchRadius(20), 3000);
    schedule(() => {
      setRideState((current) => transitionRideState(current, "CAR_MATCHED"));
    }, 4000);
    schedule(() => setShowCarOverlay(true), 8000);
  }, [clearAllTimers, destination, origin, preDispatchPreview, schedule]);

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
    setPreDispatchPreview(null);
    setPreDispatchError(null);
    setSearchRadius(5);
    setShowCarOverlay(false);
  }, [clearAllTimers]);

  useEffect(() => {
    const trimmedOrigin = origin.trim();
    const trimmedDestination = destination.trim();

    if (!trimmedOrigin || !trimmedDestination) {
      setPreDispatchPreview(null);
      setPreDispatchError(null);
      setIsPreDispatchLoading(false);
      return;
    }

    const resolvedOrigin = resolvePlaceInput(trimmedOrigin);
    const resolvedDestination = resolvePlaceInput(trimmedDestination);

    if (!resolvedOrigin || !resolvedDestination) {
      setPreDispatchPreview(null);
      setPreDispatchError("현재는 건대/홍대 데모 좌표만 지원합니다.");
      setIsPreDispatchLoading(false);
      return;
    }

    const controller = new AbortController();
    const debounceTimer = window.setTimeout(async () => {
      try {
        setIsPreDispatchLoading(true);
        setPreDispatchError(null);

        const preview = await requestPreDispatch(
          {
            user_id: 1001,
            origin: resolvedOrigin,
            destination: resolvedDestination,
          },
          controller.signal,
        );

        setPreDispatchPreview(preview);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setPreDispatchPreview(null);
        setPreDispatchError(
          error instanceof Error
            ? error.message
            : "사전 배차 예상 정보를 불러오지 못했습니다.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsPreDispatchLoading(false);
        }
      }
    }, 350);

    return () => {
      controller.abort();
      window.clearTimeout(debounceTimer);
    };
  }, [destination, origin]);

  useEffect(() => clearAllTimers, [clearAllTimers]);

  return {
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
  };
}
