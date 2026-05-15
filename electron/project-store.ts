import type { BrowserWindow, OpenDialogOptions } from "electron";
import { app, dialog } from "electron";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

export interface SavedProjectRecord {
  id: string;
  name: string;
  path: string;
  selected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectView extends SavedProjectRecord {
  valid: boolean;
}

export type ProjectActionStatus =
  | "success"
  | "added"
  | "duplicate"
  | "cancelled"
  | "invalid"
  | "not-found"
  | "error";

export interface ProjectActionResult {
  ok: boolean;
  status: ProjectActionStatus;
  projects: ProjectView[];
  project?: ProjectView;
  message?: string;
}

const storageFileName = "projects.json";

function projectsFilePath() {
  return path.join(app.getPath("userData"), storageFileName);
}

function normalizeProjectPath(projectPath: string) {
  return path.resolve(projectPath);
}

function createProjectId(projectPath: string) {
  return createHash("sha1").update(projectPath).digest("hex").slice(0, 16);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseProjectRecord(value: unknown): SavedProjectRecord | null {
  if (!isObject(value)) {
    return null;
  }

  const id = typeof value.id === "string" ? value.id : null;
  const name = typeof value.name === "string" ? value.name : null;
  const projectPath = typeof value.path === "string" ? value.path : null;
  const createdAt = typeof value.createdAt === "string" ? value.createdAt : null;
  const updatedAt = typeof value.updatedAt === "string" ? value.updatedAt : null;

  if (!id || !name || !projectPath || !createdAt || !updatedAt) {
    return null;
  }

  return {
    id,
    name,
    path: normalizeProjectPath(projectPath),
    selected: value.selected === true,
    createdAt,
    updatedAt,
  };
}

async function readSavedProjects() {
  try {
    const raw = await fs.readFile(projectsFilePath(), "utf8");
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.flatMap((item) => {
      const record = parseProjectRecord(item);
      return record ? [record] : [];
    });
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return [];
    }

    console.error("Failed to read project store.", error);
    throw error;
  }
}

async function writeSavedProjects(projects: SavedProjectRecord[]) {
  const filePath = projectsFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(projects, null, 2)}\n`, "utf8");
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

async function hasDirectGitDirectory(projectPath: string) {
  try {
    const stats = await fs.stat(path.join(projectPath, ".git"));
    return stats.isDirectory();
  } catch {
    return false;
  }
}

async function toProjectView(record: SavedProjectRecord): Promise<ProjectView> {
  return {
    ...record,
    valid: await hasDirectGitDirectory(record.path),
  };
}

async function listProjectViews(records?: SavedProjectRecord[]) {
  const source = records ?? (await readSavedProjects());
  return Promise.all(source.map(toProjectView));
}

function success(projects: ProjectView[], status: ProjectActionStatus, message?: string) {
  return { ok: true, status, projects, message };
}

function failure(projects: ProjectView[], status: ProjectActionStatus, message: string) {
  return { ok: false, status, projects, message };
}

export async function listProjects(): Promise<ProjectActionResult> {
  try {
    return success(await listProjectViews(), "success");
  } catch (error) {
    console.error("Failed to list projects.", error);
    return failure([], "error", "读取项目列表失败");
  }
}

export async function chooseAndAddProject(
  parentWindow?: BrowserWindow,
): Promise<ProjectActionResult> {
  try {
    const currentRecords = await readSavedProjects();
    const currentProjects = await listProjectViews(currentRecords);
    const dialogOptions: OpenDialogOptions = {
      title: "选择 Git 项目文件夹",
      properties: ["openDirectory"],
    };
    const result = parentWindow
      ? await dialog.showOpenDialog(parentWindow, dialogOptions)
      : await dialog.showOpenDialog(dialogOptions);

    if (result.canceled || result.filePaths.length === 0) {
      return success(currentProjects, "cancelled", "已取消添加项目");
    }

    const projectPath = normalizeProjectPath(result.filePaths[0]);
    return addProjectPath(projectPath, currentRecords);
  } catch (error) {
    console.error("Failed to add project.", error);
    return failure([], "error", "添加项目失败");
  }
}

export async function addProjectPath(
  selectedPath: string,
  records?: SavedProjectRecord[],
): Promise<ProjectActionResult> {
  let currentProjects: ProjectView[] = [];

  try {
    const currentRecords = records ?? (await readSavedProjects());
    currentProjects = await listProjectViews(currentRecords);
    const projectPath = normalizeProjectPath(selectedPath);
    const existing = currentRecords.find((item) => item.path === projectPath);

    if (existing) {
      const projects = await listProjectViews(currentRecords);
      return {
        ...success(projects, "duplicate", "该项目已存在"),
        project: projects.find((item) => item.id === existing.id),
      };
    }

    if (!(await hasDirectGitDirectory(projectPath))) {
      return failure(currentProjects, "invalid", "添加失败：所选文件夹下没有 .git 目录");
    }

    const now = new Date().toISOString();
    const record: SavedProjectRecord = {
      id: createProjectId(projectPath),
      name: path.basename(projectPath) || projectPath,
      path: projectPath,
      selected: true,
      createdAt: now,
      updatedAt: now,
    };
    const nextRecords = [...currentRecords, record];
    await writeSavedProjects(nextRecords);
    const projects = await listProjectViews(nextRecords);

    return {
      ...success(projects, "added", "项目添加成功"),
      project: projects.find((item) => item.id === record.id),
    };
  } catch (error) {
    console.error("Failed to add project path.", error);
    return failure(currentProjects, "error", "添加项目失败");
  }
}

export async function updateProjectSelection(
  id: string,
  selected: boolean,
): Promise<ProjectActionResult> {
  try {
    const currentRecords = await readSavedProjects();
    const target = currentRecords.find((item) => item.id === id);

    if (!target) {
      return failure(await listProjectViews(currentRecords), "not-found", "项目不存在");
    }

    if (!(await hasDirectGitDirectory(target.path))) {
      return failure(await listProjectViews(currentRecords), "invalid", "项目已失效，不能选择");
    }

    const now = new Date().toISOString();
    const nextRecords = currentRecords.map((item) =>
      item.id === id ? { ...item, selected, updatedAt: now } : item,
    );
    await writeSavedProjects(nextRecords);

    return success(await listProjectViews(nextRecords), "success", "项目范围已更新");
  } catch (error) {
    console.error("Failed to update project selection.", error);
    return failure([], "error", "更新项目范围失败");
  }
}

export async function deleteProject(id: string): Promise<ProjectActionResult> {
  try {
    const currentRecords = await readSavedProjects();
    const nextRecords = currentRecords.filter((item) => item.id !== id);

    if (nextRecords.length === currentRecords.length) {
      return failure(await listProjectViews(currentRecords), "not-found", "项目不存在");
    }

    await writeSavedProjects(nextRecords);
    return success(await listProjectViews(nextRecords), "success", "项目已删除");
  } catch (error) {
    console.error("Failed to delete project.", error);
    return failure([], "error", "删除项目失败");
  }
}
