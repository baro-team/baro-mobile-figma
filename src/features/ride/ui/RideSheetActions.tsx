import { ReactNode } from "react";

type RideSheetActionsProps = {
  children: ReactNode;
};

export function RideSheetActions({ children }: RideSheetActionsProps) {
  return (
    <div className="mt-5 flex gap-3 border-t border-gray-100 pt-4">
      {children}
    </div>
  );
}
