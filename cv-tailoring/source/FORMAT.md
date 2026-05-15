# CV Markdown Format Specification

This document describes the strict markdown structure expected by `build_base_cv.js`. The build script is a focused parser — it expects this format. Arbitrary markdown will not work.

## File structure (in order)

```
# {Name}

**{Title line — pipe-separated targets, e.g. "CTO · VP R&D · Chief Architect"}**
{Contact line — pipe-separated: location · email · phone · linkedin}

---

## Profile

{Single paragraph of profile text.}

---

## Experience

### {Role Title} · {Company Name}
**{Location · Date range}**
*{Optional italic sub-line — only if needed, e.g. "Joined as X in YYYY; promoted to Y in YYYY."}*

{Single paragraph describing role context.}

- {Bullet 1 — may use **bold lead-in** at the start}
- {Bullet 2}
- {Bullet 3}

### {Next role — same structure}
...

### Earlier Roles

{Single line of dot-separated earlier roles.}

---

## Technical Skills

**{Category 1}:** {dot-separated items}

**{Category 2}:** {dot-separated items}

**{Category 3}:** {dot-separated items}

---

## Education

**{Degree title}** · {Institution} · {Year range}

## Military Service

**{Role title}**, {Unit} · {Year range} · {Brief detail}
```

## Hard rules

1. **Section headers are exactly:** `## Profile`, `## Experience`, `## Technical Skills`, `## Education`, `## Military Service`. The build script keys off these names. Don't change them without also changing the parser.

2. **Role headers are H3 (`###`) with `Title · Company` format.** The script splits on the first ` · ` to separate them.

3. **Date line is the bold line immediately following the role header,** with format `**Location · Date range**`. Script splits on ` · ` to separate location and dates.

4. **Optional italic sub-line** comes after the date line if present. Recognized by leading `*` and trailing `*` on a single line, no surrounding asterisks elsewhere.

5. **Role description paragraph** comes after the date line (and optional italic line) and before the bullets. One or more non-blank lines until the first bullet.

6. **Bullets start with `- `.** Bold lead-ins are written as `- **Bold lead-in.** Rest of bullet.` and the parser will style the bold portion accordingly.

7. **Earlier Roles section** is a single H3 under Experience with one paragraph (no bullets). Dot-separated entries.

8. **Skills lines** are each `**Category:** items`. The script parses the bold portion as the category label.

9. **Education and Military Service** are single bold-prefix lines with dot-separated detail.

10. **Section separators (`---`)** are visual aids in the markdown but ignored by the parser. The H2 headers are what trigger section changes.

## Editing rules

When tailoring:
- You can swap entire bullets within a role.
- You can swap the entire profile paragraph.
- You can reorder bullets within a role.
- You can change the role description paragraph.
- You can adjust skills line contents.
- **Don't change section names or role-header structure** — it will break the build.

## Regenerating the docx

```bash
node build_base_cv.js base_cv.md base_cv.docx
```

The script takes two arguments: input markdown path, output docx path.
