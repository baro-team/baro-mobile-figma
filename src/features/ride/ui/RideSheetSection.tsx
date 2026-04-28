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
          {title ? <h3 className="type-body-strong ds-text-primary">{title}</h3> : null}
          {subtitle ? <p className="type-label ds-text-secondary mt-1">{subtitle}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
