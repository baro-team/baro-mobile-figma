import { Circle, Dot } from "lucide-react";

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
  return (
    <>
      <div className="flex flex-col gap-3 mb-5">
        <div className="relative">
          <div className="absolute top-1/2 left-4 -translate-y-1/2 text-cyan-400">
            <Circle className="w-2 h-2 text-cyan" />
          </div>
          <input
            type="text"
            placeholder="출발지"
            value={origin}
            onChange={(e) => onOriginChange(e.target.value)}
            className="w-full pl-10 pr-3 py-3.5 bg-gray-50 rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
        </div>

        <div className="relative">
          <div className="absolute top-1/2 -translate-y-1/2 text-cyan-400">
            <Dot className="w-10 h-10 text-cyan" />
          </div>
          <input
            type="text"
            placeholder="목적지"
            value={destination}
            onChange={(e) => onDestinationChange(e.target.value)}
            className="w-full pl-10 pr-3 py-3.5 bg-gray-50 rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
        </div>
      </div>

      <button
        onClick={onRequestRide}
        disabled={!origin || !destination}
        className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-md active:scale-95 transition-all shadow-sm disabled:shadow-none"
      >
        배차 요청
      </button>
    </>
  );
}
