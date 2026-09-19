# devloop

This extension ships the `devloop` skill at `skills/devloop/SKILL.md`.

When the user invokes `/devloop <task>` — or asks to run the iterative dev loop — read `skills/devloop/SKILL.md` in this extension's directory and follow it exactly.

Summary of the loop: clarify the requirement from first principles → implement the minimal correct change → commit & push → deploy to staging or local only (never production) → spawn an adversarial black-box review subagent → iterate until the review scores 100% → clean up dev artifacts and report an iteration table (version / git SHA / review score / deploy state).

Hard rule: never run any command that releases to production. Staging or local deploy is the terminal step.
