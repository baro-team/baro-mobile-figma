import { Car, X } from "lucide-react";
import { motion } from "motion/react";

type RideCompletedOverlayProps = {
  visible: boolean;
  onConfirm: () => void;
};

export function RideCompletedOverlay({
  visible,
  onConfirm,
}: RideCompletedOverlayProps) {
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

          <button
            onClick={onConfirm}
            className="absolute top-5 right-5 flex size-10 items-center justify-center ds-radius-badge ds-surface-muted ds-shadow-soft ds-text-secondary hover:[color:var(--color-text-primary)] transition-colors"
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
              className="ds-icon-badge inline-block p-3 mb-3"
            >
              <Car className="w-6 h-6 text-white" />
            </motion.div>
            <h3 className="type-title ds-text-primary mb-1">
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
              onClick={onConfirm}
              className="type-button ds-button-primary w-full"
            >
              확인
            </button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
