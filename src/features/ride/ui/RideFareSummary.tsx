type RideFareSummaryProps = {
  formattedEstimatedCost: string;
};

export function RideFareSummary({
  formattedEstimatedCost,
}: RideFareSummaryProps) {
  return (
    <div className="flex flex-1 flex-row justify-between items-center bg-white px-4 py-3 border-t border-gray-200">
      <p className="type-label text-gray-500">요금</p>
      <p className="type-display text-cyan-400">{formattedEstimatedCost}</p>
    </div>
  );
}
