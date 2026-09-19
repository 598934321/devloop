# devloop

**English** | [简体中文](README.zh-CN.md)

An iterative development-loop skill for coding agents: **first-principles build → commit & deploy (staging/local only, never production) → adversarial black-box review by a subagent → repeat until 100% → cleanup & report.**

## How it works

Instead of write-code-and-hope, devloop runs a closed loop. Your agent restates the problem from first principles, builds the minimal correct implementation, commits and deploys it to a *safe* target — staging or local, never production — then hands the running artifact to a fresh-eyes subagent whose only job is to break it. Whatever the reviewer finds feeds the next iteration. The loop only exits at a 100% review score, and finishes by cleaning up dev artifacts and reporting a full iteration table (version, git SHA, review score, deploy state).

## The loop

```
┌──────────────────────────────────────────────────────────┐
│  0. Clarify: restate the problem from first principles — │
│     essence, success criteria, invariants                │
│  1. Develop: minimal correct implementation, fix root    │
│     causes, verify locally with evidence                 │
│  2. Commit: commit + push, record the exact SHA          │
│     Deploy: server-side changes → staging;               │
│     frontend-only / no staging → local verification      │
│     ❌ Production release commands are never executed     │
│  3. Review: a subagent treats the work as untrusted and  │
│     probes the running artifact adversarially            │
│  4. Decide: score <100% → new fix plan, back to step 1   │
│  5. Cleanup: remove dev artifacts, report the iteration  │
│     table (version / git SHA / score / deploy state)     │
└──────────────────────────────────────────────────────────┘
```

## Install

The repo is a plugin for every agent that supports plugin manifests — and `skills/devloop/` is an ordinary skill directory you can copy anywhere.

| Agent | Install | Invoke |
|-------|---------|--------|
| **Devin CLI / Desktop** | `devin plugins install 598934321/devloop` | `/devloop:devloop` |
| **Devin CLI / Desktop** (bare) | `cp -r skills/devloop ~/.config/devin/skills/` | `/devloop` |
| **Claude Code** | `cp -r skills/devloop ~/.claude/skills/` | `/devloop` |
| **Codex** | `cp -r skills/devloop ~/.codex/skills/` | `/devloop` |
| **Cursor** | `cp -r skills/devloop ~/.cursor/skills/` | `/devloop` |
| **Kimi Code** | plugin manifest `.kimi-plugin/` (ships tool-name mapping) | `/devloop` |
| **Gemini CLI** | `gemini extensions install https://github.com/598934321/devloop` | `/devloop` |
| **agentskills-compatible** | `cp -r skills/devloop .agents/skills/` (project) or `~/.agents/skills/` (global) | `/devloop` |
| **Any other agent** | copy `skills/devloop/` into that agent's skills directory | `/devloop` |

Tool references inside `SKILL.md` are harness-neutral (subagent / task-list / question tools); per-agent manifests carry `skillInstructions` mappings where the format supports them.

Two skill variants ship side by side — `skills/devloop/` (简体中文, `/devloop`) and `skills/devloop-en/` (English, `/devloop-en`); pick one.

CI (`scripts/validate.mjs` + GitHub Action) checks every manifest parses, `version` is semver, declared skills dirs exist, and each `SKILL.md` frontmatter `name`/`description` matches its directory.

## Usage

```
/devloop add faceted filtering to the search page, mobile-friendly
```

The skill iterates autonomously until the adversarial review scores 100%, or stops and reports when it hits a decision only you can make.

## Guarantees

- **Never ships to production** — staging or local deploy is the hard stop; production release stays a human decision
- **Adversarial review** — the subagent probes the running artifact against the *requirement*, not the code's intent; it reports findings but never edits
- **Auditable** — every iteration is logged with version, git SHA, review score, and deploy state; the final report is a full iteration table
- **Project-agnostic** — reads each project's own conventions (AGENTS.md/CLAUDE.md, deploy scripts, test commands) instead of hardcoding any stack

## Repository layout

```
devloop/
├── .devin-plugin/plugin.json      # Devin plugin manifest
├── .claude-plugin/plugin.json     # Claude Code plugin manifest
├── .codex-plugin/plugin.json      # Codex plugin manifest
├── .cursor-plugin/plugin.json     # Cursor plugin manifest
├── .kimi-plugin/plugin.json       # Kimi Code manifest (tool-name mapping)
├── .agents/plugins/marketplace.json  # agentskills marketplace
├── gemini-extension.json          # Gemini CLI extension
├── GEMINI.md                      # context for Gemini CLI
├── skills/
│   ├── devloop/SKILL.md           # the skill itself — 简体中文 (agent-neutral)
│   └── devloop-en/SKILL.md        # English variant
├── scripts/validate.mjs           # structural validation
├── .github/workflows/validate.yml # CI
├── README.md / README.zh-CN.md
└── LICENSE
```

## License

MIT
