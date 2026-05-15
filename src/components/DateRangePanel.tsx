import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionPanel } from "@/components/SectionPanel";
import type { DateMode } from "@/mock/report";

interface DateRangePanelProps {
  mode: DateMode;
  startDate: string;
  endDate: string;
  onModeChange: (mode: DateMode) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onQuickRange: (range: "yesterday" | "7d" | "30d") => void;
}

export function DateRangePanel({
  mode,
  startDate,
  endDate,
  onModeChange,
  onStartDateChange,
  onEndDateChange,
  onQuickRange,
}: DateRangePanelProps) {
  return (
    <SectionPanel step="4" title="时间范围" className="h-full">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              checked={mode === "today"}
              onChange={() => onModeChange("today")}
              className="h-4 w-4 accent-blue-600"
            />
            今日
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="radio"
              checked={mode === "custom"}
              onChange={() => onModeChange("custom")}
              className="h-4 w-4 accent-blue-600"
            />
            自定义范围
          </label>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-3">
          <Input
            type="date"
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
          />
          <span className="text-sm text-muted-foreground">~</span>
          <Input
            type="date"
            value={endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
          />
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => onQuickRange("yesterday")}>
            昨日
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onQuickRange("7d")}>
            近7天
          </Button>
          <Button variant="secondary" size="sm" onClick={() => onQuickRange("30d")}>
            近30天
          </Button>
        </div>
        <Label className="sr-only">当前日期范围：{startDate} 至 {endDate}</Label>
      </div>
    </SectionPanel>
  );
}
