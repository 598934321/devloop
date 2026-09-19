# devloop

[English](README.md) | **简体中文**

面向编码 Agent 的迭代开发闭环 skill：**第一性原理开发 → 提交并部署（本地/staging，禁止直接上生产）→ 子代理黑盒对抗审查 → 循环至完成度 100% → 清理汇报。**

## 工作原理

devloop 不是写完就完，而是一个闭环：Agent 先用第一性原理复述问题本质，做最小正确实现，提交并部署到**安全目标**（staging 或本地，永远不是生产），再把跑起来的产物交给一个没有先入之见的子代理去专门挑刺。审查发现的问题喂给下一轮迭代。循环只在审查拿到 100% 时退出，最后清理开发垃圾、输出完整迭代表格（版本号、git SHA、审查评分、部署状态）。

## 流程

```
┌──────────────────────────────────────────────────────────┐
│  0. 需求澄清：第一性原理拆解本质问题、成功判据、不变量        │
│  1. 开发：最小正确实现，修根因，本地验证拿证据                │
│  2. 提交：commit + push，记录精确 SHA                       │
│     部署判定：涉及服务端 → staging；纯前端/无 staging → 本地  │
│     ❌ 永不执行生产发布命令                                  │
│  3. 子代理黑盒对抗审查：把实现当不可信交付物，实际探测找问题   │
│  4. 判定：完成度 <100% → 出新方案回到 1                      │
│  5. 清理开发垃圾，输出迭代表格（版本号/git SHA/完成度/部署）   │
└──────────────────────────────────────────────────────────┘
```

## 安装

### Devin CLI / Devin Desktop（插件方式）

```bash
devin plugins install 598934321/devloop
```

插件内 skill 带命名空间，调用为 `/devloop:devloop`。

### Devin CLI / Devin Desktop（裸 skill）

```bash
mkdir -p ~/.config/devin/skills
cp -r skills/devloop ~/.config/devin/skills/
```

调用为 `/devloop`。

### Claude Code

```bash
mkdir -p ~/.claude/skills
cp -r skills/devloop ~/.claude/skills/
```

调用为 `/devloop`。

## 使用

```
/devloop 给搜索页加分面筛选，要求移动端可用
```

Skill 启动后自主迭代，直到对抗审查达到 100%，或遇到需要你决策的阻塞时停下汇报。

## 保证

- **永不发布到生产** —— staging 或本地部署是硬性终点；生产上线永远留给人工决策
- **对抗式审查** —— 子代理针对*需求*实测运行中的产物，而非对着代码意图；只报告不改代码
- **可审计** —— 每轮迭代记录版本号、git SHA、审查评分、部署状态；最终输出完整迭代表格
- **项目无关** —— 读取各项目自身约定（AGENTS.md/CLAUDE.md、部署脚本、测试命令），不写死任何技术栈

## 仓库结构

```
devloop/
├── .devin-plugin/plugin.json    # Devin 插件清单
├── .claude-plugin/plugin.json   # Claude Code 插件清单
├── skills/
│   └── devloop/
│       └── SKILL.md             # skill 本体
├── README.md / README.zh-CN.md
└── LICENSE
```

## License

MIT
