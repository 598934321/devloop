# devloop

第一性原理迭代开发 skill —— 开发 → 提交 → 部署（本地/staging，禁止直接上生产）→ 子代理黑盒对抗审查 → 循环至完成度 100% → 清理汇报。

An iterative development-loop skill for Devin CLI: first-principles implementation → commit & deploy (local/staging only, never production) → adversarial black-box review by a subagent → repeat until 100% → cleanup & report.

## 流程 | The loop

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

Key guarantees:

- **Never ships to production** — staging or local deploy is the hard stop; production release stays a human decision
- **Adversarial review** — a fresh-eyes subagent probes the running artifact against the *requirement*, not the code's intent; it reports findings but never edits
- **Auditable** — every iteration is logged with version, git SHA, review score, and deploy state; the final report is a full iteration table
- **Project-agnostic** — reads each project's own conventions (AGENTS.md/CLAUDE.md, deploy scripts, test commands) instead of hardcoding any stack

## 安装 | Install

```bash
# 全局（所有项目可用）| Global
mkdir -p ~/.config/devin/skills/devloop
cp devloop/SKILL.md ~/.config/devin/skills/devloop/SKILL.md

# 或项目级（随仓库提交共享）| Or project-level
mkdir -p <repo>/.devin/skills/devloop
cp devloop/SKILL.md <repo>/.devin/skills/devloop/SKILL.md
```

## 使用 | Usage

```
/devloop 给搜索页加分面筛选，要求移动端可用
```

Skill 启动后按流程自主迭代，直到审查完成度达到 100% 或遇到需要你决策的阻塞。

## License

MIT
