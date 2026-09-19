# devloop

**English** | [简体中文](README.zh-CN.md)

An iterative development-loop skill for [Devin CLI](https://devin.ai): first-principles implementation → commit & deploy (staging/local only, **never production**) → adversarial black-box review by a subagent → repeat until 100% → cleanup & report.

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

## Guarantees

- **Never ships to production** — staging or local deploy is the hard stop; production release stays a human decision
- **Adversarial review** — a fresh-eyes subagent probes the running artifact against the *requirement*, not the code's intent; it reports findings but never edits
- **Auditable** — every iteration is logged with version, git SHA, review score, and deploy state; the final report is a full iteration table
- **Project-agnostic** — reads each project's own conventions (AGENTS.md/CLAUDE.md, deploy scripts, test commands) instead of hardcoding any stack

## Install

```bash
# Global — available in every project
mkdir -p ~/.config/devin/skills/devloop
cp devloop/SKILL.md ~/.config/devin/skills/devloop/SKILL.md

# Or project-level — committed with the repo
mkdir -p <repo>/.devin/skills/devloop
cp devloop/SKILL.md <repo>/.devin/skills/devloop/SKILL.md
```

## Usage

```
/devloop add faceted filtering to the search page, mobile-friendly
```

The skill then iterates autonomously until the review score hits 100% or a decision is needed from you.

## License

MIT
