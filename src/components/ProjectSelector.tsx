import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionPanel } from "@/components/SectionPanel";
import type { Project } from "@/mock/report";

interface ProjectSelectorProps {
  projects: Project[];
  onToggle: (id: string) => void;
  onAddProject: () => void;
}

export function ProjectSelector({ projects, onToggle, onAddProject }: ProjectSelectorProps) {
  return (
    <SectionPanel
      step="1"
      title="涉及项目选择"
      action={
        <Button variant="secondary" size="sm" onClick={onAddProject}>
          <Plus className="h-4 w-4" />
          添加项目
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        {projects.map((project) => (
          <label
            key={project.id}
            className="flex h-11 cursor-pointer items-center gap-3 rounded-md border border-border bg-card px-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-secondary"
          >
            <input
              type="checkbox"
              checked={project.selected}
              onChange={() => onToggle(project.id)}
              className="h-4 w-4 rounded border-input accent-blue-600"
            />
            <span className="truncate">{project.name}</span>
          </label>
        ))}
      </div>
    </SectionPanel>
  );
}
