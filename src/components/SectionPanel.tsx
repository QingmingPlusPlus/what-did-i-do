import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface SectionPanelProps {
  step: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function SectionPanel({
  step,
  title,
  action,
  children,
  className,
}: SectionPanelProps) {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-blue-500 bg-blue-50 text-sm font-semibold text-blue-600">
            {step}
          </span>
          <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}
