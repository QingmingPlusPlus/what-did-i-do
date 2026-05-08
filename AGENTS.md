# AGENTS 指南

## 语言要求

所有输出内容、spec 文档、doc 文档、skills 等中的自然语言部分统一使用中文；
可能影响软件工具识别的专有名词（如函数名、变量名、框架名、工具名、配置项、关键字等）保留原语言。

<!-- tri-memory:start -->
## tri-memory 三层记忆

本仓库使用 `tri-memory` 保持 agent 上下文轻量、可定位、可持续更新。

### 记忆入口

- 开发、评审、排障或文档/spec/skill 改动前，先读 `doc/agent-memory-map.md`。
- 选择最具体的匹配行，再读取其中列出的 `doc`、`spec` 和 skill 后动手。
- 若没有匹配行，用 `rg` 在 `doc/`、`spec/`、`openspec/specs/`、`.agents/skills/` 中搜索；本次工作形成长期入口时补充路由表。

### 三层落点

- 约束未来行为、验收场景和长期业务规则，写入 `spec/` 或 `openspec/specs/`。
- 当前项目状态、模块说明、路由、页面、字段、接口和迁移记录，写入 `doc/`。
- 稳定、重复、值得复用且有明确步骤和自检的操作流程，写入 `.agents/skills/`。

### 记忆保鲜

- 新增或调整长期模块入口、spec、文档或 skill 时，更新 `doc/agent-memory-map.md`。
- 不要把页面说明、字段清单、当前接口特例、一次性迁移背景或项目现状写入 skill。
- 不要把密钥、凭据、客户隐私数据或短期排障记录写入项目记忆。
<!-- tri-memory:end -->
