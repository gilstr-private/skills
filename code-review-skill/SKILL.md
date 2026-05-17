---
name: code-review
description: >
  Multi-agent code review workflow with parallel reviewers, confidence-based
  validation, and iterative fix/dispute resolution.
  An orchestrator runs a 7-stage pipeline: eligibility check, change summary,
  standards discovery, five parallel reviewers, per-finding validation
  (confidence 0-100, threshold 80), Fixer with dispute rights, and
  human-in-the-loop for unresolved disagreements.
  Use when: reviewing code for a user story/PBI, a pull request, or
  uncommitted/unpushed local changes.
model_tiers:
  eligibility: haiku
  summary: haiku
  standards_discovery: haiku
  reviewers: sonnet
  validators_style: haiku
  validators_bug: opus
  fixer: sonnet
  orchestrator: sonnet
---

# Agentic Code Review Skill

## Overview

This skill implements a **multi-agent code review pipeline** with detection
and validation as separate concerns. The architectural inspiration is
Anthropic's Claude Code review plugin: narrow-context parallel reviewers,
confidence-scored findings, and an explicit don't-flag list that keeps
noise out of the Fixer's queue.

```
User
  │
  ▼
Orchestrator
  │
  ├─ (1) Eligibility check ──────────────── Haiku (skip drafts/trivial/dupes)
  ├─ (2) Change summary ────────────────── Haiku (shared context for all reviewers)
  ├─ (3) Standards discovery ────────────── Haiku (find CLAUDE.md, skills)
  │
  ├─ (4) 5 parallel reviewers ──────────── Sonnet (narrow context diets)
  │       ├─ R1 Standards compliance
  │       ├─ R2 Shallow bug scan (diff only)
  │       ├─ R3 Contextual bug scan (+ full files + blame)
  │       ├─ R4 Security
  │       └─ R5 Story compliance
  │
  ├─ (5) Per-finding validators ────────── Haiku (style) / Opus (bugs)
  │       └─ Confidence 0-100, keep ≥80
  │
  ├─ (6) Fixer ─────────────────────────── Sonnet (fix or dispute)
  │
  └─ (7) Loop → Escalate → Finalize
```

### Key design principles

1. **Detect and validate are different agents.** Reviewers surface findings;
   a separate Validator grades each finding's confidence before the Fixer
   ever sees it. Findings below the threshold (80) are dropped silently.
2. **Narrow context diets.** Each reviewer gets only what it needs. The
   shallow bug scanner deliberately *does not* read surrounding files —
   that's how it catches obvious-from-the-diff bugs without going down
   rabbit holes. The contextual bug scanner is the one that reads broadly.
3. **Don't-flag list is explicit.** CI-enforced style, generated files,
   test-only violations, and unprompted "add more tests" suggestions are
   filtered at the validator stage. See `references/dont-flag.md`.
4. **Clean-context review.** Every reviewer is a sub-agent with no prior
   context — fresh eyes on every round.
5. **Document, don't fix.** Reviewers only write findings. The Fixer is
   the only agent that modifies code.
6. **Iterative convergence.** Fixer and Reviewer iterate until agreement
   or human decides.
7. **Full traceability.** Every finding, validation score, fix, and
   decision is logged in the workspace.

### Model tiering

The `model_tiers` frontmatter specifies which model each stage should use.
Haiku for high-volume cheap work (eligibility, summary, standards
discovery, style-compliance validation); Sonnet for the bulk of the
review and the fixer; Opus reserved for validating flagged bugs where
the token spend is justified by the severity. When spawning a sub-agent,
pass the corresponding model.

---

## Step 1: Gather Context from the User

When the user invokes this skill (e.g., `/review` or "review my code"),
determine the **review scope** by asking:

### What are we reviewing?

| Scenario | How to get the diff |
|----------|---------------------|
| **User Story / PBI** | Ask for the story ID/title. Retrieve from Azure DevOps MCP if available. Use `git log` to find related commits or ask for the branch. |
| **Pull Request** | Ask for the PR number/URL. Fetch the diff via Azure DevOps MCP or `git diff main...branch`. Also fetch PR description and linked work items. |
| **Uncommitted changes** | Run `git diff` (staged + unstaged). |
| **Committed but not pushed** | `git log origin/HEAD..HEAD --oneline` for commits, then `git diff origin/HEAD..HEAD` for the diff. |

