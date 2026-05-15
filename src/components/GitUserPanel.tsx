import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionPanel } from "@/components/SectionPanel";

interface GitUserPanelProps {
  gitUser: string;
  onGitUserChange: (value: string) => void;
}

export function GitUserPanel({ gitUser, onGitUserChange }: GitUserPanelProps) {
  return (
    <SectionPanel step="3" title="Git 用户名" className="h-full">
      <div className="space-y-3">
        <Label>Git 用户名</Label>
        <div className="flex items-center gap-3">
          <Input value={gitUser} onChange={(event) => onGitUserChange(event.target.value)} />
          <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-emerald-600">
            <Check className="h-4 w-4" />
            账户有效
          </span>
        </div>
      </div>
    </SectionPanel>
  );
}
