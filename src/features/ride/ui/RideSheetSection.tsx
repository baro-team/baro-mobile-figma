import { ReactNode } from "react";

type RideSheetSectionProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
};

export function RideSheetSection({
  children,
  title,
  subtitle,
}: RideSheetSectionProps) {
  return (
    <section>
      {title || subtitle ? (
        <div className="mb-4">
          {title ? <h3 className="type-body-strong text-gray-900">{title}</h3> : null}
          {subtitle ? <p className="type-label mt-1 text-gray-500">{subtitle}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
