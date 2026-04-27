import { useState } from "react";
import {
  MapPin,
  Navigation,
  Navigation2,
  Menu,
  Car,
  Clock,
  User,
  X,
  Dot,
  Circle,
} from "lucide-react";
import { motion } from "motion/react";

type RideState = "booking" | "pending" | "matched" | "riding" | "completed";

export default function App() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [estimatedCost, setEstimatedCost] = useState<
    number | null
  >(null);
  const [rideState, setRideState] =
    useState<RideState>("booking");
  const [eta, setEta] = useState(5);
  const [searchRadius, setSearchRadius] = useState(5);
  const [showCarOverlay, setShowCarOverlay] = useState(false);
  const handleRequestRide = () => {
    if (origin && destination) {
      const mockCost = Math.floor(Math.random() * 20000) + 5000;
      setEstimatedCost(mockCost);
      setRideState("pending");
      setSearchRadius(5);

      setTimeout(() => {
        setSearchRadius(10);
      }, 1000);

      setTimeout(() => {
        setSearchRadius(20);
      }, 3000);

      // Simulate finding a car after 3 seconds
      setTimeout(() => {
        setRideState("matched");
        setEta(5);
      }, 4000);

      setTimeout(() => {
        setShowCarOverlay(true);
      }, 8000);
    }
  };

  const openDoor = () => {
    setShowCarOverlay(false);
    setRideState("riding");

    setTimeout(() => {
      setRideState("completed");
    }, 10000);
  };

  const confirmEndRide = () => {
    setRideState("booking");
  };
  
  const handleCancelRide = () => {
    setRideState("booking");
    setEstimatedCost(null);
    setOrigin("");
    setDestination("");
  };

  return (
    <div className="size-full bg-gray-50 flex flex-col overflow-hidden max-w-md mx-auto">
      {/* Map Area */}
      <div className="relative w-full h-full bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[20%] left-[30%] w-32 h-32 bg-cyan-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[30%] right-[20%] w-40 h-40 bg-cyan-400 rounded-full blur-3xl"></div>
          <div className="absolute top-[60%] left-[50%] w-36 h-36 bg-cyan-300 rounded-full blur-3xl"></div>
        </div>

        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-5">
          {Array.from({ length: 144 }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-300"
            ></div>
          ))}
        </div>

        {origin && (
          <div className="absolute top-[40%] left-[30%] flex flex-col items-center gap-2">
            <div className="p-3 bg-cyan-400 rounded-full shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-700 font-medium">
                출발
              </p>
            </div>
          </div>
        )}

        {destination && (
          <div className="absolute bottom-[30%] right-[25%] flex flex-col items-center gap-2">
            <div className="p-3 bg-cyan-500 rounded-full shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-700 font-medium">
                도착
              </p>
            </div>
          </div>
        )}

        {origin && destination && rideState !== "booking" && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient
                id="routeGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="#3b82f6"
                  stopOpacity="0.8"
                />
                <stop
                  offset="100%"
                  stopColor="#2563eb"
                  stopOpacity="0.8"
                />
              </linearGradient>
            </defs>
            <path
              d="M 30% 40% Q 55% 25%, 75% 70%"
              stroke="url(#routeGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10,5"
              className="animate-pulse"
            />
          </svg>
        )}

        {(rideState === "matched" ||
          rideState === "riding") && (
          <div className="absolute top-[35%] left-[45%] animate-pulse">
            <div className="p-2 bg-cyan-400 rounded-full shadow-lg">
              <Navigation className="w-5 h-5 text-white" />
            </div>
          </div>
        )}

        {rideState != "booking" && (
          <div className="absolute bottom-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-700 font-medium">
              13km
            </p>
          </div>
        )}
      </div>

      {/* Bottom sheet - Different content based on state */}
      <div className="w-full h-max flex flex-col bg-white max-w-md mx-auto relative shadow-2xl">
        <div className="w-12 h-1 bg-gray-300 mx-auto mt-3 mb-4"></div>

        <div className="px-5 pb-6">
          {/* Booking State */}
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
                    onChange={(e) => setOrigin(e.target.value)}
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
                    onChange={(e) =>
                      setDestination(e.target.value)
                    }
                    className="w-full pl-10 pr-3 py-3.5 bg-gray-50 rounded-md text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleRequestRide}
                disabled={!origin || !destination}
                className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-500 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-md active:scale-95 transition-all shadow-sm disabled:shadow-none"
              >
                배차 요청
              </button>
            </>
          )}

          {/* Searching State */}
          {rideState === "pending" && (
            <>
              <div className="relative p-1 bg-gray-50 rounded-md mb-3">
                <div className="flex items-center">
                  <Dot className="w-10 h-10 text-black" />
                  <p className="text-gray-700 text-base">
                    {origin}
                  </p>
                </div>
                <div className="flex items-center">
                  <Dot className="w-10 h-10 text-cyan-400" />
                  <p className="text-gray-700 text-base">
                    {destination}
                  </p>
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
                onClick={handleCancelRide}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 rounded-md transition-all text-lg"
              >
                취소
              </button>
            </>
          )}

          {/* Assigned State */}
          {rideState === "matched" && (
            <div className="flex flex-col ">
              <div className="flex flex-row items-center gap-1.5 mb-4">
                <p className="text-gray-900 font-bold text-xl">
                  13:0{eta}
                </p>
                <p className="text-gray-500"> 도착 예정 </p>
              </div>
              <div className="p-5 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full p-2.5 bg-cyan-400 flex items-center justify-center shadow-sm">
                    <Car className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold text-lg">
                      123가 1234
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative p-3">
                <div className="flex items-center">
                  <Dot className="w-10 h-10 text-black" />
                  <p className="text-gray-700 text-base">
                    {origin}
                  </p>
                </div>
                <div className="flex items-center">
                  <Dot className="w-10 h-10 text-cyan-400" />
                  <p className="text-gray-700 text-base">
                    {destination}
                  </p>
                </div>
                <div className="relative top-1 flex flex-1 flex-row justify-between items-center bg-white px-4 py-3 border-t border-gray-200">
                  <p className="text-gray-500">
                    요금 
                  </p>
                  <p className="text-cyan-400 font-bold text-xl">
                    ₩{estimatedCost?.toLocaleString("ko-KR")}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelRide}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-4 rounded-md transition-all text-lg"
                >
                  배차 취소
                </button>
              </div>
            </div>
          )}

          {/* Car Arrived for pickup ! */}
          {showCarOverlay && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40"
                onClick={() => setShowCarOverlay(false)}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{
                  type: "spring",
                  damping: 30,
                  stiffness: 300,
                }}
                className="absolute bottom-0 left-0 right-0 z-50 bg-white backdrop-blur-xl rounded-t-3xl border-t border-gray-200 shadow-2xl"
              >
                <div className="relative p-5 pb-8">
                  <div className="w-12 h-1 bg-gray-300 rounded-md mx-auto mb-5"></div>
                  <h3 className="text-lg text-center text-gray-900 font-semibold mb-3">
                    차량이 도착했습니다!
                  </h3>
                  <div className="relative mb-5">
                    <div className="relative w-full h-40 rounded-md overflow-hidden">

                      <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{
                          delay: 0.3,
                          duration: 0.8,
                        }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2"
                      >
                        <svg
                          width="160"
                          height="80"
                          viewBox="0 0 160 80"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g filter="url(#glow)">
                            <rect
                              x="30"
                              y="25"
                              width="100"
                              height="35"
                              rx="6"
                              fill="url(#carGradient)"
                            />
                            <rect
                              x="20"
                              y="35"
                              width="120"
                              height="20"
                              rx="4"
                              fill="url(#carGradient2)"
                            />

                            <circle
                              cx="45"
                              cy="58"
                              r="8"
                              fill="#f9fafb"
                              stroke="url(#wheelGradient)"
                              strokeWidth="3"
                            />
                            <circle
                              cx="115"
                              cy="58"
                              r="8"
                              fill="#f9fafb"
                              stroke="url(#wheelGradient)"
                              strokeWidth="3"
                            />

                            <rect
                              x="50"
                              y="30"
                              width="20"
                              height="15"
                              rx="2"
                              fill="#3b82f6"
                              opacity="0.5"
                            />
                            <rect
                              x="90"
                              y="30"
                              width="20"
                              height="15"
                              rx="2"
                              fill="#3b82f6"
                              opacity="0.5"
                            />

                            <circle
                              cx="25"
                              cy="42"
                              r="3"
                              fill="#fbbf24"
                              opacity="0.9"
                            />
                            <circle
                              cx="135"
                              cy="42"
                              r="3"
                              fill="#ef4444"
                              opacity="0.9"
                            />

                            <path
                              d="M35 38 L50 38"
                              stroke="#60a5fa"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              opacity="0.8"
                            />
                            <path
                              d="M110 38 L125 38"
                              stroke="#60a5fa"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              opacity="0.8"
                            />
                          </g>

                          <defs>
                            <linearGradient
                              id="carGradient"
                              x1="30"
                              y1="25"
                              x2="130"
                              y2="60"
                            >
                              <stop
                                offset="0%"
                                stopColor="#3b82f6"
                              />
                              <stop
                                offset="100%"
                                stopColor="#2563eb"
                              />
                            </linearGradient>
                            <linearGradient
                              id="carGradient2"
                              x1="20"
                              y1="35"
                              x2="140"
                              y2="55"
                            >
                              <stop
                                offset="0%"
                                stopColor="#60a5fa"
                              />
                              <stop
                                offset="100%"
                                stopColor="#3b82f6"
                              />
                            </linearGradient>
                            <linearGradient
                              id="wheelGradient"
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor="#3b82f6"
                              />
                              <stop
                                offset="100%"
                                stopColor="#2563eb"
                              />
                            </linearGradient>
                            <filter id="glow">
                              <feGaussianBlur
                                stdDeviation="2"
                                result="coloredBlur"
                              />
                              <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>
                        </svg>
                      </motion.div>
                    </div>
                  </div>
    
                  <div className="space-y-3 p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        차량ID
                      </span>
                      <span className="text-sm text-gray-900 font-medium font-semibold">
                        WX-1212
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        차량번호
                      </span>
                      <span className="text-sm text-gray-900 font-medium font-semibold">
                        123가 1234
                      </span>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4"
                  >
                    <button
                      onClick={openDoor}
                      className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-500 text-white font-semibold rounded-md active:scale-95 transition-all shadow-sm"
                    >
                      잠금 해제
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}

          {/* In Progress State */}
          {rideState === "riding" && (
            <div className="flex flex-col">
              <div className="p-5 rounded-md">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-gray-900 font-semibold text-lg">
                      차량 A-7492
                    </p>
                  </div>
                  <div className="px-3 py-2 bg-cyan-400 rounded-full">
                    <p className="text-white text-xs font-semibold">
                      운행중
                    </p>
                  </div>
                </div>

                <div className="relative p-1 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Dot className="w-10 h-10 text-black" />
                    <p className="text-gray-700 text-base">
                      {origin}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Dot className="w-10 h-10 text-cyan-400" />
                    <p className="text-gray-700 text-base">
                      {destination}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative top-1 flex flex-1 flex-row justify-between items-center bg-white px-4 py-3 border-t border-gray-200">
                <p className="text-gray-500">
                  요금 
                </p>
                <p className="text-cyan-400 font-bold text-xl">
                  ₩{estimatedCost?.toLocaleString("ko-KR")}
                </p>
              </div>
            </div>
          )}

          {rideState === "completed" && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40"
                onClick={() => setShowCarOverlay(false)}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{
                  type: "spring",
                  damping: 30,
                  stiffness: 300,
                }}
                className="absolute bottom-0 left-0 right-0 z-50 bg-white backdrop-blur-xl rounded-t-3xl border-t border-gray-200 shadow-2xl"
              >
                <div className="relative p-5 pb-8">
                  <div className="w-12 h-1 bg-gray-300 rounded-md mx-auto mb-5"></div>

                  <button
                    onClick={confirmEndRide}
                    className="absolute top-5 right-5 p-2 bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="text-center mb-5">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 300,
                      }}
                      className="inline-block p-3 bg-cyan-400 rounded-full mb-3 shadow-sm"
                    >
                      <Car className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-lg text-gray-900 font-semibold mb-1">
                      차량이 목적지에 도착했습니다!
                    </h3>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4"
                  >
                    <button
                      onClick={confirmEndRide}
                      className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-500 text-white font-semibold rounded-md active:scale-95 transition-all shadow-sm"
                    >
                      확인
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}