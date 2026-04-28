import { FormEvent } from "react";
import { Dot } from "lucide-react";
import { PlaceSearchResult, PreDispatchPreview, RideLocation } from "../model/ride-types";
import { RideRouteSummary } from "./RideRouteSummary";
import { RideSheetSection } from "./RideSheetSection";

type BookingPanelProps = {
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
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onOriginSelect: (place: PlaceSearchResult) => void;
  onDestinationSelect: (place: PlaceSearchResult) => void;
  onRequestPreview: () => void;
  onRequestRide: () => void;
};

export function BookingPanel({
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
  onOriginChange,
  onDestinationChange,
  onOriginSelect,
  onDestinationSelect,
  onRequestPreview,
  onRequestRide,
}: BookingPanelProps) {
  const canRequestRide = Boolean(selectedOrigin && selectedDestination);
  const shouldShowPreviewSection = Boolean(
    selectedOrigin && selectedDestination,
  );

  const previewRows = preDispatchPreview
    ? [
        {
          label: "예상 시간",
          value: `${preDispatchPreview.estimatedTime}분`,
        },
        {
          label: "이동 거리",
          value: `${preDispatchPreview.distanceKm.toFixed(1)}km`,
        },
        {
          label: "예상 요금",
          value: `₩${preDispatchPreview.fare.toLocaleString("ko-KR")}`,
          highlight: true,
        },
      ]
    : [];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canRequestRide) {
      return;
    }

    if (preDispatchPreview) {
      onRequestRide();
      return;
    }

    onRequestPreview();
  };

  const renderPlaceSearchList = ({
    results,
    isLoading,
    error,
    onSelect,
  }: {
    results: PlaceSearchResult[];
    isLoading: boolean;
    error: string | null;
    onSelect: (place: PlaceSearchResult) => void;
  }) => {
    if (isLoading) {
      return (
        <div className="ds-route-surface mt-2 overflow-hidden">
          <p className="type-label ds-text-secondary px-4 py-3">
            장소 검색 중...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="ds-route-surface mt-2 overflow-hidden">
          <p className="type-label px-4 py-3 text-red-500">{error}</p>
        </div>
      );
    }

    if (results.length === 0) {
      return null;
    }

    return (
      <div className="ds-route-surface mt-2 overflow-hidden">
        {results.map((place) => (
          <button
            key={`${place.name}-${place.lat}-${place.lon}`}
            type="button"
            onClick={() => onSelect(place)}
            className="flex w-full flex-col items-start gap-1 border-t border-[var(--color-border-subtle)] px-4 py-3 text-left first:border-t-0"
          >
            <p className="type-label-strong ds-text-primary">{place.name}</p>
            <p className="type-caption ds-text-secondary">
              {place.roadAddressName || place.addressName}
            </p>
            <p className="type-caption ds-text-secondary">
              {place.lat.toFixed(6)}, {place.lon.toFixed(6)}
            </p>
          </button>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <RideSheetSection>
        <div className="flex flex-col gap-3">
          <div>
            <div className="relative">
              <div className="ds-text-primary absolute top-1/2 left-4 -translate-y-1/2">
                <div className="h-2.5 w-2.5 rounded-full bg-[currentColor]" />
              </div>
              <input
                type="text"
                placeholder="출발지"
                value={origin}
                onChange={(e) => onOriginChange(e.target.value)}
                className="type-label ds-input ds-text-primary w-full pl-10 pr-3 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            {selectedOrigin ? (
              <p className="type-caption ds-text-secondary mt-2 px-1">
                선택 좌표: {selectedOrigin.lat.toFixed(6)},{" "}
                {selectedOrigin.lon.toFixed(6)}
              </p>
            ) : null}
            {renderPlaceSearchList({
              results: originSearchResults,
              isLoading: isOriginSearchLoading,
              error: originSearchError,
              onSelect: onOriginSelect,
            })}
          </div>

          <div>
            <div className="relative">
              <div className="absolute top-1/2 -translate-y-1/2 text-cyan-400">
                <Dot className="w-10 h-10" />
              </div>
              <input
                type="text"
                placeholder="목적지"
                value={destination}
                onChange={(e) => onDestinationChange(e.target.value)}
                className="type-label ds-input ds-text-primary w-full pl-10 pr-3 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            {selectedDestination ? (
              <p className="type-caption ds-text-secondary mt-2 px-1">
                선택 좌표: {selectedDestination.lat.toFixed(6)},{" "}
                {selectedDestination.lon.toFixed(6)}
              </p>
            ) : null}
            {renderPlaceSearchList({
              results: destinationSearchResults,
              isLoading: isDestinationSearchLoading,
              error: destinationSearchError,
              onSelect: onDestinationSelect,
            })}
          </div>
        </div>
      </RideSheetSection>

      {shouldShowPreviewSection ? (
        <RideSheetSection title="사전 배차 예상" subtitle="배차 전 예상 경로와 요금을 먼저 확인할 수 있습니다.">
          <div className="mt-5">
            <RideRouteSummary
              origin={origin}
              destination={destination}
              compact
            />
          </div>

          <div className="mt-4">
            {isPreDispatchLoading ? (
              <div className="ds-route-surface px-4 py-4">
                <p className="type-label ds-text-secondary">
                  예상 정보 계산 중...
                </p>
              </div>
            ) : null}

            {!isPreDispatchLoading && preDispatchError ? (
              <div className="ds-route-surface px-4 py-4">
                <p className="type-label text-red-500">{preDispatchError}</p>
              </div>
            ) : null}

            {!isPreDispatchLoading && preDispatchPreview ? (
              <div className="ds-route-surface overflow-hidden">
                {previewRows.map((row) => (
                  <div
                    key={row.label}
                    className="ds-divider-row px-4 py-3 first:border-t-0"
                  >
                    <p className="type-label ds-text-secondary">{row.label}</p>
                    <p
                      className={
                        row.highlight
                          ? "type-title text-cyan-400"
                          : "type-title ds-text-primary"
                      }
                    >
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </RideSheetSection>
      ) : null}

      <button
        type="submit"
        disabled={!canRequestRide}
        className="type-button ds-button-primary mt-5 w-full"
      >
        {preDispatchPreview ? "배차 요청" : "예상 경로 보기"}
      </button>
    </form>
  );
}
