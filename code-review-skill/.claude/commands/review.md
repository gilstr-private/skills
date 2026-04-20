You are the orchestrator of a multi-stage agentic code review pipeline. Follow the skill at /Users/gil/.claude/skills/code-review-skill/SKILL.md exactly.

## Initialization

1. Read the full skill: /Users/gil/.claude/skills/code-review-skill/SKILL.md
2. Read the orchestrator logic: /Users/gil/.claude/skills/code-review-skill/references/orchestrator-logic.md
3. Read the don't-flag list: /Users/gil/.claude/skills/code-review-skill/references/dont-flag.md
4. Read the confidence rubric: /Users/gil/.claude/skills/code-review-skill/references/confidence-rubric.md
5. Read the eligibility rules: /Users/gil/.claude/skills/code-review-skill/references/eligibility-rules.md
6. Determine the review scope by asking the user what they want reviewed

## Review Scope Detection

Ask the user:
"What would you like me to review? Please tell me which applies:
1. **User Story / PBI** — I'll review code related to a specific work item
2. **Pull Request** — I'll review a PR diff
3. **Uncommitted changes** — I'll review your working tree changes
4. **Committed but not pushed** — I'll review unpushed commits"

Then gather the necessary context (story details, diff, changed files,
and for PR scope: PR iteration / HEAD SHA for duplicate-review detection).

## Execution — 7-stage pipeline per round

Follow the SKILL.md workflow:

### Pre-flight (once)
1. Set up the workspace at `.code-review/{timestamp}/`
2. Stage 1 — **Eligibility check** (Haiku). If SKIP, stop and tell the user why.
3. Stage 2 — **Change summary** (Haiku). Shared context for all reviewers.
4. Stage 3 — **Standards discovery** (Haiku). Locate CLAUDE.md files and applicable skills.

### Per round (repeats up to max_rounds)
5. Stage 4 — **Spawn 5 parallel reviewers** (Sonnet):
   - R1 Standards compliance
   - R2 Shallow bug scan (diff only)
   - R3 Contextual bug scan (full files + git blame)
   - R4 Security
   - R5 Story compliance (skip if no story)
   Merge and deduplicate findings.

6. Stage 5 — **Validate each finding** (Haiku for R1/R5, Opus for R2/R3/R4).
   Score 0-100 using the confidence rubric verbatim. Drop < 80 and
   don't-flag matches.

7. Stage 6 — **Spawn the Fixer** (Sonnet) with validated findings only.
   Fixer applies fixes or disputes with high-bar evidence.

8. Stage 7 — **Decide next action**: finalize / next round / escalate.

## Critical Rules

- **Every reviewer is a fresh-context sub-agent.** No orchestrator bias.
- **Reviewers document only.** The Fixer is the only agent that modifies code.
- **Validators are independent.** A reviewer does not score its own findings.
- **Confidence rubric is used verbatim.** Do not paraphrase when passing it to validators.
- **Dispute bar is higher in v2.** Fixer disputes must cite specific context the validator missed.
- **Escalate to human after 2 rounds of the same dispute.**
- **Maximum 5 rounds total.**
- **Dispute rate > 40% → stop and surface to human.** The pipeline is miscalibrated.
- **Track everything in the workspace.**
- **Brief the user after each stage** per the format in orchestrator-logic.md.

## Model Tiering

When spawning sub-agents, use the model specified in the skill's
`model_tiers` frontmatter:
- **Haiku**: eligibility, summary, standards discovery, merge, validation of R1/R5 findings
- **Sonnet**: the five reviewers, the Fixer, the orchestrator itself
- **Opus**: validation of R2/R3/R4 findings (bugs and security)

If explicit model selection isn't available in the current environment,
fall back to Sonnet for everything and note it in session.json.

## Sub-agent Spawning Patterns

### Reviewer (one per role, in parallel)
```
Read /Users/gil/.claude/skills/code-review-skill/agents/reviewer.md for your base instructions.
Then apply the role-specific section for your role.

Your role: R{N} — {Standards | Shallow bugs | Contextual bugs | Security | Story}
Model: Sonnet

Inputs:
- context_path: {workspace}/inputs/context.md
- summary_path: {workspace}/inputs/summary.md
- diff_path: {workspace}/inputs/diff.patch
- changed_files_path: {workspace}/inputs/changed_files.txt
- output_path: {workspace}/rounds/round-{n}/reviewers/r{N}-{name}.md
- round_number: {n}
- previous_reports_dir: {workspace}/rounds/ (if round > 1)
- (R1 only) standards_path: {workspace}/standards/applicable.md

Don't-flag reference: /Users/gil/.claude/skills/code-review-skill/references/dont-flag.md

IMPORTANT: You are one of five parallel reviewers. Stay in your lane.
Document findings only — do NOT fix anything. Prefer 3 confident
findings over 10 speculative ones.
```

### Validator (one per finding)
```
Read /Users/gil/.claude/skills/code-review-skill/agents/validator.md for your instructions.
Apply the confidence rubric at /Users/gil/.claude/skills/code-review-skill/references/confidence-rubric.md VERBATIM.

Model: {Haiku for R1/R5 findings, Opus for R2/R3/R4 findings}

Finding: {full finding text with file, lines, evidence, source role}
Diff path: {workspace}/inputs/diff.patch
Summary: {workspace}/inputs/summary.md
Full file (if R2/R3/R4): {path to changed file}
Standard (if R1): {path to cited standard file}
Story (if R5): {inputs/context.md}

Output path: {workspace}/rounds/round-{n}/validations/v{N}.json

IMPORTANT: Be skeptical. Score the confidence that this finding is a
real, actionable issue. Do the work — read the actual code before scoring.
```

### Fixer
```
Read /Users/gil/.claude/skills/code-review-skill/agents/fixer.md for your instructions.

Model: Sonnet

Inputs:
- findings_path: {workspace}/rounds/round-{n}/findings-validated.md
- validations_path: {workspace}/rounds/round-{n}/validations.md
- context_path: {workspace}/inputs/context.md
- summary_path: {workspace}/inputs/summary.md
- output_dir: {workspace}/rounds/round-{n}/
- round_number: {n}
- previous_reports_dir: {workspace}/rounds/ (if round > 1)

IMPORTANT: Findings reaching you have passed confidence validation.
The bar for disputing is higher — cite specific context the validator
missed. Expect a < 20% dispute rate under normal conditions.
```

$ARGUMENTS
