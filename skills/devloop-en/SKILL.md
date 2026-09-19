---
name: devloop-en
description: First-principles iterative development loop — build -> commit -> deploy (local/staging, never production) -> adversarial black-box subagent review -> repeat until 100% -> cleanup & report
argument-hint: "<requirement / task description>"
triggers:
  - user
permissions:
  allow:
    - Exec(git status)
    - Exec(git diff)
    - Exec(git log)
    - Exec(git rev-parse)
    - Exec(git show)
---

# /devloop — First-Principles Iterative Development

Run the iterative closed loop below on the user's development request until the subagent's black-box review scores 100%, then clean up and report.

Requirement = the argument passed at invocation; if none was given, ask the user for the requirement first.

## Hard constraints (always in effect, never violate)

- **Never ship to production**: never run any command, script, or CI trigger that releases code/services to production. The deploy terminal of this loop is staging or a local environment; production release is always left to a human decision
- **Deploy-command verification**: before running any deploy/release command, resolve and print the full command plus its target environment, and confirm the target is non-production. If the command line or the script it invokes contains production signals (`prod` / `production` / `--promote` / `release` / equivalent), refuse to run it — mark the iteration "pending manual deploy" and continue with local verification instead
- **Never deploy an unpushed commit to a remote**: whatever goes to staging must be an exact SHA that is committed AND pushed
- **Follow the project's own conventions**: read the project's rule files first (AGENTS.md / CLAUDE.md / CONTRIBUTING / README / ops docs); versioning format, commit style, test commands, and deploy scripts all defer to the project. If none exist, at minimum write commits that say what changed and why
- **The review subagent only reviews — never edits**: all fixes happen in the main session
- Maintain an iteration ledger every round: version (if any), git SHA, change summary, review score, deploy state

## Step 0: Clarify & plan

1. Restate the requirement from first principles: the *essential* problem, inputs/outputs, success criteria, edge cases, invariants that must hold. Don't accept surface-level descriptions — decompose until indivisible.
2. If the requirement is ambiguous or admits multiple reasonable approaches → ask the user before building.
3. Create a task list with your harness's task-list tool (Devin: `todo_write`; Claude Code: `TaskCreate`/`TodoWrite`; others: equivalent) covering develop / verify / deploy / review / fix rounds.

## Step 1: First-principles development (entry of each iteration)

1. Derive the **minimal correct implementation** from the fundamental goal: read relevant code and existing conventions first — no invented architecture, no symptomatic patching, no complexity unrelated to the problem.
2. Implement the change following the project's code style and architectural boundaries.
3. Verify locally with evidence: use the project's own build / lint / test commands or a targeted script. If verification fails, fix before proceeding.
4. If the project has a versioning convention (e.g. a version field + bump rule), bump accordingly.

## Step 2: Commit & deploy decision

1. `git status` + `git diff` + `git log` to confirm the change scope and the project's commit style; commit only this round's files (never sweep up unrelated untracked files).
2. commit → push → record `SHA=$(git rev-parse HEAD)` in the ledger.
3. Identify the deploy channels: inspect the project's deploy scripts / CI config / ops docs; know which command goes to staging and which goes to production.
4. Deploy branch decision:
   - **Server-side involved** (API routes, server libs, DB/schema/data, auth, middleware, deploy config, etc.) AND the project has staging → deploy to staging; record the URL and verification points
   - **Frontend/styles/copy/docs only**, or the project has no staging → local deploy verification (build + dev server, actually exercised); ledger notes "local verification"
   - **Can't tell which command hits production** → don't guess, don't try. Local verification + mark "pending manual deploy" and tell the user
5. Under no circumstances run a production release; passing staging is the deploy terminus of a round.

## Step 3: Subagent adversarial black-box review

Spawn a **foreground** review subagent using your harness's subagent mechanism (wait for its report before continuing); it must be able to run shell commands for real probing:

- Devin: `run_subagent`, `profile: subagent_general`
- Claude Code: `Task` tool, `subagent_type: general-purpose`
- Kimi Code: `Agent` tool, `subagent_type: "coder"`
- Other agents: the equivalent general-purpose subagent; if no subagent capability exists, degrade to a main-session self-review — but explicitly switch to the "adversarial reviewer" stance and note the degradation

Subagents are stateless and can't see this session — inject full context into the task:

```
Role: adversarial black-box reviewer. Treat this implementation as an
untrusted deliverable; your job is to find problems, not confirm correctness.

Context:
- Requirement (verbatim): <user requirement>
- This round's change summary: <summary>; git SHA: <sha>; version: <if any>
- Changed files: <git show --stat output>
- Running at: <staging URL or actual localhost address>
- How to exercise it: <how to log in / reach / trigger the feature>

Task — verify against the REQUIREMENT, not the code's intent, black-box:
1. Whether the main functional path achieves the requirement
2. Boundary/abnormal inputs (empty, oversized, concurrent, double-submit, illegal params)
3. Error paths and degradation behavior
4. Security surface: XSS / injection / privilege escalation / sensitive-data leakage / unauthenticated endpoints
5. Regression: did the change break adjacent features
6. Requirement coverage, item by item

Probe the running artifact for real (curl / scripts / behavior-level checks);
do NOT conclude from code reading alone.

Constraints: review and report only — modify no files, no commits, no deploys.

Output format:
- Issue list: severity (critical/high/medium/low), repro steps, evidence
- Requirement coverage table (item by item ✅/❌) — **every item must carry
  measured evidence** (command output / response content / observed behavior);
  "looks right from the code" is not accepted; items without evidence count as ❌
- Completion score: 0-100% (no critical/high AND full requirement coverage = 100%)
```

## Step 4: Completion judgment

- Review score = 100% (no critical/high, full coverage) → step 5
- Otherwise: classify issues as bug / coverage gap / design deviation, form the next round's fix plan, **return to step 1**
- Two consecutive rounds without real progress on the same issue, or blocked by external factors (permissions, environment, dependencies) → stop and report status & options to the user; don't spin
- **Iteration cap**: 8 rounds by default (first round included). Hitting the cap below 100% → forced stop; output the current iteration table + remaining-issue list and let the user decide whether to continue

## Step 5: Cleanup & report

1. Remove dev artifacts produced this round: temp scripts, debug logs, probe/scratch files, ad-hoc test data. **Only delete files this session created**, list them before deleting; ask the user about anything of uncertain ownership. Archive-worthy review evidence goes wherever the project conventionally keeps it.
2. Confirm `git status` is clean (except intentionally kept artifacts).
3. Final report including:
   - What changed and why (root-cause view)
   - Deploy state: local verification / deployed to staging (SHA + URL) / pending manual deploy
   - Remaining issues and recommendations
   - The full iteration table:

```
| Iter | Version | git SHA | Change summary        | Review score   | Deploy state |
|------|---------|---------|-----------------------|----------------|--------------|
| 1    | 0.2.1   | ab0957c | …                     | 72% (3 high)   | staging      |
| 2    | 0.2.2   | …       | …                     | 100%           | local        |
```
