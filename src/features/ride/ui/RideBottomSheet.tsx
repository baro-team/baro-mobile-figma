import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { BookingPanel } from "./BookingPanel";
import { DispatchResult, PreDispatchPreview } from "../model/pre-dispatch-types";
import { PlaceSearchResult, RideLocation } from "../model/ride-location";
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
  dispatchResult: DispatchResult | null;
  isPreDispatchLoading: boolean;
  preDispatchError: string | null;
  isDispatchLoading: boolean;
  dispatchError: string | null;
  eta: number;
  searchRadius: number;
  estimatedCost: number | null;
  isKeyboardOpen: boolean;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onOriginSelect: (place: PlaceSearchResult) => void;
  onDestinationSelect: (place: PlaceSearchResult) => void;
  onRequestPreview: () => void;
  onRequestRide: () => void;
  onCancelRide: () => void;
  onHeightChange?: (height: number) => void;
};

const COLLAPSED_HEIGHT = 110;
const SHEET_VIEWPORT_MARGIN = 12;

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
  dispatchResult,
  isPreDispatchLoading,
  preDispatchError,
  isDispatchLoading,
  dispatchError,
  eta,
  searchRadius,
  estimatedCost,
  isKeyboardOpen,
  onOriginChange,
  onDestinationChange,
  onOriginSelect,
  onDestinationSelect,
  onRequestPreview,
  onRequestRide,
  onCancelRide,
  onHeightChange,
}: RideBottomSheetProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    startY: number;
    startHeight: number;
  } | null>(null);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const expandedHeightRef = useRef(expandedHeight);
  expandedHeightRef.current = expandedHeight;
  const [sheetHeight, setSheetHeight] = useState(0);
  const [maxSheetHeight, setMaxSheetHeight] = useState(COLLAPSED_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);
  const arrivalTime = dispatchResult?.estimatedPickupTime != null
    ? `${dispatchResult.estimatedPickupTime}분 후`
    : `${eta}분 후`;
  const formattedEstimatedCost =
    estimatedCost !== null ? `₩${estimatedCost.toLocaleString("ko-KR")}` : "-";
  const contentPaddingBottom = isKeyboardOpen
    ? "1.5rem"
    : "calc(1.5rem + var(--safe-area-bottom))";
  const clampHeight = useCallback(
    (nextHeight: number, nextExpandedHeight = expandedHeightRef.current) =>
      Math.min(
        Math.max(nextHeight, COLLAPSED_HEIGHT),
        Math.min(nextExpandedHeight, maxSheetHeight),
      ),
    [maxSheetHeight],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let cachedSafeAreaTop: number | null = null;

    const measureSafeAreaTop = () => {
      if (cachedSafeAreaTop !== null) {
        return cachedSafeAreaTop;
      }

      const probe = document.createElement("div");
      probe.style.position = "fixed";
      probe.style.visibility = "hidden";
      probe.style.pointerEvents = "none";
      probe.style.paddingTop = "env(safe-area-inset-top, 0px)";

      document.body.appendChild(probe);
      cachedSafeAreaTop = Number.parseFloat(getComputedStyle(probe).paddingTop) || 0;
      document.body.removeChild(probe);

      return cachedSafeAreaTop;
    };

    const updateMaxSheetHeight = () => {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const safeAreaTop = measureSafeAreaTop();

      setMaxSheetHeight(
        Math.max(COLLAPSED_HEIGHT, Math.floor(viewportHeight - safeAreaTop - SHEET_VIEWPORT_MARGIN)),
      );
    };

    const handleResize = () => {
      cachedSafeAreaTop = null;
      updateMaxSheetHeight();
    };

    updateMaxSheetHeight();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("scroll", updateMaxSheetHeight);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("scroll", updateMaxSheetHeight);
    };
  }, []);

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
            isDispatchLoading={isDispatchLoading}
            dispatchError={dispatchError}
            onOriginChange={onOriginChange}
            onDestinationChange={onDestinationChange}
            onOriginSelect={onOriginSelect}
            onDestinationSelect={onDestinationSelect}
            onRequestPreview={onRequestPreview}
            onRequestRide={onRequestRide}
          />
        );
      case "pending":
        return (
          <PendingPanel
            origin={origin}
            destination={destination}
            searchRadius={searchRadius}
            dispatchResult={dispatchResult}
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
            dispatchResult={dispatchResult}
            onCancelRide={onCancelRide}
          />
        );
      case "riding":
        return (
          <RidingPanel
            origin={origin}
            destination={destination}
            formattedEstimatedCost={formattedEstimatedCost}
            dispatchResult={dispatchResult}
          />
        );
      default:
        return null;
    }
  };

  useLayoutEffect(() => {
    if (!contentRef.current) {
      return;
    }

    const nextExpandedHeight = Math.min(
      Math.max(contentRef.current.scrollHeight + 28, COLLAPSED_HEIGHT),
      maxSheetHeight,
    );

    setExpandedHeight(nextExpandedHeight);
    setSheetHeight(nextExpandedHeight);
  }, [
    destination,
    estimatedCost,
    isKeyboardOpen,
    maxSheetHeight,
    origin,
    preDispatchPreview,
    isDispatchLoading,
    dispatchError,
    dispatchResult,
    rideState,
    searchRadius,
    selectedDestination,
    selectedOrigin,
  ]);

  useEffect(() => {
    onHeightChange?.(sheetHeight || expandedHeight || COLLAPSED_HEIGHT);
  }, [expandedHeight, onHeightChange, sheetHeight]);

  useEffect(() => {
    if (!isKeyboardOpen) {
      return;
    }

    setSheetHeight(expandedHeight);
  }, [expandedHeight, isKeyboardOpen]);

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragStateRef.current) {
        return;
      }

      const deltaY = event.clientY - dragStateRef.current.startY;
      const nextHeight = dragStateRef.current.startHeight - deltaY;
      setSheetHeight(clampHeight(nextHeight));
    };

    const handlePointerUp = () => {
      const midpoint = (expandedHeight + COLLAPSED_HEIGHT) / 2;
      setSheetHeight((currentHeight) =>
        currentHeight < midpoint ? COLLAPSED_HEIGHT : expandedHeight,
      );
      dragStateRef.current = null;
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [clampHeight, expandedHeight, isDragging]);

  const handleDragStart = (event: React.PointerEvent<HTMLButtonElement>) => {
    dragStateRef.current = {
      startY: event.clientY,
      startHeight: sheetHeight || expandedHeight,
    };
    setIsDragging(true);
  };

  return (
    <motion.div
      animate={{ height: sheetHeight || expandedHeight || COLLAPSED_HEIGHT }}
      transition={isDragging ? { duration: 0 } : { type: "spring", damping: 28, stiffness: 260 }}
      className="ds-sheet-panel app-mobile-frame relative flex shrink-0 flex-col overflow-hidden"
      style={{ maxHeight: maxSheetHeight }}
    >
      <button
        type="button"
        onPointerDown={handleDragStart}
        className="tap-target flex shrink-0 cursor-grab touch-none items-center justify-center py-3 active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-300"
        aria-label="바텀 시트 높이 조절"
      >
        <div className="ds-sheet-handle !my-0" />
      </button>

      <div
        ref={contentRef}
        className="px-5 pt-2"
        style={{ paddingBottom: contentPaddingBottom }}
      >
        {renderPanel()}
      </div>
    </motion.div>
  );
}
