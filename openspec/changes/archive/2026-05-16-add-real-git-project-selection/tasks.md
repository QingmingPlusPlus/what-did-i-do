## 1. Electron Project Service

- [x] 1.1 Define shared project record shapes for saved project data and renderer-facing project state.
- [x] 1.2 Implement a main-process project store using a JSON file under `app.getPath("userData")`.
- [x] 1.3 Implement `.git` directory validation that only accepts a directory directly under the selected project path.
- [x] 1.4 Add main-process IPC handlers to list projects, choose and add a project folder, update project selection, and delete a project.
- [x] 1.5 Handle duplicate paths, cancelled folder selection, invalid folders, JSON parse errors, and filesystem failures with structured results.

## 2. Preload API and Types

- [x] 2.1 Extend the preload bridge with a minimal `dailyReportAgent.projects` API backed by `ipcRenderer.invoke`.
- [x] 2.2 Update renderer global TypeScript declarations for project list, add, update, and delete responses.
- [x] 2.3 Preserve the existing runtime info API and Electron security settings.

## 3. Renderer State and Project Selector UI

- [x] 3.1 Load stored projects when the app mounts and show a clear loading or empty state in the project selector.
- [x] 3.2 Replace mock project selection state with real project data returned from the preload API.
- [x] 3.3 Wire “添加项目” to the folder picker flow and show success, cancelled, duplicate, invalid, or error feedback.
- [x] 3.4 Disable selection controls for projects whose `.git` directory is missing and exclude them from the report project range.
- [x] 3.5 Add an “编辑” control next to “添加项目” and switch project cards into edit mode.
- [x] 3.6 In edit mode, allow deleting saved projects, including invalid projects, and persist deletion through the project API.
- [x] 3.7 Keep the report preview using selected valid project names while other AI, Git user, date range, and prompt controls remain mock-backed.

## 4. Documentation and Project Memory

- [x] 4.1 Update README to describe real project selection, local JSON storage, and the `.git` directory-only validation rule.
- [x] 4.2 Update `doc/git-daily-report-agent.md` to reflect that project management is no longer mock-only.
- [x] 4.3 Confirm whether `doc/agent-memory-map.md` needs changes; update it only if the long-term routing entry changes.

## 5. Verification

- [x] 5.1 Run TypeScript checks for renderer and Electron code.
- [x] 5.2 Verify adding a valid Git repository succeeds and survives app reload.
- [x] 5.3 Verify adding a non-Git folder fails and is not persisted.
- [x] 5.4 Verify a saved project becomes disabled after its `.git` directory is removed.
- [x] 5.5 Verify edit mode can delete valid and invalid saved projects.
