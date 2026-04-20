# 🔍 Agentic Code Review Skill for Claude Code (v2)

A **multi-agent code review pipeline** with parallel reviewers, confidence-based validation, and iterative fix/dispute resolution.

Architecturally inspired by Anthropic's Claude Code review plugin — adapted for Azure DevOps and enriched with story-compliance review.

## What's new in v2

- **Five parallel reviewers** with narrow context diets (standards, shallow bugs, contextual bugs, security, story) — replaces v1's single-reviewer with six-category checklist
- **Independent Validator agent** confidence-scores each finding 0–100 before it reaches the Fixer (threshold: 80)
- **Explicit don't-flag list** filters known noise (CI-enforced style, generated files, unprompted test suggestions)
- **Pre-flight eligibility check** skips trivial/already-reviewed/automated PRs before running the expensive stages
- **Model tiering** — Haiku for cheap stages, Sonnet for reviewers/fixer, Opus for bug validation

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         ORCHESTRATOR                              │
│                                                                    │
│   ┌─ (1) Eligibility (Haiku) ── skip drafts / dupes / trivial    │
│   ┌─ (2) Summary (Haiku) ─────── shared context for reviewers     │
│   ┌─ (3) Standards (Haiku) ──── locate CLAUDE.md, skills          │
│                                                                    │
│   ┌─ (4) 5 parallel reviewers (Sonnet)                            │
│   │       R1 Standards    R2 Shallow bugs   R3 Contextual bugs   │
│   │       R4 Security     R5 Story compliance                    │
│   │                                                                │
│   ┌─ (5) Validators (Haiku/Opus) ── confidence 0-100, keep ≥80   │
│   ┌─ (6) Fixer (Sonnet) ──────── fix or dispute (raised bar)     │
│   └─ (7) Loop → Escalate → Finalize                               │
└──────────────────────────────────────────────────────────────────┘
                                  ↑
                                  │
                              HUMAN (for unresolved disputes)
```

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Five parallel reviewers | Narrow context diets = cheaper per agent + catch different issue classes |
| Separate Validator agent | Detection and validation are different jobs; Validator kills false positives before they become disputes |
| Confidence rubric given verbatim | Concrete anchors (0/25/50/75/100) produce calibrated scores |
| Don't-flag list enforced | Explicit negative list protects against the AI-reviewer noise problem |
| Eligibility pre-flight | Most cost savings come from skipping trivial PRs entirely |
| Reviewer never fixes code | Separation of concerns; findings stay objective |
| Fixer can dispute with evidence | Prevents rubber-stamp compliance — but dispute bar is higher since findings are pre-validated |
| Max 5 rounds | Prevents infinite loops |
| Human escalation after 2 rounds of same dispute | Genuine disagreements need human judgment |
| Dispute rate > 40% → stop | Indicates pipeline miscalibration |

## Installation

```bash
# Clone/copy this skill directory to your machine, then:
bash install.sh /path/to/your/project

# Or install in the current project:
bash install.sh .
```

This creates `.claude/commands/review.md` in your project.

## Usage

In Claude Code:

```
/review
```

Claude will ask you what to review:

1. **User Story / PBI** — reviews code for a specific work item
2. **Pull Request** — reviews a PR diff
3. **Uncommitted changes** — reviews your working tree
4. **Committed but not pushed** — reviews unpushed commits

### Force a review past eligibility check

```
/review --force
```

Useful when the pre-flight wants to skip (e.g., "already reviewed") but you want a fresh pass.

## The Five Reviewers

| # | Reviewer | Context diet | Catches |
|---|----------|--------------|---------|
| R1 | Standards compliance | CLAUDE.md / skills + diff | Quotable rule violations |
| R2 | Shallow bug scan | **Diff only** | Obvious-from-the-diff bugs |
| R3 | Contextual bug scan | Diff + full files + blame | Regressions, broken caller assumptions, concurrency |
| R4 | Security | Diff + full files | Input validation, authz, secrets, injection |
| R5 | Story compliance | Diff + acceptance criteria | Missing/partial criteria, scope creep |

R2 deliberately does NOT read surrounding files — this is the key insight from Anthropic's plugin. It catches obvious bugs fast and cheaply; R3 handles the deeper analysis.

## Severity Levels

| Severity | Meaning | Loop behavior |
|----------|---------|----------------|
| 🔴 CRITICAL | Must fix. Security vuln, data loss, crash | Blocks completion |
| 🟠 MAJOR | Should fix. Design issue, logic bug | Blocks completion |
| 🟡 MINOR | Fix recommended | Can be deferred |
| 🔵 SUGGESTION | Nice to have | Auto-resolvable |

## Confidence Scoring

Every finding is scored 0-100 by an independent Validator:

- **0** — False positive
- **25** — Weak signal
- **50** — Plausible
- **75** — Highly confident
- **100** — Absolutely certain

Default threshold: **80**. Findings below the threshold are dropped silently. The rubric is applied verbatim to each validator. See `references/confidence-rubric.md`.

## Don't-Flag List

Certain findings are dropped regardless of confidence:
- CI-enforced concerns (lint, formatting, types)
- Generated/vendored files
- Test-only intentional violations
- Unprompted test/documentation suggestions
- Vague or speculative findings

See `references/dont-flag.md` for the full list. Add project-specific patterns by creating a `REVIEW.md` at your repo root — the standards discovery stage picks it up automatically.

## Workspace Structure

Each review session creates:

```
.code-review/
└── 2026-04-19T14-30-00-auth-feature/
    ├── inputs/
    │   ├── context.md
    │   ├── diff.patch
    │   ├── changed_files.txt
    │   └── summary.md              ← Stage 2 output
    ├── standards/
    │   └── applicable.md           ← Stage 3 output
    ├── eligibility.md              ← Stage 1 output
    ├── rounds/
    │   ├── round-1/
    │   │   ├── reviewers/
    │   │   │   ├── r1-standards.md
    │   │   │   ├── r2-shallow-bugs.md
    │   │   │   ├── r3-contextual-bugs.md
    │   │   │   ├── r4-security.md
    │   │   │   └── r5-story-compliance.md
    │   │   ├── findings-merged.md       ← After dedupe
    │   │   ├── validations.md           ← Confidence scores
    │   │   ├── findings-validated.md    ← Kept findings (score ≥ 80)
    │   │   └── fix-report.md
    │   └── round-2/ ...
    ├── disputes/
    │   └── dispute-1.md
    ├── final-report.md
    └── session.json
