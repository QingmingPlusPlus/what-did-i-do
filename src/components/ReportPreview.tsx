import { Copy, Download, RotateCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ReportState } from "@/mock/report";

interface ReportPreviewProps {
  report: string;
  reportState: ReportState;
  onCopy: () => void;
  onExport: () => void;
  onRegenerate: () => void;
}

function renderMarkdown(report: string) {
  return report.split("\n").map((line, index) => {
    const key = `${index}-${line}`;

    if (line.startsWith("# ")) {
      return <h1 key={key}>{line.replace("# ", "")}</h1>;
    }

    if (line.startsWith("## ")) {
      return <h2 key={key}>{line.replace("## ", "")}</h2>;
    }

    if (line.startsWith("### ")) {
      return <h3 key={key}>{line.replace("### ", "")}</h3>;
    }

    if (line.startsWith("- ")) {
      return (
        <p key={key} className="pl-4 text-sm leading-6 text-slate-800">
          {line}
        </p>
      );
    }

    if (line.trim() === "") {
      return <div key={key} className="h-1" />;
    }

    return (
      <p key={key} className="text-sm leading-7 text-slate-800">
        {line}
      </p>
    );
  });
}

export function ReportPreview({
  report,
  reportState,
  onCopy,
  onExport,
  onRegenerate,
}: ReportPreviewProps) {
  const isGenerating = reportState.status === "generating";

  return (
    <Card className="flex min-h-[calc(100vh-8.5rem)] flex-col p-5 shadow-panel">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-950">日报预览</h2>
          <Badge tone={isGenerating ? "blue" : "green"}>
            <span className="mr-2 h-2 w-2 rounded-full bg-current" />
            {isGenerating ? "生成中" : "已生成"}
          </Badge>
        </div>
        <span className="text-sm text-muted-foreground">生成时间： {reportState.generatedAt}</span>
      </div>

      <div className="markdown-preview min-h-[560px] flex-1 overflow-auto rounded-md border border-border bg-white px-5 py-4">
        {isGenerating ? (
          <div className="flex h-full min-h-96 items-center justify-center text-sm text-muted-foreground">
            正在根据 mock 提交记录生成日报...
          </div>
        ) : (
          renderMarkdown(report)
        )}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Button variant="secondary" onClick={onCopy}>
          <Copy className="h-5 w-5" />
          复制
        </Button>
        <Button variant="secondary" onClick={onExport}>
          <Download className="h-5 w-5" />
          导出 Markdown
        </Button>
        <Button onClick={onRegenerate} disabled={isGenerating}>
          <RotateCw className="h-5 w-5" />
          重新生成
        </Button>
      </div>
    </Card>
  );
}
