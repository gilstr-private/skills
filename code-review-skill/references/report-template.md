# Final Report Template

Use this template when generating `final-report.md` after all rounds
are complete. Updated for v2 pipeline with validator scores and
per-reviewer breakdowns.

---

```markdown
# Code Review — Final Report

## Session Info
- **Date**: {ISO date}
- **Scope**: {user-story | pull-request | uncommitted | unpushed}
- **Branch**: {branch name}
- **Story/PBI**: {title or N/A}
- **Total Rounds**: {count}
- **Resolution**: {agreement | human-decided | round-limit-reached | skipped-eligibility}
- **Confidence threshold**: {value, default 80}

---

## Executive Summary

{3-5 sentence summary: what was reviewed, overall quality level, key
improvements made, and current status. Written for a tech lead who
wants the quick version.}

---

## Pipeline Health

- **Total raw findings** (sum across all rounds): {count}
- **Kept after validation**: {count} ({percentage}%)
- **Dropped — low confidence**: {count}
- **Dropped — don't-flag override**: {count}
- **Fixer dispute rate**: {percentage}% (overall across all rounds)
- **Pipeline health assessment**: {Excellent | Good | Calibration needed}

### Per-reviewer contribution

| Reviewer | Raw findings | Kept (≥80) | Fix rate | Notes |
|----------|--------------|------------|----------|-------|
| R1 Standards | {n} | {n} | {n}/{m} | |
| R2 Shallow bugs | {n} | {n} | {n}/{m} | |
| R3 Contextual bugs | {n} | {n} | {n}/{m} | |
| R4 Security | {n} | {n} | {n}/{m} | |
| R5 Story | {n} | {n} | {n}/{m} | |

---

## Findings Overview (validated findings only)

| # | Finding | Severity | Source | Score | Resolution |
|---|---------|----------|--------|-------|-----------|
| 1 | {title} | 🔴 CRITICAL | R4 | 95 | ✅ Fixed |
| 2 | {title} | 🟠 MAJOR | R3 | 88 | ✅ Fixed |
| 3 | {title} | 🟡 MINOR | R1 | 82 | ❌ Dismissed (Human) |
| 4 | {title} | 🔵 SUGGESTION | R5 | 80 | ⏭️ Deferred |

### By Severity
- 🔴 Critical: {X found, Y fixed, Z dismissed}
- 🟠 Major: {X found, Y fixed, Z dismissed}
- 🟡 Minor: {X found, Y fixed, Z dismissed}
- 🔵 Suggestion: {X found, Y fixed, Z dismissed}

### By Source Role
- R1 Standards compliance: {count}
- R2 Shallow bugs: {count}
- R3 Contextual bugs: {count}
- R4 Security: {count}
- R5 Story compliance: {count}

---

## Detailed Resolutions

### Finding {N}: {title}

- **Severity**: {level}
- **Source role**: {R1-R5}
- **Validator score**: {0-100}
- **Resolution**: {Fixed | Dismissed | Deferred | Human Decision}
- **Resolved in**: Round {n}

**Original Finding**: {brief description}

**Resolution Details**: {What was done — the fix applied, or why it was
dismissed, or the human's decision and rationale}

---

## Story Compliance (if applicable)

| # | Acceptance Criterion | Status | Evidence |
|---|---------------------|--------|----------|
| 1 | {criterion} | ✅ MET | {file:line} |
| 2 | {criterion} | ❌ NOT MET | {what's missing} |
| 3 | {criterion} | ⚠️ PARTIAL | {what's done vs missing} |

---

## Human Decisions

### Decision {N}: {Finding title}
- **Reviewer (R{X}) said**: {summary}
- **Fixer said**: {summary}
- **Validator scored**: {0-100}
- **Human decided**: {Accept / Dismiss / Modify}
- **Rationale**: {human's reasoning}

---

## Filtered Findings (informational)

Findings that did not reach the Fixer. Included for transparency and to
help tune the pipeline if patterns emerge.

### Dropped — low confidence (score < 80)

| # | Finding | Source | Score | Validator note |
|---|---------|--------|-------|----------------|
| 1 | {title} | R{X} | {n} | {one-line justification} |

### Dropped — don't-flag override

| # | Finding | Source | Score | Override reason |
|---|---------|--------|-------|-----------------|
| 1 | {title} | R{X} | {n} | {pattern name} |

---

## Deferred Items

| # | Finding | Severity | Reason for Deferral | Suggested Follow-up |
|---|---------|----------|--------------------|--------------------|
| 1 | {title} | {sev} | {reason} | {what to do later} |

---

## Quality Metrics

- **First-round validated findings**: {count}
- **Fixed on first attempt**: {count} ({percentage}%)
- **Required multiple rounds**: {count}
- **Disputes raised**: {count}
- **Disputes resolved by agreement**: {count}
- **Disputes resolved by human**: {count}
- **Total rounds**: {count}
- **Average validator score of kept findings**: {average}

---

## Recommendations

{Post-review recommendations — patterns to adopt, tech debt, process
improvements, or tuning suggestions for the review pipeline itself.}

### Code recommendations
1. {recommendation}
2. {recommendation}

### Pipeline tuning (if applicable)
{e.g., "R1 produced many findings that were dropped by the don't-flag
list — consider updating REVIEW.md to make those rules explicit so R1
stops surfacing them" or "R4 caught N issues this round; security may
warrant a dedicated checklist in CLAUDE.md"}
```