### Collect these inputs

- **`review_scope`**: One of `user-story`, `pull-request`, `uncommitted`, `unpushed`
- **`story_details`**: (if applicable) Story/PBI title, description, acceptance criteria
- **`diff`**: The code diff to review
- **`changed_files`**: List of files touched
- **`branch_name`**: Current branch
- **`pr_iteration`**: (PR only) PR iteration number or HEAD SHA — used by Stage 1 to detect duplicate reviews
- **`related_context`**: Any additional context the user provides

Save all inputs to `{workspace}/inputs/`.

---

## Step 2: Set Up the Workspace

Create a workspace for this session:

```
{project_root}/.code-review/
└── {timestamp}-{short-description}/
    ├── inputs/
    │   ├── context.md           # Story/PR details, scope
    │   ├── diff.patch           # The code diff
    │   ├── changed_files.txt    # List of changed files
    │   └── summary.md           # Stage 2 output — shared context for reviewers
    ├── standards/
    │   └── applicable.md        # Stage 3 output — CLAUDE.md files, skills
    ├── rounds/
    │   ├── round-1/
    │   │   ├── reviewers/
    │   │   │   ├── r1-standards.md
    │   │   │   ├── r2-shallow-bugs.md
    │   │   │   ├── r3-contextual-bugs.md
    │   │   │   ├── r4-security.md
    │   │   │   └── r5-story-compliance.md
    │   │   ├── findings-merged.md       # Deduplicated findings
    │   │   ├── validations.md           # Confidence scores per finding
    │   │   ├── findings-validated.md    # Findings with score ≥ 80
    │   │   └── fix-report.md
    │   └── round-{n}/ ...
    ├── disputes/
    │   └── dispute-{n}.md
    ├── final-report.md
    └── session.json
```

Initialize `session.json`:

```json
{
  "created_at": "<ISO timestamp>",
  "review_scope": "<scope>",
  "branch": "<branch>",
  "story": "<story title or N/A>",
  "status": "in-progress",
  "current_round": 1,
  "max_rounds": 5,
  "confidence_threshold": 80,
  "eligibility": null,
  "rounds": [],
  "disputes": [],
  "resolution": null
}
```

---

## Step 3 (Pipeline Stage 1): Eligibility Check

**Model: Haiku.** This is a cheap pre-flight check. Spawn a sub-agent that
reads `inputs/context.md` and the diff header, then answers:

1. Is this a draft PR or marked WIP? → **skip**
2. Is this a trivial/automated change (version bumps only, generated file
   updates, whitespace-only)? → **skip**
3. For PRs: has this skill already posted a review on this PR iteration?
   Check via Azure DevOps MCP (`pr_iteration` in inputs). → **skip**
4. Are there zero non-generated file changes? → **skip**
5. Otherwise → **proceed**

The Haiku agent writes a one-line verdict to `{workspace}/eligibility.md`
with `ELIGIBLE` or `SKIP: <reason>`. Update `session.json.eligibility`
accordingly. If SKIP, stop the pipeline and tell the user why.

**Note:** If the user explicitly says "review this anyway" or uses
`/review --force`, skip the eligibility check entirely.

See `references/eligibility-rules.md` for the full rubric.

---

## Step 4 (Pipeline Stage 2): Change Summary

**Model: Haiku.** Spawn a sub-agent that reads the diff and writes a
concise summary to `{workspace}/inputs/summary.md`:

- What the change does in 2-3 sentences (author intent, inferred from
  the diff and any story/PR description)
- Which files/modules are touched and roughly why
- Any public API shape changes

This summary is passed to **every** parallel reviewer in Stage 4 so they
share a baseline understanding of author intent. It replaces each
reviewer having to re-infer what the PR is trying to do.

---

## Step 5 (Pipeline Stage 3): Standards Discovery

**Model: Haiku.** Spawn a sub-agent that returns a list of file **paths**
(not their contents) for standards and conventions that apply to this
review:

