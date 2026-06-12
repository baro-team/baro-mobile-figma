import { motion } from "motion/react";
import { DispatchResult } from "../model/pre-dispatch-types";

type CarArrivedOverlayProps = {
  visible: boolean;
  dispatchResult: DispatchResult | null;
  onOpenDoor: () => void;
};

export function CarArrivedOverlay({
  visible,
  dispatchResult,
  onOpenDoor,
}: CarArrivedOverlayProps) {
  if (!visible) {
    return null;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="ds-overlay-scrim absolute inset-0 z-40"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 300,
        }}
        className="ds-sheet-panel absolute bottom-0 left-0 right-0 z-50 backdrop-blur-xl"
      >
        <div className="relative p-5 pb-8">
          <div className="ds-sheet-handle mb-5 mt-0"></div>
          <h3 className="type-title ds-text-primary text-center mb-3">
            차량이 도착했습니다!
          </h3>
          <div className="relative mb-5">
            <div className="ds-radius-control relative w-full h-40 overflow-hidden">
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

                    <circle cx="25" cy="42" r="3" fill="#fbbf24" opacity="0.9" />
                    <circle cx="135" cy="42" r="3" fill="#ef4444" opacity="0.9" />

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
                    <linearGradient id="carGradient" x1="30" y1="25" x2="130" y2="60">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                    <linearGradient id="carGradient2" x1="20" y1="35" x2="140" y2="55">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <linearGradient id="wheelGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur" />
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
              <span className="type-label ds-text-secondary">차량번호</span>
              <span className="type-label-strong ds-text-primary">
                {dispatchResult?.carNumber ?? "확인 중"}
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
              onClick={onOpenDoor}
              className="type-button ds-button-primary w-full"
            >
              잠금 해제
            </button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
