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
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-cyan-400">
              <Circle className="w-2 h-2" />
            </div>
            <input
              type="text"
              placeholder="출발지"
              value={origin}
              onChange={(e) => onOriginChange(e.target.value)}
              className="type-label w-full border border-transparent pl-10 pr-3 py-3.5 bg-gray-50 rounded-md text-gray-900 placeholder:text-gray-400 outline-none focus:border-cyan-400 focus:bg-white focus:shadow-[0_0_0_2px_rgba(34,211,238,0.18)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
              className="type-label w-full border border-transparent pl-10 pr-3 py-3.5 bg-gray-50 rounded-md text-gray-900 placeholder:text-gray-400 outline-none focus:border-cyan-400 focus:bg-white focus:shadow-[0_0_0_2px_rgba(34,211,238,0.18)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            />
          </div>
        </div>
      </RideSheetSection>

      <button
        type="submit"
        disabled={!canRequestRide}
        className="type-button mt-5 w-full py-3.5 bg-cyan-400 hover:bg-cyan-500 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-md active:scale-[0.99] transition-all shadow-sm disabled:shadow-none"
      >
        배차 요청
      </button>
    </form>
  );
}
