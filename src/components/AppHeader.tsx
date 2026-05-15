import { ChevronDown, CircleDot, FileText, Settings, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AppHeaderProps {
  runtime: string;
  serviceStatus: string;
  user: string;
}

export function AppHeader({ runtime, serviceStatus, user }: AppHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-white">
          <FileText className="h-5 w-5 text-blue-300" />
        </div>
        <div className="flex min-w-0 items-baseline gap-4">
          <h1 className="truncate text-2xl font-bold tracking-normal text-slate-950">
            Git 日报 Agent
          </h1>
          <span className="hidden text-sm text-muted-foreground sm:inline">
            本地运行 · {runtime}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge tone="slate" className="hidden items-center gap-2 border border-border bg-card sm:inline-flex">
          <CircleDot className="h-3.5 w-3.5 fill-emerald-500 text-emerald-500" />
          {serviceStatus}
        </Badge>
        <Button variant="ghost" size="icon" aria-label="主题设置">
          <SunMedium className="h-5 w-5 text-slate-600" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="应用设置">
          <Settings className="h-5 w-5 text-slate-600" />
        </Button>
        <button className="flex h-10 items-center gap-2 rounded-md px-2 hover:bg-secondary">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            {user.slice(0, 1).toUpperCase()}
          </span>
          <span className="hidden text-sm font-medium text-slate-700 sm:inline">{user}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
