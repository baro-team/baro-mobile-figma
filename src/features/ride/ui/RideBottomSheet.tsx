import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { BookingPanel } from "./BookingPanel";
import { PreDispatchPreview } from "../model/pre-dispatch-types";
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
  onRequestPreview: () => void;
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
  onRequestPreview,
  onRequestRide,
  onCancelRide,
}: RideBottomSheetProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    startY: number;
    startHeight: number;
  } | null>(null);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const [sheetHeight, setSheetHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const arrivalTime = `13:${String(eta).padStart(2, "0")}`;
  const formattedEstimatedCost =
    estimatedCost !== null ? `₩${estimatedCost.toLocaleString("ko-KR")}` : "-";
  const contentPaddingBottom = isKeyboardOpen
    ? "1.5rem"
    : "calc(1.5rem + var(--safe-area-bottom))";
  const collapsedHeight = 110;

  const clampHeight = (nextHeight: number, nextExpandedHeight = expandedHeight) =>
    Math.min(Math.max(nextHeight, collapsedHeight), nextExpandedHeight);

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

  useLayoutEffect(() => {
    if (!contentRef.current) {
      return;
    }

    const nextExpandedHeight = Math.max(
      contentRef.current.scrollHeight + 28,
      collapsedHeight,
    );

    setExpandedHeight(nextExpandedHeight);
    setSheetHeight((currentHeight) => {
      if (!currentHeight || currentHeight >= nextExpandedHeight - 8 || isKeyboardOpen) {
        return nextExpandedHeight;
      }

      return clampHeight(currentHeight, nextExpandedHeight);
    });
  }, [
    collapsedHeight,
    destination,
    estimatedCost,
    expandedHeight,
    isDragging,
    isKeyboardOpen,
    origin,
    preDispatchPreview,
    rideState,
    searchRadius,
    selectedDestination,
    selectedOrigin,
  ]);

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
      const midpoint = (expandedHeight + collapsedHeight) / 2;
      setSheetHeight((currentHeight) =>
        currentHeight < midpoint ? collapsedHeight : expandedHeight,
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
  }, [collapsedHeight, expandedHeight, isDragging]);

  const handleDragStart = (event: React.PointerEvent<HTMLButtonElement>) => {
    dragStateRef.current = {
      startY: event.clientY,
      startHeight: sheetHeight || expandedHeight,
    };
    setIsDragging(true);
  };

  return (
    <motion.div
      animate={{ height: sheetHeight || expandedHeight || collapsedHeight }}
      transition={isDragging ? { duration: 0 } : { type: "spring", damping: 28, stiffness: 260 }}
      className="ds-sheet-panel w-full max-w-md mx-auto relative flex shrink-0 flex-col overflow-hidden"
    >
      <button
        type="button"
        onPointerDown={handleDragStart}
        className="flex shrink-0 cursor-grab touch-none items-center justify-center py-3 active:cursor-grabbing"
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