- `CLAUDE.md` files at the repo root and in parent directories of every
  changed file (scope rule: a CLAUDE.md applies to a changed file only
  if it lives at the same path or an ancestor)
- `REVIEW.md` if present
- Any skills passed via `skills_paths` (project coding standards,
  security policy, API conventions, etc.)

Output at `{workspace}/standards/applicable.md`:

```markdown
# Applicable standards for this review

## CLAUDE.md files
- /repo/CLAUDE.md  (applies to all changed files)
- /repo/src/backend/CLAUDE.md  (applies to: src/backend/*.ts)

## Review-specific guidance
- /repo/REVIEW.md  (applies globally)

## Project skills
- ~/.claude/skills/our-api-conventions/SKILL.md
- ~/.claude/skills/security-policy/SKILL.md
```

This list is passed to the Standards Compliance reviewer (R1) in Stage 4.

---

## Step 6 (Pipeline Stage 4): Five Parallel Reviewers

**Model: Sonnet.** Spawn **five reviewer sub-agents in parallel**, each
with its own narrow context. Each agent reads its prompt from
`agents/reviewer.md` plus role-specific instructions, and writes its
report to `{workspace}/rounds/round-{n}/reviewers/r{N}-{name}.md`.

### R1: Standards Compliance
- **Inputs:** diff, summary, `standards/applicable.md` + contents of each
  listed CLAUDE.md / skill
- **Scope:** Flag code that violates explicit, quotable rules. Must
  quote the exact rule being broken.
- **Don't flag:** anything not explicitly in a loaded standard.

### R2: Shallow Bug Scan
- **Inputs:** diff only — **no surrounding file context**
- **Scope:** Bugs visible from the diff alone. Clear logic errors, off-by-one,
  null dereferences, obvious type mismatches, broken control flow.
- **Don't flag:** anything that requires reading the rest of the file to
  confirm.

### R3: Contextual Bug Scan
- **Inputs:** diff + full contents of each changed file + `git blame`
  output for the modified lines
- **Scope:** Bugs that need broader context — regressions against prior
  intent visible in blame, assumptions broken by the change, missing
  updates to callers/callees.
- **Don't flag:** obvious-from-the-diff bugs (R2 owns those — avoid duplicates).

### R4: Security
- **Inputs:** diff + full contents of each changed file
- **Scope:** Input validation, auth/authz, secrets, injection, XSS, CSRF,
  sensitive data exposure, dependency vulnerabilities visible in the diff.
- **Don't flag:** general security hygiene not triggered by the change.

### R5: Story Compliance
- **Inputs:** diff + summary + story/PBI acceptance criteria
- **Scope:** Which acceptance criteria are met, partially met, not met.
  Gaps between the diff and the story.
- **Skip this reviewer** if `review_scope != user-story` and no story is
  attached to the PR.

### Spawning pattern

Each reviewer gets the same base prompt from `agents/reviewer.md` plus a
role-specific section injected as the final instruction. See
`agents/reviewer.md` for the template.

### After all five complete

Merge and deduplicate. Spawn a **Haiku** agent to produce
`{workspace}/rounds/round-{n}/findings-merged.md`:
- Collapse duplicates (same file + same line range + same issue class)
- Preserve all severity tags and reviewer sources on the survivor
- Number findings sequentially

---

## Step 7 (Pipeline Stage 5): Per-Finding Validation

For each merged finding, spawn a validator sub-agent.

### Model selection per finding
- Finding from **R1 (standards)** or **R5 (story)** → **Haiku** validator
- Finding from **R2, R3 (bugs)** or **R4 (security)** → **Opus** validator

### Validator input
- The finding (description, file, lines, category)
- The diff
- The relevant standard or acceptance criterion (for R1/R5 findings)
- The full relevant file (for R2/R3/R4 findings)
- The change summary

### Validator job
Score the finding's confidence that it is a **real, actionable issue**,
using the rubric in `references/confidence-rubric.md` **verbatim**.
Return a single integer 0-100.

### Filtering
- Drop findings with score **< 80**
- Keep findings with score **≥ 80** in `findings-validated.md`

Also apply the don't-flag list from `references/dont-flag.md` as a
sanity check — if a surviving finding matches a don't-flag pattern,
drop it regardless of score and note it in `validations.md`.

