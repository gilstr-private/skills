# Review Categories — Quick Reference

This file used to contain the full category checklists. Those have
**moved into the role-specific sections** of `agents/reviewer.md`, where
each of the five parallel reviewers has its own scope.

This file now serves as a lookup index: "which reviewer owns this
concern?"

---

## Category → Reviewer mapping

| Category | Owner | Notes |
|----------|-------|-------|
| Standards / conventions | R1 | Requires a quotable rule in a loaded CLAUDE.md or skill |
| Design patterns (SOLID, DRY, KISS) | R1 | Only if in a loaded standard; otherwise don't flag |
| Logic errors (diff-visible) | R2 | No surrounding file context |
| Logic errors (context-dependent) | R3 | Requires full files + blame |
| Edge cases (null, boundaries, errors) | R2 or R3 | R2 if obvious in diff, R3 if requires caller/callee analysis |
| Concurrency, race conditions | R3 | Almost always needs full-file context |
| Input validation | R4 | |
| Auth/authz checks | R4 | |
| Secrets, sensitive data | R4 | |
| Injection (SQL, XSS, CSRF) | R4 | |
| Code smells (long methods, magic numbers) | R1 | Only if project standard mandates — otherwise don't flag |
| Naming | R1 | Only if project standard exists — otherwise don't flag |
| Test coverage | R1 if standard mandates it; otherwise don't flag | See don't-flag list |
| Documentation / comments | R1 if standard mandates; otherwise don't flag | See don't-flag list |
| Acceptance criteria | R5 | |
| Scope creep | R5 | SUGGESTION severity only |

---

## If a category isn't in the table

It's not reviewed by default. The pipeline is deliberately narrow —
anything not owned by a reviewer is assumed to be someone else's
responsibility (CI, the author, the team). If your project needs a
concern reviewed that isn't in the table, add it as a rule to your
`REVIEW.md` so R1 can pick it up.

---

## Historical: the old "6-category" list

For reference, v1 of this skill had six categories (Design,
Correctness, Security, Quality, Testing, Requirements) all handled by a
single reviewer. The new pipeline splits these across five parallel
reviewers with narrower context diets, validated by an independent
Validator. The new architecture:

- Catches more (five agents in parallel with different information access)
- Flags less noise (validator drops low-confidence findings before the Fixer sees them)
- Costs less per round (narrow context diets, Haiku for eligibility/validation)
- Converges faster (fewer false positives → fewer disputes → fewer rounds)
