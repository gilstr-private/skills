# Orchestrator Decision Logic

Reference guide for the orchestrator's decision-making during the
review loop. This document reflects the 7-stage pipeline introduced in
v2 of the skill.

---

## Per-stage responsibilities

Within each round, the orchestrator runs the pipeline stages in order:

| Stage | Model | Outputs | Must-check |
|-------|-------|---------|------------|
| 1. Eligibility | Haiku | `eligibility.md` | If SKIP, stop pipeline and report to user |
| 2. Summary | Haiku | `inputs/summary.md` | Sanity check — summary actually reflects the diff |
| 3. Standards discovery | Haiku | `standards/applicable.md` | Paths exist and files are readable |
| 4. Parallel review | Sonnet × 5 | `reviewers/r{N}-*.md` | All five (or four if R5 skipped) completed |
| 4b. Merge | Haiku | `findings-merged.md` | Duplicates collapsed, all source roles preserved |
| 5. Validation | Haiku / Opus per finding | `validations.md`, `findings-validated.md` | Every finding scored exactly once |
| 6. Fixer | Sonnet | `fix-report.md` | Dispute rate sanity-checked (< ~20% expected) |
| 7. Decision | (orchestrator) | updated `session.json` | Pick: finalize / next round / escalate |

---

## Finding states (unchanged from v1)

```
RESOLVED    — Fixer applied a fix, no further action needed
DISPUTED    — Fixer disagrees with the finding (new, round N)
DEFERRED    — Fixer acknowledges but defers to later
PARTIAL     — Fixer partially addressed, reviewer may accept or re-raise
REGRESSION  — Fixer's changes introduced a new issue (raised by R2/R3 in round N+1)
```

## Agreement matrix (unchanged)

| Reviewer Says | Fixer Says | Round | Action |
|---------------|------------|-------|--------|
| Finding X | Fixed | 1+ | Mark RESOLVED, verify in next round |
| Finding X | Disputed | 1 | Include in next round for reviewers to reconsider |
| Finding X | Disputed | 2 (same finding) | **Escalate to human** |
| Finding X | Deferred | 1+ | Mark DEFERRED, include in final report |
| Finding X | Partial fix | 1+ | Include in next round for reviewers to evaluate |
| (new) Regression | — | 2+ | Treat as new finding in current round |

---

## When to start a new round

Start a new round when:
- Findings with status DISPUTED (first time)
- Findings with status PARTIAL
- Reviewers found regressions in the fixer's changes
- The fixer has open questions for the reviewer

Do NOT start a new round when:
- All findings are RESOLVED or DEFERRED
- Only SUGGESTION-level findings remain disputed
- The round limit has been reached
- **New in v2**: if Stage 5 validation returned zero kept findings, skip
  the Fixer for this round and mark the review complete (nothing to do).

---

## Next-round pipeline re-entry

When spawning round N+1, the orchestrator re-runs **only stages 4-7**.
Stages 1-3 (eligibility, summary, standards) do not repeat — their
outputs are stable across rounds for the same review session.

