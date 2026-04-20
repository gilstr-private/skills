# Confidence Rubric

This document is passed **verbatim** to every Validator agent. Do not
paraphrase or summarize it when spawning validators — copy it as-is.

The rubric is adapted from Anthropic's Claude Code review plugin. The
five anchor points (0, 25, 50, 75, 100) are deliberately wide apart so
validators can use intermediate values when a finding sits between them.

---

## Score each finding from 0 to 100

**0 — False positive.** The finding is wrong. The code does not have
the problem described. Either the reviewer misread the diff, the rule
cited doesn't scope to this file, or the claimed attack path doesn't
work. Score 0 and say why.

**25 — Weak signal.** There is something in the neighborhood of the
finding, but what the reviewer described isn't quite right. A different
issue might be present, or the issue is so unlikely in practice that
it's not worth flagging. Might be worth a drive-by mention but not
worth the Fixer's attention.

**50 — Plausible.** The issue might be real, but you can't verify it
from the available context, or it's an edge case that depends on
conditions unlikely to occur. A reviewer could reasonably disagree.

**75 — Highly confident.** You double-checked the finding and verified
that it is very likely a real issue that will be hit in practice. The
existing approach in the PR is insufficient. The issue is important and
will directly impact the code's functionality, or it is an issue that
is directly mentioned in the relevant CLAUDE.md.

**100 — Absolutely certain.** You double-checked the finding and
confirmed it is definitely a real issue that will happen frequently in
practice. The evidence directly confirms this. For R1 findings, you
can quote the violated rule and point at the exact code that breaks it.
For bugs, you can describe the concrete input that triggers the
failure. For security, you can describe the concrete exploit.

---

## Threshold

Findings scoring **< 80** are dropped. Findings scoring **≥ 80** proceed
to the Fixer (subject to the don't-flag override).

The threshold default is 80. Adjust via `session.json.confidence_threshold`
if a specific team wants more or less noise.

## Notes on intermediate scores

Scores between anchors are valid and encouraged when a finding doesn't
sit cleanly on an anchor:

- **65**: Strong signal, but you couldn't fully verify from available
  context. Close to 75 but missing one piece of evidence.
- **85**: Very likely real and impactful, not quite "absolutely certain"
  because there's a minor ambiguity in the evidence.
- **40**: Between weak signal and plausible — there's a grain of truth
  but the finding as stated is overreaching.

## What a validator should NOT do

- **Don't penalize for severity.** A MINOR finding can score 100 if
  it's clearly a real minor issue. The score reflects confidence that
  the finding is real, not how important it is.
- **Don't try to calibrate against other findings.** You score one
  finding in isolation.
- **Don't dispute the severity assigned by the reviewer.** If you think
  a MAJOR is really a MINOR, that's the Fixer's call — you just score
  confidence.
- **Don't invent new findings.** If you notice a different issue while
  validating, ignore it. That's not your scope.
