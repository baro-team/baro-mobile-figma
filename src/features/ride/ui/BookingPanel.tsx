import { FormEvent } from "react";
import { Circle, Dot } from "lucide-react";
import { PreDispatchPreview } from "../model/ride-types";
import { RideRouteSummary } from "./RideRouteSummary";
import { RideSheetSection } from "./RideSheetSection";

type BookingPanelProps = {
  origin: string;
  destination: string;
  preDispatchPreview: PreDispatchPreview | null;
  isPreDispatchLoading: boolean;
  preDispatchError: string | null;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onRequestRide: () => void;
};

export function BookingPanel({
  origin,
  destination,
  preDispatchPreview,
  isPreDispatchLoading,
  preDispatchError,
  onOriginChange,
  onDestinationChange,
  onRequestRide,
}: BookingPanelProps) {
  const canRequestRide = Boolean(origin && destination && preDispatchPreview);
  const shouldShowPreviewSection = Boolean(
    origin.trim() && destination.trim(),
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

    onRequestRide();
  };

  return (
    <form onSubmit={handleSubmit}>
      <RideSheetSection>
        <div className="flex flex-col gap-3">
          <div className="relative">
            <div className="ds-text-primary absolute top-1/2 left-4 -translate-y-1/2">
              <Circle className="w-2 h-2" />
            </div>
            <input
              type="text"
              placeholder="출발지"
              value={origin}
              onChange={(e) => onOriginChange(e.target.value)}
              className="type-label ds-input ds-text-primary w-full pl-10 pr-3 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

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
        배차 요청
      </button>
    </form>
  );
}
