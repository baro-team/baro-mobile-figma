type RideFareSummaryProps = {
  formattedEstimatedCost: string;
};

export function RideFareSummary({
  formattedEstimatedCost,
}: RideFareSummaryProps) {
  return (
    <div className="ds-divider-row mx-3 px-4 py-4">
      <p className="type-label ds-text-secondary">요금</p>
      <p className="type-display text-cyan-400">{formattedEstimatedCost}</p>
    </div>
  );
}
