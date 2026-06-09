import { ReactNode } from "react";

type RideSheetActionsProps = {
  children: ReactNode;
};

export function RideSheetActions({ children }: RideSheetActionsProps) {
  return (
    <div className="mt-4 flex gap-3 pb-0.5">
      {children}
    </div>
  );
}
