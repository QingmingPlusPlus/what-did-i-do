export type Project = {
  id: string;
  name: string;
  path: string;
  selected: boolean;
  valid: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DateMode = "today" | "custom";

export type ReportState = {
  status: "idle" | "generating" | "generated";
  generatedAt: string;
};

export const defaultPrompt = `你是一位技术日报助手，请根据以下 Git 提交记录生成一份中文的工作日报。
1. 聚焦今日的主要变化和工作成果
2. 梳理变更主题，按项目/模块归类并概要说明
3. 识别风险与待办，给出下一步建议

输出要求：
- 使用简洁的 Markdown 结构
- 语言简洁、专业、聚焦结果
- Git 信息：{git_commits}
- Git 用户名：{git_username}`;

export function formatTimestamp(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function buildReportMarkdown(projectNames: string[], gitUser: string, date: string) {
  const projects = projectNames.length > 0 ? projectNames : ["未选择项目"];
  const projectText = projects.join("、");

  return `# ${date} 工作日报（周四）

涉及项目： ${projectText}  |  Git 用户： ${gitUser || "demo"}

## 今日工作概览

今日主要围绕项目功能优化与缺陷修复展开，完成了核心模块的优化与接口联调工作，同时新增了文档与单元测试，整体进展顺利。

## 项目进展

${projects
  .map((project, index) => {
    if (index === 0) {
      return `- ${project}：完成用户权限模块优化，新增角色批量分配能力。`;
    }

    if (index === 1) {
      return `- ${project}：修复搜索导出功能，支持多条件筛选。`;
    }

    return `- ${project}：补充配置页面交互状态，完善边界提示。`;
  })
  .join("\n")}

## 提交记录汇总

### ${projects[0]}（5 次提交）

- feat(auth)：优化权限校验逻辑
- fix：修复接口超时不生效问题
- test：补充权限相关单元测试
- docs：更新权限相关文档

### ${projects[1] ?? projects[0]}（4 次提交）

- feat(export)：导出功能支持 Excel/CSV
- refactor：清理多条件式冗余请求
- refactor：优化筛选条件查询逻辑
- docs：更新导出功能使用说明

## 风险与待办

- ${projects[0]}：异步加载在大数据量场景下性能仍需验证。
- ${projects[1] ?? projects[0]}：关联表数据的并发更新需进一步评估。
- 明日计划：完善 export 的权限校验，优化 ${projects[0]} 的日志埋点。`;
}
