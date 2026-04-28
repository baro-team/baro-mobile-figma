import { ReactNode } from "react";

type RideSheetPanelProps = {
  header?: ReactNode;
  children: ReactNode;
  actions?: ReactNode;
};

export function RideSheetPanel({
  header,
  children,
  actions,
}: RideSheetPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      {header ? <div>{header}</div> : null}
      <div>{children}</div>
      {actions ? <div>{actions}</div> : null}
    </div>
  );
}
