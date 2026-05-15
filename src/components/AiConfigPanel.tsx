import { EyeOff, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SectionPanel } from "@/components/SectionPanel";
import type { Provider } from "@/mock/report";

interface AiConfigPanelProps {
  providers: Provider[];
  providerId: string;
  model: string;
  apiKey: string;
  onProviderChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onApiKeyChange: (value: string) => void;
  onAddProvider: () => void;
}

export function AiConfigPanel({
  providers,
  providerId,
  model,
  apiKey,
  onProviderChange,
  onModelChange,
  onApiKeyChange,
  onAddProvider,
}: AiConfigPanelProps) {
  const provider = providers.find((item) => item.id === providerId) ?? providers[0];

  return (
    <SectionPanel
      step="2"
      title="AI 配置"
      action={
        <Button variant="secondary" size="sm" onClick={onAddProvider}>
          <Plus className="h-4 w-4" />
          添加供应商
        </Button>
      }
    >
      <div className="grid gap-5 md:grid-cols-[1fr_1fr_1.35fr]">
        <div className="space-y-2">
          <Label>AI 供应商</Label>
          <div className="relative">
            <Sparkles className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-700" />
            <Select
              value={providerId}
              onChange={(event) => onProviderChange(event.target.value)}
              options={providers.map((item) => ({ value: item.id, label: item.name }))}
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>模型</Label>
          <Select
            value={model}
            onChange={(event) => onModelChange(event.target.value)}
            options={provider.models.map((item) => ({ value: item, label: item }))}
          />
        </div>
        <div className="space-y-2">
          <Label>API Key</Label>
          <div className="relative">
            <Input
              value={apiKey}
              onChange={(event) => onApiKeyChange(event.target.value)}
              type="password"
              className="pr-10"
            />
            <EyeOff className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>
    </SectionPanel>
  );
}
