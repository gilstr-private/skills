# CV System Config

**Content directory:** `/Users/gil/Library/CloudStorage/Dropbox-Strauss/Gil Strauss/CV/`

**Files in that directory:**
- `master_cv.md` — the reservoir
- `base_cv.md` — the editable base CV
- `base_cv.docx` — built artifact
- `tailored_*.md` — per-application tailored versions
- `tailored_*.docx` — built docx per application
- `journal.md` — application tracking journal (if using)
- `jds/` — saved job descriptions (if collecting)
- `Versions/` - keep history of each cv i applied.

**Build command from the content directory:**
`node ~/.claude/skills/cv-tailoring/build_base_cv.js <input.md> <output.docx>`