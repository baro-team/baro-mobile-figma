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
    <section className="rounded-3xl border border-gray-100 bg-gray-50/70 px-4 py-4 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset]">
      {title || subtitle ? (
        <div className="mb-3">
          {title ? <h3 className="text-base font-semibold text-gray-900">{title}</h3> : null}
          {subtitle ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
