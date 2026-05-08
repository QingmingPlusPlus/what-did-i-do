import { SectionCard } from "./SectionCard";
import { Plus, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface Supplier {
  id: string;
  name: string;
  icon?: string;
}

interface Model {
  id: string;
  name: string;
}

interface AIConfigSectionProps {
  suppliers: Supplier[];
  models: Model[];
  selectedSupplier: string;
  selectedModel: string;
  apiKey: string;
  onSupplierChange: (value: string) => void;
  onModelChange: (value: string) => void;
  onApiKeyChange: (value: string) => void;
  onAddSupplier: () => void;
}

export function AIConfigSection({
  suppliers,
  models,
  selectedSupplier,
  selectedModel,
  apiKey,
  onSupplierChange,
  onModelChange,
  onApiKeyChange,
  onAddSupplier,
}: AIConfigSectionProps) {
  const [showKey, setShowKey] = useState(false);

  return (
    <SectionCard
      number={2}
      title="AI 配置"
      action={
        <button
          onClick={onAddSupplier}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="h-3.5 w-3.5" />
          添加供应商
        </button>
      }
    >
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">AI 供应商</label>
          <div className="relative">
            <select
              value={selectedSupplier}
              onChange={(e) => onSupplierChange(e.target.value)}
              className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            >
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">模型</label>
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
              className="w-full appearance-none rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">API Key</label>
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="sk-..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
