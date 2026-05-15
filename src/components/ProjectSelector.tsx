import { AlertCircle, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SectionPanel } from "@/components/SectionPanel";
import type { Project } from "@/mock/report";

interface ProjectSelectorProps {
  projects: Project[];
  isLoading: boolean;
  isBusy: boolean;
  feedback?: {
    tone: "error" | "info";
    message: string;
  };
  onToggle: (project: Project) => void;
  onAddProject: () => void;
  onDeleteProject: (id: string) => void;
}

export function ProjectSelector({
  projects,
  isLoading,
  isBusy,
  feedback,
  onToggle,
  onAddProject,
  onDeleteProject,
}: ProjectSelectorProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <SectionPanel
      step="1"
      title="涉及项目选择"
      action={
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onAddProject} disabled={isBusy}>
            <Plus className="h-4 w-4" />
            添加项目
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing((current) => !current)}
            disabled={isBusy || projects.length === 0}
          >
            {isEditing ? <X className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            {isEditing ? "完成" : "编辑"}
          </Button>
        </div>
      }
    >
      {feedback ? (
        <div
          role={feedback.tone === "error" ? "alert" : "status"}
          className={
            feedback.tone === "error"
              ? "mb-3 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              : "mb-3 flex items-start gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-700"
          }
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      ) : null}
      {isLoading ? (
        <div className="rounded-md border border-dashed border-border bg-secondary/60 px-4 py-5 text-sm text-muted-foreground">
          正在加载已添加的项目...
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-md border border-dashed border-border bg-secondary/60 px-4 py-5 text-sm text-muted-foreground">
          暂无项目。点击“添加项目”选择包含直属 .git 目录的文件夹。
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {projects.map((project) => {
            const isDisabled = !project.valid || isBusy;

            return (
              <div
                key={project.id}
                className="flex min-h-20 items-start gap-3 rounded-md border border-border bg-card p-3 text-sm shadow-sm transition-colors hover:bg-secondary/60"
              >
                <label
                  className={
                    project.valid
                      ? "flex min-w-0 flex-1 cursor-pointer items-start gap-3"
                      : "flex min-w-0 flex-1 cursor-not-allowed items-start gap-3 opacity-70"
                  }
                >
                  <input
                    type="checkbox"
                    checked={project.valid && project.selected}
                    disabled={isDisabled}
                    onChange={() => onToggle(project)}
                    className="mt-1 h-4 w-4 rounded border-input accent-blue-600"
                  />
                  <span className="min-w-0 space-y-1">
                    <span className="block truncate font-medium text-slate-800">
                      {project.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {project.path}
                    </span>
                    {!project.valid ? (
                      <span className="inline-flex rounded-sm bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-700">
                        已失效：缺少 .git 目录
                      </span>
                    ) : null}
                  </span>
                </label>

                {isEditing ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteProject(project.id)}
                    disabled={isBusy}
                    aria-label={`删除 ${project.name}`}
                    title={`删除 ${project.name}`}
                    className="h-8 w-8 shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </SectionPanel>
  );
}
