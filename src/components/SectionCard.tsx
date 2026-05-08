import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionCardProps {
  number: number;
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function SectionCard({ number, title, children, action, className }: SectionCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-5", className)}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-[10px] font-semibold text-primary-foreground">
            {number}
          </span>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
