import { Car, Circle, Dot } from "lucide-react";
import { RideState } from "../model/ride-machine";

type RideBottomSheetProps = {
  rideState: RideState;
  origin: string;
  destination: string;
  eta: number;
  searchRadius: number;
  estimatedCost: number | null;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onRequestRide: () => void;
  onCancelRide: () => void;
};

export function RideBottomSheet({
  rideState,
  origin,
  destination,
  eta,
  searchRadius,
  estimatedCost,
  onOriginChange,
  onDestinationChange,
  onRequestRide,
  onCancelRide,
}: RideBottomSheetProps) {
  const arrivalTime = `13:${String(eta).padStart(2, "0")}`;
  const formattedEstimatedCost =
    estimatedCost !== null ? `₩${estimatedCost.toLocaleString("ko-KR")}` : "-";

  return (
    <div className="w-full h-max flex flex-col bg-white max-w-md mx-auto relative shadow-2xl">
      <div className="w-12 h-1 bg-gray-300 mx-auto mt-3 mb-4"></div>

      <div className="px-5 pb-6">
        {rideState === "booking" && (
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
        )}

        {rideState === "pending" && (
          <>
            <div className="relative p-1 bg-gray-50 rounded-md mb-3">
              <div className="flex items-center">
                <Dot className="w-10 h-10 text-black" />
                <p className="text-gray-700 text-base">{origin}</p>
              </div>
              <div className="flex items-center">
                <Dot className="w-10 h-10 text-cyan-400" />
                <p className="text-gray-700 text-base">{destination}</p>
              </div>
            </div>
            <div className="top-3 flex flex-col items-center gap-3 mb-4 p-3 text-center">
              <div className="p-2.5 bg-cyan-400 rounded-full animate-pulse shadow-sm">
                <Car className="w-5 h-5 text-white" />
              </div>

              <p className="text-gray-900 font-medium text-lg mb-2">
                {searchRadius}km 반경 안의 차량 찾는중...
              </p>
              <div className="flex justify-center mb-4">
                <div className="flex gap-1.5">
                  <div
                    className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>

            <button
              onClick={onCancelRide}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 rounded-md transition-all text-lg"
            >
              취소
            </button>
          </>
        )}

        {rideState === "matched" && (
          <div className="flex flex-col ">
            <div className="flex flex-row items-center gap-1.5 mb-4">
              <p className="text-gray-900 font-bold text-xl">{arrivalTime}</p>
              <p className="text-gray-500"> 도착 예정 </p>
            </div>
            <div className="p-5 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full p-2.5 bg-cyan-400 flex items-center justify-center shadow-sm">
                  <Car className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold text-lg">123가 1234</p>
                </div>
              </div>
            </div>

            <div className="relative p-3">
              <div className="flex items-center">
                <Dot className="w-10 h-10 text-black" />
                <p className="text-gray-700 text-base">{origin}</p>
              </div>
              <div className="flex items-center">
                <Dot className="w-10 h-10 text-cyan-400" />
                <p className="text-gray-700 text-base">{destination}</p>
              </div>
              <div className="relative top-1 flex flex-1 flex-row justify-between items-center bg-white px-4 py-3 border-t border-gray-200">
                <p className="text-gray-500">요금</p>
                <p className="text-cyan-400 font-bold text-xl">{formattedEstimatedCost}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCancelRide}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 rounded-md transition-all text-lg"
              >
                배차 취소
              </button>
            </div>
          </div>
        )}

        {rideState === "riding" && (
          <div className="flex flex-col">
            <div className="p-5 rounded-md">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-gray-900 font-semibold text-lg">차량 A-7492</p>
                </div>
                <div className="px-3 py-2 bg-cyan-400 rounded-full">
                  <p className="text-white text-xs font-semibold">운행중</p>
                </div>
              </div>

              <div className="relative p-1 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <Dot className="w-10 h-10 text-black" />
                  <p className="text-gray-700 text-base">{origin}</p>
                </div>
                <div className="flex items-center">
                  <Dot className="w-10 h-10 text-cyan-400" />
                  <p className="text-gray-700 text-base">{destination}</p>
                </div>
              </div>
            </div>

            <div className="relative top-1 flex flex-1 flex-row justify-between items-center bg-white px-4 py-3 border-t border-gray-200">
              <p className="text-gray-500">요금</p>
              <p className="text-cyan-400 font-bold text-xl">{formattedEstimatedCost}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
