#!/usr/bin/env node
/**
 * build_base_cv.js
 *
 * Reads a CV in the format specified by FORMAT.md and produces a polished
 * docx file. Designed specifically for Gil Strauss's CV format, not arbitrary
 * markdown.
 *
 * Usage:
 *   node build_base_cv.js [input.md] [output.docx]
 *
 * Defaults to base_cv.md / base_cv.docx in the current directory.
 */

const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, AlignmentType, LevelFormat,
  BorderStyle, TabStopType, TabStopPosition,
} = require('docx');

// ---------- style constants ----------

const DARK = "1A1A1A";
const ACCENT = "2E5C8A";  // slate-blue
const MUTED = "555555";
const FONT = "Calibri";

const SIZE_BODY = 21;       // 10.5pt
const SIZE_ROLE = 23;       // 11.5pt
const SIZE_SECTION = 22;    // 11pt
const SIZE_NAME = 40;       // 20pt
const SIZE_TITLE = 24;      // 12pt
const SIZE_CONTACT = 20;    // 10pt

// ---------- markdown parsing ----------

function parseCV(md) {
  const lines = md.split('\n');
  const cv = {
    name: '', titleLine: '', contactLine: '', profile: '',
    roles: [], earlierRolesLine: '',
    skills: [], education: '', military: '',
  };

  const isBlank = (s) => /^\s*$/.test(s);
  let i = 0;
  const skipBlanks = () => { while (i < lines.length && isBlank(lines[i])) i++; };

  skipBlanks();
  const nameMatch = lines[i] && lines[i].match(/^#\s+(.+?)\s*$/);
  if (!nameMatch) throw new Error('Expected # Name as first non-blank line');
  cv.name = nameMatch[1];
  i++;
  skipBlanks();

  const titleMatch = lines[i] && lines[i].match(/^\*\*(.+?)\*\*\s*$/);
  if (!titleMatch) throw new Error('Expected bold title line (**...**) after name');
  cv.titleLine = titleMatch[1];
  i++;

  if (i < lines.length && !isBlank(lines[i])) {
    cv.contactLine = lines[i].trim();
    i++;
  }

  while (i < lines.length) {
    const h2 = lines[i].match(/^##\s+(.+?)\s*$/);
    if (h2) {
      const section = h2[1].trim();
      i++;
      if (section === 'Profile')               i = parseProfile(lines, i, cv);
      else if (section === 'Experience')       i = parseExperience(lines, i, cv);
      else if (section === 'Technical Skills') i = parseSkills(lines, i, cv);
      else if (section === 'Education')        i = parseEducation(lines, i, cv);
      else if (section === 'Military Service') i = parseMilitary(lines, i, cv);
      else i = skipUntilNextH2(lines, i);
    } else {
      i++;
    }
  }
  return cv;
}

function skipUntilNextH2(lines, i) {
  while (i < lines.length && !/^##\s+/.test(lines[i])) i++;
  return i;
}

function parseProfile(lines, i, cv) {
  const buf = [];
  while (i < lines.length && !/^##\s+/.test(lines[i]) && !/^---\s*$/.test(lines[i])) {
    if (!/^\s*$/.test(lines[i])) buf.push(lines[i].trim());
    i++;
  }
  cv.profile = buf.join(' ').trim();
  return i;
}

function parseExperience(lines, i, cv) {
  while (i < lines.length && !/^##\s+/.test(lines[i])) {
    const h3 = lines[i].match(/^###\s+(.+?)\s*$/);
    if (!h3) { i++; continue; }

    const heading = h3[1].trim();
    i++;

    if (heading === 'Earlier Roles') {
      while (i < lines.length && /^\s*$/.test(lines[i])) i++;
      if (i < lines.length && !/^###\s/.test(lines[i]) && !/^##\s/.test(lines[i])) {
        cv.earlierRolesLine = lines[i].trim();
        i++;
      }
      continue;
    }

    const parts = heading.split(/\s+·\s+/);
    const role = {
      title: parts[0] || heading,
      company: parts.slice(1).join(' · ') || '',
      dateLine: '', subLine: '', description: '', bullets: [],
    };

    while (i < lines.length && /^\s*$/.test(lines[i])) i++;

    const dateMatch = lines[i] && lines[i].match(/^\*\*(.+?)\*\*\s*$/);
    if (dateMatch) { role.dateLine = dateMatch[1]; i++; }

    // Italic sub-line: starts and ends with single * (not **)
    if (i < lines.length && /^\*[^*].*[^*]\*\s*$/.test(lines[i])) {
      role.subLine = lines[i].replace(/^\*(.+)\*\s*$/, '$1').trim();
      i++;
    }

    const descBuf = [];
    while (i < lines.length && !/^-\s/.test(lines[i]) && !/^###\s/.test(lines[i]) && !/^##\s/.test(lines[i])) {
      if (!/^\s*$/.test(lines[i]) && !/^---\s*$/.test(lines[i])) descBuf.push(lines[i].trim());
      i++;
    }
    role.description = descBuf.join(' ').trim();

    while (i < lines.length && /^-\s/.test(lines[i])) {
      role.bullets.push(lines[i].replace(/^-\s+/, '').trim());
      i++;
    }

    cv.roles.push(role);
  }
  return i;
}

function parseSkills(lines, i, cv) {
  while (i < lines.length && !/^##\s+/.test(lines[i])) {
    const m = lines[i].match(/^\*\*([^*]+?):\*\*\s*(.+)$/);
    if (m) cv.skills.push({ label: m[1].trim(), items: m[2].trim() });
    i++;
  }
  return i;
}

function parseEducation(lines, i, cv) {
  while (i < lines.length && /^\s*$/.test(lines[i])) i++;
  if (i < lines.length && !/^##\s+/.test(lines[i])) { cv.education = lines[i].trim(); i++; }
  return i;
}

function parseMilitary(lines, i, cv) {
  while (i < lines.length && /^\s*$/.test(lines[i])) i++;
  if (i < lines.length && !/^##\s+/.test(lines[i])) { cv.military = lines[i].trim(); i++; }
  return i;
}

// ---------- inline markdown rendering ----------

function inlineRuns(text, baseOpts = {}) {
  const runs = [];
  const re = /\*\*([^*]+?)\*\*|\*([^*]+?)\*/g;
  let lastIndex = 0, m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) runs.push(new TextRun({ text: text.slice(lastIndex, m.index), ...baseOpts }));
    if (m[1] !== undefined) runs.push(new TextRun({ text: m[1], bold: true, ...baseOpts }));
    else                    runs.push(new TextRun({ text: m[2], italics: true, ...baseOpts }));
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) runs.push(new TextRun({ text: text.slice(lastIndex), ...baseOpts }));
  return runs;
}

const baseRun = (opts = {}) => ({ font: FONT, size: SIZE_BODY, color: DARK, ...opts });

// ---------- docx element helpers ----------

const sectionHeader = (label) => new Paragraph({
  spacing: { before: 140, after: 40 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 2 } },
  children: [
    new TextRun({
      text: label.toUpperCase(), bold: true, color: ACCENT,
      size: SIZE_SECTION, font: FONT, characterSpacing: 40,
    }),
  ],
});

const bulletPara = (text) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  spacing: { before: 0, after: 60 },
  children: inlineRuns(text, baseRun()),
});

// ---------- document assembly ----------

function buildDocument(cv) {
  const children = [];

  children.push(new Paragraph({
    spacing: { before: 0, after: 0 },
    children: [new TextRun({ text: cv.name, bold: true, size: SIZE_NAME, font: FONT, color: DARK })],
  }));

  children.push(new Paragraph({
    spacing: { before: 40, after: 0 },
    children: [new TextRun({ text: cv.titleLine, size: SIZE_TITLE, font: FONT, color: ACCENT, bold: true })],
  }));

  children.push(new Paragraph({
    spacing: { before: 40, after: 0 },
    children: [new TextRun({ text: cv.contactLine, color: MUTED, size: SIZE_CONTACT, font: FONT })],
  }));

  if (cv.profile) {
    children.push(sectionHeader("Profile"));
    children.push(new Paragraph({
      spacing: { before: 40, after: 120 },
      children: inlineRuns(cv.profile, baseRun()),
    }));
  }

  if (cv.roles.length || cv.earlierRolesLine) {
    children.push(sectionHeader("Experience"));

    cv.roles.forEach((role) => {
      const dateParts = role.dateLine.split(/\s+·\s+/);
      const locationPart = dateParts.length > 1 ? dateParts[0] : '';
      const datesPart = dateParts.length > 1 ? dateParts.slice(1).join(' · ') : role.dateLine;
      const rightSide = locationPart ? `${locationPart} · ${datesPart}` : datesPart;

      children.push(new Paragraph({
        spacing: { before: 80, after: 0 },
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun({ text: role.title, bold: true, size: SIZE_ROLE, font: FONT, color: DARK }),
          new TextRun({ text: "  ·  " + role.company, size: SIZE_ROLE, font: FONT, color: DARK }),
          new TextRun({ text: "\t", size: SIZE_ROLE, font: FONT }),
          new TextRun({ text: rightSide, color: MUTED, size: SIZE_BODY, font: FONT }),
        ],
      }));

      if (role.subLine) {
        children.push(new Paragraph({
          spacing: { before: 0, after: 80 },
          children: [new TextRun({ text: role.subLine, italics: true, color: MUTED, size: SIZE_BODY, font: FONT })],
        }));
      }

      if (role.description) {
        children.push(new Paragraph({
          spacing: { before: 0, after: 80 },
          children: inlineRuns(role.description, baseRun()),
        }));
      }

      role.bullets.forEach((b) => children.push(bulletPara(b)));
    });

    if (cv.earlierRolesLine) {
      children.push(new Paragraph({
        spacing: { before: 120, after: 20 },
        children: [new TextRun({ text: "Earlier Roles", bold: true, size: SIZE_SECTION, color: ACCENT, font: FONT })],
      }));
      children.push(new Paragraph({
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: cv.earlierRolesLine, color: MUTED, size: SIZE_BODY, font: FONT })],
      }));
    }
  }

  if (cv.skills.length) {
    children.push(sectionHeader("Technical Skills"));
    cv.skills.forEach((s) => {
      children.push(new Paragraph({
        spacing: { before: 40, after: 60 },
        children: [
          new TextRun({ text: s.label + ":  ", bold: true, size: SIZE_BODY, font: FONT, color: DARK }),
          new TextRun({ text: s.items, size: SIZE_BODY, font: FONT, color: DARK }),
        ],
      }));
    });
  }

  if (cv.education) {
    children.push(sectionHeader("Education"));
    children.push(new Paragraph({
      spacing: { before: 40, after: 40 },
      children: inlineRuns(cv.education, baseRun()),
    }));
  }

  if (cv.military) {
    children.push(sectionHeader("Military Service"));
    children.push(new Paragraph({
      spacing: { before: 40, after: 80 },
      children: inlineRuns(cv.military, baseRun()),
    }));
  }

  return new Document({
    styles: { default: { document: { run: { font: FONT, size: SIZE_BODY, color: DARK } } } },
    numbering: {
      config: [{
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 360, hanging: 240 } } },
        }],
      }],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 720, right: 1080, bottom: 720, left: 1080 },
        },
      },
      children,
    }],
  });
}

// ---------- main ----------

const inputPath  = process.argv[2] || 'base_cv.md';
const outputPath = process.argv[3] || 'base_cv.docx';

const md = fs.readFileSync(inputPath, 'utf-8');
const cv = parseCV(md);
const doc = buildDocument(cv);

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(outputPath, buf);
  console.log(`Built ${outputPath} (${buf.length} bytes) from ${inputPath}`);
  console.log(`Parsed: ${cv.roles.length} role(s), ${cv.skills.length} skill line(s)`);
});
