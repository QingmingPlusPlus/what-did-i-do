import { SectionCard } from "./SectionCard";

interface TimeRangeSectionProps {
  mode: "today" | "custom";
  startDate: string;
  endDate: string;
  onModeChange: (mode: "today" | "custom") => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onQuickSelect: (days: number) => void;
}

export function TimeRangeSection({
  mode,
  startDate,
  endDate,
  onModeChange,
  onStartDateChange,
  onEndDateChange,
  onQuickSelect,
}: TimeRangeSectionProps) {
  return (
    <SectionCard number={4} title="时间范围" className="flex-1">
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="timeRange"
              value="today"
              checked={mode === "today"}
              onChange={() => onModeChange("today")}
              className="h-4 w-4 border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">今日</span>
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="timeRange"
              value="custom"
              checked={mode === "custom"}
              onChange={() => onModeChange("custom")}
              className="h-4 w-4 border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">自定义范围</span>
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
          />
          <span className="text-muted-foreground">~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
          />
          <button className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
        <div className="flex gap-2">
          {[
            { label: "昨日", days: 1 },
            { label: "近7天", days: 7 },
            { label: "近30天", days: 30 },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onQuickSelect(item.days)}
              className="rounded-lg border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
