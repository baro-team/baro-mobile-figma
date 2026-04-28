import { FormEvent } from "react";
import { Circle, Dot } from "lucide-react";
import { RideSheetSection } from "./RideSheetSection";

type BookingPanelProps = {
  origin: string;
  destination: string;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onRequestRide: () => void;
};

export function BookingPanel({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onRequestRide,
}: BookingPanelProps) {
  const canRequestRide = Boolean(origin && destination);

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
