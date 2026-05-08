import { SectionCard } from "./SectionCard";
import { Check } from "lucide-react";

interface GitUserSectionProps {
  username: string;
  isValid: boolean;
  onChange: (value: string) => void;
}

export function GitUserSection({ username, isValid, onChange }: GitUserSectionProps) {
  return (
    <SectionCard number={3} title="Git 用户名" className="flex-1">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Git 用户名</label>
        <div className="relative">
          <input
            type="text"
            value={username}
            onChange={(e) => onChange(e.target.value)}
            placeholder="输入 Git 用户名"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
          />
          {isValid && (
            <span className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-xs text-green-600">
              <Check className="h-3.5 w-3.5" />
              账户有效
            </span>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