```

## File Structure

```
code-review-skill/
├── SKILL.md                             # Main orchestrator (7-stage pipeline)
├── README.md                            # This file
├── install.sh                           # Installation script
├── agents/
│   ├── reviewer.md                      # Base reviewer template with R1-R5 roles
│   ├── validator.md                     # NEW: confidence-scoring validator
│   └── fixer.md                         # Fixer (raised dispute bar)
├── commands/
│   └── review.md                        # Claude Code slash command
└── references/
    ├── confidence-rubric.md             # NEW: 0-100 rubric, used verbatim
    ├── dont-flag.md                     # NEW: explicit negative list
    ├── eligibility-rules.md             # NEW: Stage 1 pre-flight
    ├── orchestrator-logic.md            # Decision logic (updated for v2)
    ├── review-categories.md             # Category → reviewer mapping
    └── report-template.md               # Final report format
```

## Customization

### Adjust confidence threshold

In `session.json` at the start of a review, or set the default in `SKILL.md`:
```json
"confidence_threshold": 80
```

### Adjust round limits

In `SKILL.md`:
```json
"max_rounds": 5
```

### Add project-specific standards

Create `REVIEW.md` at your repo root — Stage 3 will pick it up and R1 will apply it. Structure it like Anthropic's example: recalibrated severity, capped nits, explicit don't-check lists.

### Add project-specific don't-flag patterns

Add to `REVIEW.md` under a `## Do not report` section. Validators will honor it via the override mechanism.

## Migration from v1

If you were using v1 (single reviewer with six-category checklist):

- The single `review-report.md` per round is replaced by five `r{N}-{name}.md` reports plus a merged/validated set.
- The Fixer now reads `findings-validated.md` instead of `review-report.md`.
- Workflow, disputes, escalation, and round limits are unchanged.
- Existing `.code-review/` workspaces from v1 remain readable but won't be extended.
- Reinstall to pick up the new files: `bash install.sh .`

## FAQ

**Q: Why five reviewers instead of one with a checklist?**
A: Narrow context diets cost less per agent and catch different classes of things. The shallow bug scanner (R2) looking at *only the diff* catches obvious bugs that a wider-context reviewer drowns in possibilities. The contextual scanner (R3) with full files catches regressions the narrow one can't. One agent with everything in context tries to do both jobs and often does neither well.

**Q: Why is R2 deliberately starved of context?**
A: It's the insight from Anthropic's plugin. Obvious bugs are obvious from the diff. Giving R2 the full file biases it toward speculation ("this might be called from elsewhere..."). R3 exists for that kind of analysis. Letting each agent specialize makes the pipeline cheaper and higher-signal.

**Q: What does the Validator actually add?**
A: It's the thing that makes the Fixer trust the pipeline. Reviewers are incentivized to surface things; the Validator is incentivized to kill false positives. Separating those incentives fixes the biggest failure mode of AI code review — developer trust collapsing after a couple of bad flags.

**Q: What if a finding scores exactly 80?**
A: Kept. Threshold is `< 80` drops, `≥ 80` keeps.

**Q: Can the Fixer still dispute?**
A: Yes. But the bar is higher — findings have already passed validation, so disputes must cite specific context the validator missed (e.g., a convention in another file, an ADR, an upstream constraint). Expect < 20% dispute rate normally.

**Q: What happens if the dispute rate is high?**
A: At > 40% in a round, the orchestrator stops and surfaces it to you. Usually it means either the validator is miscalibrated for your repo (threshold too lenient) or the Fixer has context the reviewers don't (maybe a missing CLAUDE.md rule that should be written down).

**Q: Does this work with Azure DevOps?**
A: Yes. If the Azure DevOps MCP server is configured, the orchestrator will use it for fetching story details, PR diffs, and detecting duplicate reviews in the eligibility stage.

**Q: Where did "prior PR comments" from Anthropic's plugin go?**
A: Dropped for the ADO context because it was GitHub-CLI-specific (used `gh pr view --comments`). If you want to port it back for ADO, add a sixth reviewer role that pulls comments via the Azure DevOps MCP and checks the current diff against prior PR feedback on the same files.