The round-N+1 reviewers get:
1. The **updated diff** (re-computed after Fixer's changes)
2. The original `summary.md` (Stage 2 output, not re-generated)
3. The original `standards/applicable.md` (Stage 3 output)
4. A `history.md` summarizing prior rounds' disputes and resolutions
5. Instructions to focus on: unresolved findings, regressions, and
   anything the Fixer questioned in their open-questions section

---

## When to escalate to human

Escalate when:
- **Same finding disputed twice** — the core disagreement isn't resolving
- **Round limit reached** with unresolved CRITICAL or MAJOR findings
- **Dispute rate > 40%** in a single round — signals review calibration
  is off; a human should check whether the validator threshold or the
  don't-flag list needs tuning
- **Scope creep** — the review is expanding beyond the original change
- **Ambiguous requirements** — both agents have valid interpretations
- **Security vs. usability trade-off** — legitimate competing concerns

---

## Dispute rate as a pipeline health metric

New in v2: the Fixer reports its dispute rate (disputes / validated findings).

- **< 10%**: pipeline well-calibrated, proceed as normal
- **10-20%**: normal variation, proceed
- **20-40%**: consider whether validation threshold is too lenient for
  this repo; flag but proceed
- **> 40%**: stop and surface to human — the pipeline is generating
  findings the Fixer rejects at high rates, indicating either a
  miscalibrated validator or an author/reviewer context mismatch

---

## Human communication per stage

### After eligibility
Only message if SKIP. On ELIGIBLE, proceed silently to Stage 2.

### After Stage 4 (parallel review)
```
📋 Round {N} — parallel review complete
  R1 Standards:    {x} findings
  R2 Shallow bugs: {x} findings
  R3 Context bugs: {x} findings
  R4 Security:     {x} findings
  R5 Story:        {x} findings  ({skipped if no story})
  Merged:          {total} unique findings
  ⏳ Validating...
```

### After Stage 5 (validation)
```
  ✓ Validation: {kept}/{total} kept
    {x} dropped (confidence < 80)
    {y} dropped (don't-flag override)
```

### After Stage 6 (fix)
```
  ✓ Fixer: {fixed} fixed, {disputed} disputed, {deferred} deferred
  Dispute rate: {percentage}% ({health assessment})
  → {next action}
```

### When escalating a dispute
```
⚠️ The reviewer and fixer disagree on this finding after {N} rounds.

**Finding**: {title}
**Validator score**: {0-100}
**Reviewer (role {R}) says**: {1-2 sentences}
**Fixer says**: {1-2 sentences}

What would you like to do?
1. Accept the finding (fixer will implement)
2. Dismiss the finding (move on)
3. Something else (please explain)
```

### When finalizing
```
✅ Code review complete after {N} rounds.
  - {total validated findings} addressed
  - {fixed} fixed, {dismissed} dismissed, {deferred} deferred
  - Pipeline health: {dispute rate summary}

Full report: {path to final-report.md}
```

---

## Session state management

Update `session.json` after each stage. New fields in v2:

```json
{
  "created_at": "<ISO>",
  "review_scope": "<scope>",
  "branch": "<branch>",
  "story": "<title or N/A>",
  "status": "in-progress",
  "current_round": 1,
  "max_rounds": 5,
  "confidence_threshold": 80,
  "eligibility": {
    "verdict": "ELIGIBLE",
    "reason": null
  },
  "rounds": [
    {
      "round": 1,
      "reviewer_counts": {
        "R1": 3, "R2": 2, "R3": 5, "R4": 1, "R5": 3
      },
      "merged_findings": 12,
      "validated_findings": 6,
      "dropped_low_confidence": 5,
      "dropped_override": 1,
      "fixed": 4,
      "disputed": 2,
      "deferred": 0,
      "dispute_rate": 0.33
    }
  ],
  "disputes": [
    {
      "finding": "Finding 3: missing input validation",
      "source_role": "R4",
      "validator_score": 85,
      "raised_round": 1,
      "rounds_disputed": [1, 2],
      "escalated_round": 2,
      "human_decision": "accept",
      "human_rationale": "Input validation required by security policy"
    }
  ],
  "resolution": null
}
```

---

## Edge cases (updated)

### All findings dropped at validation
Round emits zero kept findings. Skip the Fixer stage. If this is
round 1, finalize immediately with an "all findings filtered as low
confidence or don't-flag — no actionable issues found" report. If
round 2+, finalize any previously-deferred items and close.

### Fixer introduces regressions visible in round N+1
R3 (contextual bugs) in round N+1 will typically catch these. Treat as
NEW findings in round N+1, not reraised — they're regressions, not the
original issue.

### All findings are SUGGESTION-level
Offer the user auto-accept as in v1. But note: SUGGESTION findings
rarely survive validation at score ≥ 80, so this edge case is less
common under v2.

### Empty review after parallel stage
If all five reviewers return zero findings, skip validation entirely
and generate an abbreviated final report. Document positive
observations from the reviewers if any were noted.

### Validator disagrees with itself across findings
Not really an edge case — validators score one finding in isolation.
Inconsistency across findings is expected and fine. Don't try to
reconcile.
