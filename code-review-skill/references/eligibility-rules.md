# Eligibility Rules

This document is the rubric for the Stage 1 eligibility check. A Haiku
sub-agent reads it and determines whether to proceed with the full
pipeline or skip.

The purpose is to avoid running the expensive parallel-reviewer stage
on changes that don't benefit from deep review.

---

## Decision order

Check each rule in order. The first matching rule wins.

### 1. User force override → PROCEED
If the user invoked with `--force` or said "review this anyway", proceed
regardless of other rules.

### 2. Draft or WIP → SKIP
- PR is marked Draft
- PR title contains `[WIP]`, `WIP:`, or `DO NOT MERGE`
- Branch name starts with `wip/` or `draft/`

**Verdict**: `SKIP: draft or WIP`

### 3. Already reviewed → SKIP
For PR scope only: check the Azure DevOps MCP for existing comments by
this skill on the same PR iteration (or HEAD SHA).
- If a prior review exists on the current iteration → SKIP
- If a prior review exists on a previous iteration and new commits have
  been pushed → PROCEED (fresh review on new content)

**Verdict**: `SKIP: already reviewed this iteration`

### 4. Automated / bot PR → SKIP
- Author is a known bot account (dependabot, renovate, etc.)
- PR title matches bot patterns (`chore(deps): bump ...`, etc.)

**Exception**: if the bot PR involves more than just lockfile changes
(e.g., a dependency bump that also required manual code changes to
adapt), PROCEED.

**Verdict**: `SKIP: automated dependency bump, no manual code changes`

### 5. Trivial changes → SKIP
All of:
- Fewer than 10 non-generated lines changed
- No changes to files matching `*.ts`, `*.tsx`, `*.js`, `*.jsx`,
  `*.py`, `*.go`, `*.rs`, `*.java`, `*.cs`, `*.rb` (or project's
  primary languages)
- Only touches one of: `*.md`, `*.txt`, `*.yml` (non-workflow),
  `package.json` (version field only), `CHANGELOG.md`

**Verdict**: `SKIP: trivial documentation or version change`

### 6. Only generated files → SKIP
Every changed file matches a generated-file pattern from
`references/dont-flag.md`.

**Verdict**: `SKIP: only generated files changed`

### 7. Whitespace / formatting only → SKIP
The diff contains only whitespace changes, newline differences, or
pure formatting changes (detectable via `git diff --ignore-all-space`
being empty).

**Verdict**: `SKIP: whitespace or formatting only`

### 8. Otherwise → PROCEED

**Verdict**: `ELIGIBLE`

---

## Output format

Write a single JSON object to `{workspace}/eligibility.md`:

```json
{
  "verdict": "ELIGIBLE",
  "reason": null,
  "checked_rules": ["draft", "already_reviewed", "automated", "trivial", "generated", "whitespace"]
}
```

Or on skip:

```json
{
  "verdict": "SKIP",
  "reason": "already reviewed this iteration",
  "checked_rules": ["draft", "already_reviewed"],
  "matched_rule": "already_reviewed"
}
```

---

## User messaging on skip

The orchestrator should tell the user why the pipeline stopped:

```
Eligibility check: SKIP
Reason: already reviewed this iteration

To force a review anyway, run: /review --force
```

Keep this brief. Don't re-explain the pipeline; just state the reason.

---

## Cost note

The eligibility check runs on Haiku and reads only the diff header and
file list, so it costs roughly 1% of a full review. Skipping early on
trivial PRs is the single biggest cost saver in the pipeline.
