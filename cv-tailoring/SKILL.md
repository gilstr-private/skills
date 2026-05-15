---
name: cv-tailoring
description: "Use this skill whenever Gil asks for help with his CV, resume, or LinkedIn — including tailoring his CV to a specific job description, updating it after new accomplishments, writing cover letters, prepping interview answers, or refreshing his LinkedIn profile. Triggers include phrases like 'tailor my CV', 'CV for this role', 'update my resume', 'this JD just came in', 'help me apply for', 'refresh my LinkedIn', 'cover letter for', or any uploaded job description PDF/text alongside CV-related discussion. The skill contains Gil's master source document, the editorial principles developed over careful work, the base CV, and methodology for producing tailored variants without losing the voice. Do NOT use for someone else's CV — this skill is specifically calibrated to Gil Strauss."
---

# CV Tailoring — Gil Strauss

This skill is Gil's personal CV system. It contains everything needed to produce a tailored CV for any specific opportunity without redoing the foundational work each time.

## What this skill contains

- **`source/master_cv.md`** — The full source document. Every defensible claim, multiple phrasings, full role detail, interview-prep material. This is the *reservoir*, never sent anywhere.
- **`source/base_cv.md`** — The lean, universal CV (~1 page) in markdown. **This is the editable single source of truth for the CV.** Always edit this file when tailoring.
- **`source/base_cv.docx`** — A polished Word document, *regenerated from* `base_cv.md` by running the build script. Never edited directly.
- **`source/FORMAT.md`** — The strict markdown format that `base_cv.md` must follow. Read this before editing the markdown.
- **`source/build_base_cv.js`** — The build script: `node build_base_cv.js base_cv.md base_cv.docx`. Requires `docx` npm package (`npm install -g docx`).
- **`principles.md`** — The editorial principles. Read this before writing anything.
- **`methodology.md`** — Step-by-step process for tailoring to a specific JD.
- **`interview_prep.md`** — Stock answers to expected interview questions.

## When invoked

Read `principles.md` first. Then read `methodology.md` to confirm the right workflow for the request type. The master document is large; read it section-by-section as needed rather than all at once.

## Default behavior

If Gil asks to tailor the CV to a specific job description:
1. Read `principles.md` and `methodology.md`.
2. Ask Gil for the JD (paste, link, or file).
3. Run the tailoring workflow from `methodology.md`.
4. Edit a *copy* of `source/base_cv.md` (e.g., `tailored_for_<company>.md`), preserving the format described in `source/FORMAT.md`.
5. Show Gil the tailored markdown and ask him to confirm content.
6. When approved, regenerate the docx: `node source/build_base_cv.js tailored_for_<company>.md tailored_for_<company>.docx`.
7. Recommend Gil open the docx, sanity-check the visual rendering, and export to PDF before sending.

If Gil asks to update the master document (new accomplishment, change of role, new metric):
1. Read `principles.md`.
2. Edit `source/master_cv.md` to add the new material.
3. Ask whether the base CV (`source/base_cv.md`) should also be updated; if yes, edit it and rebuild the docx.

If Gil asks for a cover letter:
1. Read `principles.md` and `interview_prep.md`.
2. Read the JD (ask Gil for it if not provided).
3. Draft a cover letter that pulls from the source document. Aim for 3–4 paragraphs, distinctive voice (match the base CV's first-person summary tone), no generic openings.

If Gil asks for a LinkedIn update:
1. Read `principles.md`.
2. Refer to the existing `linkedin_package.md` if present; if not, produce one (headline, About section, Experience entry corrections to match the base CV).

## What not to do

- Don't paraphrase the master document into the CV directly. The base CV represents *deliberate cuts*; reintroducing detail dilutes it.
- Don't invent new claims. Everything in any tailored CV must trace back to a verified claim in `source/master_cv.md`.
- Don't change Gil's voice. The first-person summary is intentional and distinctive.
- Don't tailor to the point of dishonesty. Cutting irrelevant bullets is tailoring; reordering emphasis is tailoring; inventing experience is not.
- Don't propose changes that violate `principles.md` without flagging that you're doing so and explaining why.

## Maintenance

This skill is intended to evolve. After every tailored CV, ask Gil:
- "Should I save anything from this round (a new phrasing, a new metric, a new framing) back to the master document?"

If yes, append to the appropriate section of `source/master_cv.md`.
