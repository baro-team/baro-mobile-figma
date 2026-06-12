import { useCallback, useEffect, useRef, useState } from "react";
import { requestDispatch } from "../lib/dispatch-api";
import { openVehicleLocationStream } from "../lib/vehicle-location-stream";
import { searchPlacesByKeyword } from "../lib/place-search-api";
import { requestPreDispatch } from "../lib/pre-dispatch-api";
import { RideState, transitionRideState } from "../model/ride-machine";
import {
  DispatchResult,
  PreDispatchPreview,
} from "../model/pre-dispatch-types";
import {
  PlaceSearchResult,
  RideLocation,
  VehicleLocation,
} from "../model/ride-location";

type TimerId = ReturnType<typeof setTimeout>;

export function useRideFlow(accessToken: string) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedOrigin, setSelectedOrigin] = useState<RideLocation | null>(null);
  const [selectedDestination, setSelectedDestination] =
    useState<RideLocation | null>(null);
  const [originSearchResults, setOriginSearchResults] = useState<
    PlaceSearchResult[]
  >([]);
  const [destinationSearchResults, setDestinationSearchResults] = useState<
    PlaceSearchResult[]
  >([]);
  const [isOriginSearchLoading, setIsOriginSearchLoading] = useState(false);
  const [isDestinationSearchLoading, setIsDestinationSearchLoading] =
    useState(false);
  const [originSearchError, setOriginSearchError] = useState<string | null>(null);
  const [destinationSearchError, setDestinationSearchError] = useState<
    string | null
  >(null);
  const [preDispatchPreview, setPreDispatchPreview] =
    useState<PreDispatchPreview | null>(null);
  const [isPreDispatchLoading, setIsPreDispatchLoading] = useState(false);
  const [preDispatchError, setPreDispatchError] = useState<string | null>(null);
  const [dispatchResult, setDispatchResult] = useState<DispatchResult | null>(
    null,
  );
  const [isDispatchLoading, setIsDispatchLoading] = useState(false);
  const [dispatchError, setDispatchError] = useState<string | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [rideState, setRideState] = useState<RideState>("booking");
  const [eta, setEta] = useState(5);
  const [searchRadius, setSearchRadius] = useState(5);
  const [showCarOverlay, setShowCarOverlay] = useState(false);
  const [vehicleLocation, setVehicleLocation] = useState<VehicleLocation | null>(null);

  const timersRef = useRef<TimerId[]>([]);
  const closeVehicleStreamRef = useRef<(() => void) | null>(null);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const clearVehicleStream = useCallback(() => {
    closeVehicleStreamRef.current?.();
    closeVehicleStreamRef.current = null;
  }, []);

  const schedule = useCallback((callback: () => void, delayMs: number) => {
    const timer = setTimeout(callback, delayMs);
    timersRef.current.push(timer);
    return timer;
  }, []);

  const requestRide = useCallback(async () => {
    if (!selectedOrigin || !selectedDestination || !preDispatchPreview) {
      return;
    }

    try {
      setIsDispatchLoading(true);
      setDispatchError(null);

      const nextDispatchResult = await requestDispatch({
        request_id: preDispatchPreview.requestId,
      }, accessToken);

      setDispatchResult(nextDispatchResult);

      clearAllTimers();
      clearVehicleStream();

      setEstimatedCost(nextDispatchResult.fare);
      setEta(
        nextDispatchResult.estimatedPickupTime ??
          preDispatchPreview.estimatedTime,
      );
      setRideState((current) => transitionRideState(current, "REQUEST_RIDE"));
      setSearchRadius(5);

      schedule(() => setSearchRadius(10), 1000);
      schedule(() => setSearchRadius(20), 3000);
      setRideState((current) => transitionRideState(current, "CAR_MATCHED"));
      setVehicleLocation(null);
      setShowCarOverlay(false);

      closeVehicleStreamRef.current = openVehicleLocationStream(
        nextDispatchResult.dispatchId,
        accessToken,
        {
          onMessage: (location) => {
            setVehicleLocation(location);

            const phase = `${location.phase ?? ""} ${location.status ?? ""}`.toLowerCase();
            if (phase.includes("pickup") && phase.includes("arriv")) {
              setShowCarOverlay(true);
            }
            if (
              phase.includes("destination") ||
              phase.includes("dropoff") ||
              phase.includes("complete")
            ) {
              setShowCarOverlay(false);
              setRideState((current) =>
                transitionRideState(current, "COMPLETE_RIDE"),
              );
              clearVehicleStream();
            }
          },
        },
      );
    } catch (error) {
      setDispatchResult(null);
      setDispatchError(
        error instanceof Error ? error.message : "배차 요청에 실패했습니다.",
      );
    } finally {
      setIsDispatchLoading(false);
    }
  }, [
    clearAllTimers,
    clearVehicleStream,
    preDispatchPreview,
    schedule,
    selectedDestination,
    selectedOrigin,
    accessToken,
  ]);

  const requestPreDispatchPreview = useCallback(async () => {
    if (!selectedOrigin || !selectedDestination) {
      return;
    }

    try {
      setIsPreDispatchLoading(true);
      setPreDispatchError(null);

      const preview = await requestPreDispatch({
        origin: selectedOrigin,
        destination: selectedDestination,
      }, accessToken);

      setPreDispatchPreview(preview);
    } catch (error) {
      setPreDispatchPreview(null);
      setPreDispatchError(
        error instanceof Error
          ? error.message
          : "사전 배차 예상 정보를 불러오지 못했습니다.",
      );
    } finally {
      setIsPreDispatchLoading(false);
    }
  }, [accessToken, selectedDestination, selectedOrigin]);

  const handleOriginChange = useCallback((value: string) => {
    setOrigin(value);
    setSelectedOrigin((current) =>
      current?.name === value ? current : null,
    );
    setOriginSearchError(null);
    setPreDispatchPreview(null);
    setPreDispatchError(null);
    setDispatchResult(null);
    setDispatchError(null);
  }, []);

  const handleDestinationChange = useCallback((value: string) => {
    setDestination(value);
    setSelectedDestination((current) =>
      current?.name === value ? current : null,
    );
    setDestinationSearchError(null);
    setPreDispatchPreview(null);
    setPreDispatchError(null);
    setDispatchResult(null);
    setDispatchError(null);
  }, []);

  const selectOriginPlace = useCallback((place: PlaceSearchResult) => {
    setOrigin(place.name);
    setSelectedOrigin(place);
    setOriginSearchResults([]);
    setOriginSearchError(null);
  }, []);

  const selectDestinationPlace = useCallback((place: PlaceSearchResult) => {
    setDestination(place.name);
    setSelectedDestination(place);
    setDestinationSearchResults([]);
    setDestinationSearchError(null);
  }, []);

  const openDoor = useCallback(() => {
    setShowCarOverlay(false);
    setRideState((current) => transitionRideState(current, "OPEN_DOOR"));
    clearAllTimers();
  }, [clearAllTimers]);

  const resetToBooking = useCallback(() => {
    clearAllTimers();
    clearVehicleStream();
    setRideState((current) => transitionRideState(current, "RESET_TO_BOOKING"));
    setShowCarOverlay(false);
    setVehicleLocation(null);
  }, [clearAllTimers, clearVehicleStream]);

  const cancelRide = useCallback(() => {
    clearAllTimers();
    clearVehicleStream();
    setRideState((current) => transitionRideState(current, "RESET_TO_BOOKING"));
    setEstimatedCost(null);
    setOrigin("");
    setDestination("");
    setSelectedOrigin(null);
    setSelectedDestination(null);
    setOriginSearchResults([]);
    setDestinationSearchResults([]);
    setOriginSearchError(null);
    setDestinationSearchError(null);
    setPreDispatchPreview(null);
    setPreDispatchError(null);
    setDispatchResult(null);
    setDispatchError(null);
    setSearchRadius(5);
    setShowCarOverlay(false);
    setVehicleLocation(null);
  }, [clearAllTimers, clearVehicleStream]);

  useEffect(() => {
    if (selectedOrigin && selectedDestination) {
      return;
    }

    setPreDispatchPreview(null);
    setPreDispatchError(null);
    setIsPreDispatchLoading(false);
    setDispatchResult(null);
    setDispatchError(null);
  }, [selectedDestination, selectedOrigin]);

  useEffect(() => {
    const trimmedOrigin = origin.trim();

    if (!trimmedOrigin) {
      setOriginSearchResults([]);
      setOriginSearchError(null);
      setIsOriginSearchLoading(false);
      return;
    }

    if (selectedOrigin?.name === origin) {
      return;
    }

    const debounceTimer = window.setTimeout(async () => {
      try {
        setIsOriginSearchLoading(true);
        setOriginSearchError(null);
        const results = await searchPlacesByKeyword(trimmedOrigin);
        setOriginSearchResults(results);
      } catch (error) {
        setOriginSearchResults([]);
        setOriginSearchError(
          error instanceof Error ? error.message : "출발지 검색에 실패했습니다.",
        );
      } finally {
        setIsOriginSearchLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(debounceTimer);
    };
  }, [origin, selectedOrigin]);

  useEffect(() => {
    const trimmedDestination = destination.trim();

    if (!trimmedDestination) {
      setDestinationSearchResults([]);
      setDestinationSearchError(null);
      setIsDestinationSearchLoading(false);
      return;
    }

    if (selectedDestination?.name === destination) {
      return;
    }

    const debounceTimer = window.setTimeout(async () => {
      try {
        setIsDestinationSearchLoading(true);
        setDestinationSearchError(null);
        const results = await searchPlacesByKeyword(trimmedDestination);
        setDestinationSearchResults(results);
      } catch (error) {
        setDestinationSearchResults([]);
        setDestinationSearchError(
          error instanceof Error ? error.message : "목적지 검색에 실패했습니다.",
        );
      } finally {
        setIsDestinationSearchLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(debounceTimer);
    };
  }, [destination, selectedDestination]);

  useEffect(() => clearAllTimers, [clearAllTimers]);
  useEffect(() => clearVehicleStream, [clearVehicleStream]);

  return {
    origin,
    setOrigin: handleOriginChange,
    destination,
    setDestination: handleDestinationChange,
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
    isDispatchLoading,
    dispatchError,
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
  };
}
