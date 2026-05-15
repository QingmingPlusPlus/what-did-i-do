## 1. Project Setup

- [x] 1.1 Create Electron, Vite, React, TypeScript project files at the repository root.
- [x] 1.2 Add package scripts for development, type checking, renderer build, Electron build, preview, and lint when available.
- [x] 1.3 Configure Tailwind CSS, PostCSS, global styles, theme variables, and path aliases.
- [x] 1.4 Add shadcn/ui-style utilities and base components needed by the first screen.

## 2. Electron Shell

- [x] 2.1 Implement the Electron main process to create the desktop window and load the Vite dev server or built renderer.
- [x] 2.2 Implement a minimal preload boundary that exposes mock desktop metadata without enabling Node.js integration in the renderer.
- [x] 2.3 Verify the app can be launched through the documented development command.

## 3. Mock Data and State

- [x] 3.1 Define typed mock data for projects, providers, models, user info, date ranges, prompt template, report status, and report content.
- [x] 3.2 Implement local state transitions for project selection, provider/model/API key edits, Git username edits, date range changes, and prompt edits.
- [x] 3.3 Implement mock action feedback for generate, regenerate, copy, export Markdown, add project, add provider, and prompt template actions.

## 4. UI Implementation

- [x] 4.1 Build the top application bar with product identity, runtime label, service status, theme placeholder, and user menu placeholder.
- [x] 4.2 Build the left configuration area for project selection, AI config, Git user, time range, and prompt editing.
- [x] 4.3 Build the right report preview area with generated status, timestamp, Markdown-like report content, and result actions.
- [x] 4.4 Match the low-fidelity layout with a desktop-first two-column design and responsive narrow-window fallback.
- [x] 4.5 Ensure buttons, inputs, labels, badges, and panels follow Tailwind CSS and shadcn/ui visual conventions.

## 5. Documentation and Memory

- [x] 5.1 Update README with project purpose, tech stack, install/start commands, directory structure, mock scope, and next integration points.
- [x] 5.2 Add a project memory document describing current UI modules, mock behavior, and implementation status.
- [x] 5.3 Update `doc/agent-memory-map.md` with a Git 日报 Agent route pointing to the new doc and OpenSpec capability.

## 6. Verification

- [x] 6.1 Run dependency installation or confirm the chosen package manager state.
- [x] 6.2 Run type checking and production build.
- [x] 6.3 Start the local Electron development flow and verify the main screen renders with mock data.
- [x] 6.4 Check README commands and notes match the implemented scripts.
