import { SectionCard } from "./SectionCard";
import { Plus } from "lucide-react";

interface Project {
  id: string;
  name: string;
  selected: boolean;
}

interface ProjectSectionProps {
  projects: Project[];
  onToggleProject: (id: string) => void;
  onAddProject: () => void;
}

export function ProjectSection({ projects, onToggleProject, onAddProject }: ProjectSectionProps) {
  return (
    <SectionCard
      number={1}
      title="涉及项目选择"
      action={
        <button
          onClick={onAddProject}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="h-3.5 w-3.5" />
          添加项目
        </button>
      }
    >
      <div className="flex flex-wrap gap-2">
        {projects.map((project) => (
          <label
            key={project.id}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5"
          >
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              checked={project.selected}
              onChange={() => onToggleProject(project.id)}
            />
            <span>{project.name}</span>
          </label>
        ))}
      </div>
    </SectionCard>
  );
}
