import { GitBranch, Settings } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GitBranch className="h-4 w-4" />
        </div>
        <div className="flex items-baseline gap-2">
          <h1 className="text-base font-semibold text-foreground">Git 日报 Agent</h1>
          <span className="text-xs text-muted-foreground">本地运行 · Next.js Web</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          <span>本地服务运行中</span>
        </div>
        <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Settings className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            D
          </div>
          <span className="text-sm text-foreground">demo</span>
        </div>
      </div>
    </header>
  );
}