Save per-finding validations to `{workspace}/rounds/round-{n}/validations.md`:

```markdown
# Validations — Round {n}

| # | File | Issue | Reviewer | Score | Kept? |
|---|------|-------|----------|-------|-------|
| 1 | src/auth.ts:67 | Missing error handling | R4 | 95 | ✓ |
| 2 | src/util.ts:12 | Variable could be const | R1 | 40 | ✗ |
| 3 | src/api.ts:200 | Consider adding tests | R3 | 70 | ✗ (don't-flag: unprompted test suggestion) |
```

If zero findings survive validation, **skip the Fixer entirely** for
this round and mark the review complete.

---

## Step 8 (Pipeline Stage 6): Spawn the Fixer

**Model: Sonnet.** Same as before — see `agents/fixer.md`. The Fixer now
reads `findings-validated.md` rather than a raw review report. Because
findings have already survived confidence filtering, the Fixer should
approach them as "these are real issues unless you have specific
evidence otherwise." Dispute rights are preserved but the bar is higher.

The Fixer writes to `{workspace}/rounds/round-{n}/fix-report.md`.

---

## Step 9 (Pipeline Stage 7): Iterate, Escalate, or Finalize

This stage is unchanged from the original skill. See
`references/orchestrator-logic.md` for the decision logic.

### After each round
- All validated findings resolved or reasonably deferred → **finalize**
- Unresolved findings, first-time disputes → **next round**
- Same finding disputed ≥ 2 rounds, or `current_round ≥ max_rounds` →
  **escalate to human**

### Next round re-spawns the whole pipeline from Stage 4
The updated diff is fed to a fresh set of five parallel reviewers.
Stages 1-3 do not repeat. Previous round reports are passed as history.

### Finalization
Generate `final-report.md` per `references/report-template.md`.

---

## Orchestrator Responsibilities

1. **Never review code yourself.** Delegate to the parallel reviewers.
2. **Never fix code yourself.** Delegate to the Fixer.
3. **Never validate findings yourself.** Delegate to Validators.
4. **Respect model tiers.** Use Haiku for eligibility/summary/discovery/
   style-validation, Sonnet for reviewers/fixer, Opus for bug-validation.
   If model selection isn't available in the current environment, fall
   back to Sonnet for everything and note it in `session.json`.
5. **Manage workspace state** in `session.json` — rounds, disputes,
   resolutions, validation scores.
6. **Escalate to human** on persistent disputes or round limit.
7. **Use available MCP tools** — Azure DevOps for PR/story details, etc.
8. **Report progress concisely** after each stage.

---

## Progress Reporting

Give the user a terse status after each major stage so they know the
pipeline is progressing:

```
📋 Round 1
  ✓ Eligibility: proceed
  ✓ Summary: change adds JWT auth to /login
  ✓ Standards: loaded 2 CLAUDE.md files, 1 skill
  ⏳ Parallel review: 5 agents running...
  ✓ Parallel review: 14 findings merged
  ⏳ Validating: 14 findings...
  ✓ Validation: 6 kept (8 filtered out — 5 low confidence, 3 don't-flag)
  ⏳ Fixer: applying fixes...
  ✓ Fixer: 4 fixed, 2 disputed
  → Starting round 2 for disputes
```

---

## Integration with Other Skills

Pass `skills_paths` into Stage 3 (standards discovery). The discovered
skills become inputs to R1 (standards compliance). Examples:

- `~/.claude/skills/our-coding-standards/SKILL.md`
- `~/.claude/skills/security-policy/SKILL.md`
- `~/.claude/skills/api-conventions/SKILL.md`

---

## Migration Notes from v1

If you previously used the single-Reviewer version of this skill:

- The single `review-report.md` per round is replaced by five
  `r{N}-{name}.md` reports plus a merged `findings-merged.md` and
  filtered `findings-validated.md`.
- The Fixer reads `findings-validated.md` (not `review-report.md`).
- There is no behavioral change to disputes, escalation, or the
  round limit.
- The confidence threshold defaults to 80. Adjust in `session.json`
  (`confidence_threshold`) if your team wants more or less noise.
