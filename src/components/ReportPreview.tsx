import { Copy, Download, RefreshCw } from "lucide-react";

interface ReportPreviewProps {
  status: "generated" | "generating" | "idle";
  generatedAt?: string;
  content: string;
  onCopy: () => void;
  onExport: () => void;
  onRegenerate: () => void;
}

export function ReportPreview({ status, generatedAt, content, onCopy, onExport, onRegenerate }: ReportPreviewProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-foreground">日报预览</h2>
          {status === "generated" && (
            <span className="inline-flex items-center gap-1 text-xs text-green-600">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              已生成
            </span>
          )}
          {status === "generating" && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
              生成中...
            </span>
          )}
        </div>
        {generatedAt && (
          <span className="text-xs text-muted-foreground">生成时间：{generatedAt}</span>
        )}
      </div>
      <div className="flex-1 overflow-auto p-5">
        {content ? (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">
              {content}
            </pre>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
            <p className="text-sm">配置完成后点击“生成日报”查看报告</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
        >
          <Copy className="h-4 w-4" />
          复制
        </button>
        <button
          onClick={onExport}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted"
        >
          <Download className="h-4 w-4" />
          导出 Markdown
        </button>
        <button
          onClick={onRegenerate}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <RefreshCw className="h-4 w-4" />
          重新生成
        </button>
      </div>
    </div>
  );
}
