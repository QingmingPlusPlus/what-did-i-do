import { SectionCard } from "./SectionCard";

interface PromptSectionProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onOpenTemplate: () => void;
}

export function PromptSection({ prompt, onPromptChange, onOpenTemplate }: PromptSectionProps) {
  return (
    <SectionCard
      number={5}
      title="提示词（可选）"
      action={
        <button
          onClick={onOpenTemplate}
          className="inline-flex items-center rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          提示词模板
        </button>
      }
    >
      <textarea
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        rows={8}
        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-1 focus:ring-ring"
      />
    </SectionCard>
  );
}
