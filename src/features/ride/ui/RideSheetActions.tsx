import { ReactNode } from "react";

type RideSheetActionsProps = {
  children: ReactNode;
};

export function RideSheetActions({ children }: RideSheetActionsProps) {
  return (
    <div className="mt-4 flex gap-3">
      {children}
    </div>
  );
}
