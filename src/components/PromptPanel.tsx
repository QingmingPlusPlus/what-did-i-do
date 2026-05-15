import { WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SectionPanel } from "@/components/SectionPanel";

interface PromptPanelProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onUseTemplate: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function PromptPanel({
  prompt,
  onPromptChange,
  onUseTemplate,
  onGenerate,
  isGenerating,
}: PromptPanelProps) {
  return (
    <SectionPanel
      step="5"
      title="提示词（可选）"
      action={
        <Button variant="secondary" size="sm" onClick={onUseTemplate}>
          提示词模板
        </Button>
      }
    >
      <div className="space-y-4">
        <Textarea
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          className="min-h-48 resize-none leading-6"
        />
        <Button size="lg" className="w-full" onClick={onGenerate} disabled={isGenerating}>
          <WandSparkles className="h-5 w-5" />
          {isGenerating ? "生成中..." : "生成日报"}
        </Button>
      </div>
    </SectionPanel>
  );
}
