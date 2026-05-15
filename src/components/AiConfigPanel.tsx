import { CheckCircle2, EyeOff, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SectionPanel } from "@/components/SectionPanel";

interface AiConfigPanelProps {
  providers: DailyReportModelProvider[];
  providerId: DailyReportModelProviderId;
  apiKey: string;
  isLoading: boolean;
  isSaving: boolean;
  onProviderChange: (value: string) => void;
  onApiKeyChange: (value: string) => void;
  onSave: () => void;
}

export function AiConfigPanel({
  providers,
  providerId,
  apiKey,
  isLoading,
  isSaving,
  onProviderChange,
  onApiKeyChange,
  onSave,
}: AiConfigPanelProps) {
  const provider = providers.find((item) => item.id === providerId) ?? providers[0];
  const providerOptions = providers.map((item) => ({ value: item.id, label: item.name }));
  const hasProviders = providers.length > 0;

  return (
    <SectionPanel
      step="2"
      title="模型供应商"
      action={
        <Button
          variant="secondary"
          size="sm"
          onClick={onSave}
          disabled={isLoading || isSaving || !hasProviders}
        >
          <Save className="h-4 w-4" />
          {isSaving ? "保存中" : "保存配置"}
        </Button>
      }
    >
      <div className="grid gap-5 md:grid-cols-[1fr_1.45fr_auto]">
        <div className="space-y-2">
          <Label>供应商</Label>
          <div className="relative">
            <Sparkles className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-700" />
            <Select
              value={providerId}
              onChange={(event) => onProviderChange(event.target.value)}
              options={providerOptions}
              className="pl-9"
              disabled={isLoading || isSaving || !hasProviders}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>API Key</Label>
          <div className="relative">
            <Input
              value={apiKey}
              onChange={(event) => onApiKeyChange(event.target.value)}
              type="password"
              className="pr-10"
              placeholder={isLoading ? "正在读取配置" : "输入供应商 API Key"}
              disabled={isLoading || isSaving || !hasProviders}
            />
            <EyeOff className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        <div className="flex min-w-32 items-end">
          <div className="flex h-10 items-center gap-2 rounded-md border border-border bg-secondary px-3 text-sm text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {provider?.configured ? "已配置" : "待配置"}
          </div>
        </div>
      </div>
    </SectionPanel>
  );
}
