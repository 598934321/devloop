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

### Devin CLI / Devin Desktop (plugin)

```bash
devin plugins install 598934321/devloop
```

Skills are namespaced by plugin, so invoke as `/devloop:devloop`.

### Devin CLI / Devin Desktop (bare skill)

```bash
mkdir -p ~/.config/devin/skills
cp -r skills/devloop ~/.config/devin/skills/
```

Invoke as `/devloop`.

### Claude Code

```bash
mkdir -p ~/.claude/skills
cp -r skills/devloop ~/.claude/skills/
```

Invoke as `/devloop`.

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
├── .devin-plugin/plugin.json    # Devin plugin manifest
├── .claude-plugin/plugin.json   # Claude Code plugin manifest
├── skills/
│   └── devloop/
│       └── SKILL.md             # the skill itself
├── README.md / README.zh-CN.md
└── LICENSE
```

## License

MIT
