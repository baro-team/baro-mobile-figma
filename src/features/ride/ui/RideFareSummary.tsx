type RideFareSummaryProps = {
  formattedEstimatedCost: string;
};

export function RideFareSummary({
  formattedEstimatedCost,
}: RideFareSummaryProps) {
  return (
    <div className="ds-card flex flex-1 flex-row justify-between items-center border-t px-4 py-3">
      <p className="type-label ds-text-secondary">요금</p>
      <p className="type-display text-cyan-400">{formattedEstimatedCost}</p>
    </div>
  );
}
