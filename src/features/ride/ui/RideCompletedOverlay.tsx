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
        className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40"
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
            onClick={onConfirm}
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
            <h3 className="type-title text-gray-900 mb-1">
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
              className="type-button w-full py-3.5 bg-cyan-400 hover:bg-cyan-500 text-white rounded-md active:scale-95 transition-all shadow-sm"
            >
              확인
            </button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
