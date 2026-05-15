# Gil Strauss — Master CV / Source Document

**Purpose:** This is the *master document* — the reservoir from which tailored CVs are drawn. It contains every defensible claim, multiple phrasings of key achievements, full context for each role, and the interview-prep material. It is *never sent anywhere*. The base CV (`Gil_Strauss_CV.docx`) is the artifact that goes out into the world.

**Last updated:** May 2026.

---

## Contact

- **Name:** Gil Strauss
- **Location:** Petah Tikva, Israel
- **Email:** gil.strauss@me.com
- **Phone:** +972-54-623-1694
- **LinkedIn:** linkedin.com/in/gil-strauss

---

## Target Roles

- Chief Technology Officer
- VP R&D
- Chief Architect

Open to: on-site / hybrid in Israel; remote international (TBD).

---

## Core Positioning

**The four claims that anchor the CV.** Every line of every tailored version should serve one of these:

1. **Built and led a 60-person engineering organization for 13 years.** Joined at 2; reached 60. Five functions (R&D, DevOps, IT, NOC, Product).
2. **Drove that organization to DORA-elite engineering performance** over six years, measured continuously via Haystack across Jira/Jenkins/Git.
3. **Currently driving AI-augmented engineering culture and cloud-native modernization** at Israel's leading K-12 ed-tech organization, reaching over 1M students.
4. **Hands-on in the modern sense** — architecture, specs, design and code review, AI-augmented engineering with tools like Claude Code, not directing from a distance.

**Distinctiveness theme:** Operating at the *connection points* — domain experts to engineering teams, long-term strategy to what gets built next week, executive judgment to hands-on contribution. Evidence: people who've worked with him repeatedly choose to work with him again (current boss is a former colleague; former team members request to return).

---

## Summary — Alternative Phrasings

Multiple versions of the profile/summary for different contexts. **Pick one per tailored CV.**

### Version A — First-person, distinctive (base CV uses this)
> I build the engineering organizations that build mission-critical systems — and I stay in the code while doing it. Over 20 years, that has meant taking a B2B SaaS platform from greenfield to hundreds of millions of daily transactions, scaling a 10-person team to 60 across five functions, and driving a six-year transformation to DORA-elite engineering performance. Today I am doing the same work in a different domain: modernizing legacy platforms and embedding AI-augmented engineering culture at the organization that powers K-12 education for over 1M Israeli students. Hands-on in the modern sense — architecture, specs, design and code review, and AI-augmented engineering with tools like Claude Code.

### Version B — Third-person, executive register
> Hands-on engineering leader with 20+ years building and scaling mission-critical distributed systems and the organizations behind them. Built a 60-person engineering organization from scratch and led it for 13 years, reaching DORA-elite engineering performance. Currently driving AI-augmented engineering practices and cloud-native modernization at Israel's leading K-12 ed-tech organization. Hands-on across architecture, specifications, design and code review, and AI-augmented engineering.

### Version C — AI-forward CTO framing
> Engineering leader who has scaled organizations from 10 to 60, built B2B SaaS platforms handling hundreds of millions of daily transactions, and is now driving AI-augmented engineering culture at Israel's leading K-12 ed-tech organization. Hands-on across architecture, specs, design and code review, and AI-augmented engineering with tools like Claude Code. Working knowledge of agentic frameworks; deep expertise in LLM integration, RAG, MCP, and AI-augmented SDLC.

### Version D — VP R&D / org-builder framing
> Engineering leader with 20+ years building and operating cross-functional R&D organizations. Scaled a technology group from 10 to 60 across R&D, DevOps, IT, NOC, and Product over 13 years, reaching DORA-elite engineering performance measured continuously via instrumented tooling. Strong record of legacy modernization, mission-critical operations (99.99% availability at hundreds of millions of daily transactions), and embedding modern engineering culture including CI/CD and AI-augmented SDLC.

### Version E — Architect-focused framing
> Distributed-systems architect with 20+ years designing and operating mission-critical platforms at scale. Architected a B2B SaaS platform from greenfield to hundreds of millions of daily transactions on AWS at 99.99% availability, migrated a monolithic architecture to microservices without availability disruption, and currently driving cloud-native modernization of legacy ASP.NET platforms toward Azure. Hands-on across architecture, specs, design and code review, and AI-augmented engineering with tools like Claude Code.

---

## Role: Chief Technology Officer · Center for Educational Technology (CET)

- **Dates:** Aug 2025 – Present
- **Location:** Tel Aviv, Israel
- **Tenure:** ~9 months as of May 2026

### Company context
- **What CET is:** Israel's leading K-12 educational technology organization. Non-profit. Operates with commercial P&L discipline.
- **Reach:** Over 1M students across thousands of schools (rounded internal figure; safe to disclose).
- **Position:** Largest K-12 textbook publisher in Israel (publicly documented via partnerships like eSelf/Harvard AI tutor pilot, April 2025).
- **Founded:** 1971. Over 50 years of activity.
- **HQ:** 16 Klausner St., Tel Aviv. ~400 employees (per 2018 public sources; may differ now).
- **Customer relationship with Ministry of Education:** Ministry is a customer, not an owner. CET is independent. Avoid clarifying this on the CV (raises the very confusion it tries to resolve); handle in conversation if asked.
- **International:** Small side activity (Hebrew programs in North America, etc.). Not worth mentioning on CV.

### Role positioning
- **Title:** Chief Technology Officer.
- **Reports to:** EVP of Technology & Product. (One layer below the C-suite in formal reporting, despite the C-level title. Flat senior leadership structure: CEO → 4 executives, one of whom is the EVP T&P.)
- **Peers under same EVP:** VP R&D (owns delivery and engineering people management), CIO (internal IT), Head of Product.
- **Scope characterization:** Architect-strategist CTO with cross-functional influence — *not* head of the entire 60-person tech function.
- **Direct reports:** 1 architect (planned scope) + 1 DevOps team lead (added later because the EVP needed someone to absorb it and nobody else could).

### Tech group context
- **60 people total** across R&D, DevOps, IT, Product.
- Multiple production platforms in active development: Kotar (legacy ASP.NET LMS), HendrX (undergoing Strangler Fig migration), Ofek (LMS/LRS), Infinity/720 (educational platform).
- **Tech stack:** Azure (AKS, VMSS, Azure DevOps), Kubernetes, .NET Core, Python, Dynatrace, Coralogix.

### Initiatives — status and detail

**Shipped:**
- **AI product features.** LLM-powered educational features using RAG and MCP integrations.
- **Multi-agent code review tooling.** Built and now used across R&D. V2 architecture: five parallel reviewers, plus Validator and Fixer subagents.
- **FinOps adoption.** Practices and tooling were implemented before arrival; have been pushing and promoting organization-wide adoption. Includes Claude Code FinOps analysis slash command (HTML output, seven-phase subagent pipeline).
- **Secrets management foundation.** `.claudeignore`, `permissions.deny`, gitleaks, trufflehog. (Too granular for CV; mention in interview if relevant.)

**In flight, with momentum:**
- **AI-augmented engineering culture.** Custom slash commands, skills, MCP integrations being adopted org-wide. Big step since arrival.
- **Modernization of legacy ASP.NET platforms.** Architectural direction and incremental migration patterns toward cloud-native Azure architecture. Strangler Fig pattern (don't name on CV — replace with "incremental migration patterns").
- **Azure landing zone migration.** Multi-agent runbook for mapping VMSS/AKS topology using Dynatrace DQL, Coralogix, NSG Flow Logs, Azure Resource Graph. Plan in progress.

**Early stage:**
- **Engineering metrics framework.** DORA + agentic SDLC adoption + spec-driven development metrics. Internal measurement framework being built; DORA not yet at CG-level quality. Don't claim DORA at CET — only the agentic SDLC adoption part is distinctive enough to mention.
- **International content standards initiative.** OECD partnerships, three-actor model (Ministry, content provider, platform). Too niche for CV.
- **BI analyst training program.** Tangential to core CTO scope. Leave off CV.

### Alternative bullets for tailored CVs

**For AI-forward roles:**
- Shipped LLM-powered educational features using RAG and MCP integrations.
- Built and rolled out a multi-agent code review system using parallel-reviewer + validator-fixer architecture; adopted across R&D.
- Established and is driving organization-wide adoption of AI-augmented engineering practices, custom tooling, and a measurement framework for agentic SDLC adoption.
- Architected adaptive-learning workflows with LangGraph-based student progression modeling.

**For modernization-focused roles:**
- Leading the modernization of multiple legacy ASP.NET platforms toward cloud-native Azure architecture via incremental migration patterns.
- Leading Azure landing-zone migration planning across multiple business units, with multi-source observability (Dynatrace, Coralogix, Azure Resource Graph).
- Driving organizational adoption of FinOps practices and tooling for cloud cost optimization.

**For org-builder / VP R&D roles:**
- Architect-strategist CTO with cross-functional influence across a 60-person technology organization spanning R&D, DevOps, IT, and Product.
- Building organizational measurement framework combining DORA metrics with agentic SDLC adoption indicators.
- Established AI-augmented engineering culture in less than a year — practices, tooling, and adoption framework.

### Things to be careful about on CET

- **Tenure is short.** 9 months as of May 2026. Don't claim "transformed" or "led adoption of X" as a completed accomplishment — use direction-setting verbs (established, driving, leading, initiated).
- **Don't claim full org responsibility.** VP R&D and CIO own delivery and operations respectively. CTO scope is architecture, strategy, AI direction, special initiatives.
- **Don't put CET's transaction volume or uptime numbers on CV.** You don't own the operational levers there. Citing CET's 99.9% next to CG's 99.99% creates a misleading visual comparison.
- **DORA at CET is not yet at CG-level.** Don't claim it. Focus on agentic SDLC adoption framework instead.
- **Confidentiality:** rounded reach figures (1M+ students) are fine. Specific KPIs aren't.

---

## Role: CTO & VP R&D · CG Solutions / Groove Technologies

- **Dates:** 2012 – 2025 (joined as Gamescale, 2011)
- **Tenure:** 14 years total
- **Location:** Israel

### Company context

- **What it was:** B2B SaaS platform for the online gaming industry (regulated real-money gaming sector). Hundreds of millions of daily transactions. 99.99% availability.
- **Industry framing:** Use "regulated real-money gaming sector" — accurate, frames technical challenge, less squint factor than "online gaming." Regulation is real (licensed jurisdictions).
- **Company evolution:** Joined Gamescale in 2011; partnership and shareholding change → restructured and renamed to CG Solutions / Groove Technologies. Continued in dual CTO+VP R&D role through the transition.
- **Why this matters as a credential:** Surviving and keeping the dual C-level role through an ownership transition signals trust from new ownership. New owners typically clean house at the top; they kept him.

### Role history (the arc)

- **2011:** Joined Gamescale as a hiring manager for a new group. Target headcount: 10. Started with 2.
- **2012:** Before the build-out was complete, the board did an organizational restructuring. Fired the incumbent CTO and VP R&D. Promoted Gil to **combined CTO + VP R&D**. Managed 10 people at that point.
- **2012–2025:** Built the organization from 10 to 60 people across R&D, DevOps, IT, NOC, and Product. Established CI/CD, modern SDLC, DORA measurement program.
- **2025:** Departed.

**For CV: phrase as "joined as Gamescale in 2011; promoted to CTO & VP R&D in 2012." Don't add "by the board" — invites questions and reads self-congratulatory on paper.**

### Organizational scope at peak

- **60 people total** across five functions.
- **5 direct reports:**
  1. Head of Product (Line of Business A)
  2. Head of Product (Line of Business B)
  3. R&D Manager
  4. Head of DevOps & IT
  5. NOC Manager
- The NOC ownership is particularly distinctive: 24/7 operational responsibility for mission-critical platform. Most CTOs at this level don't have it.

### DORA achievement — full detail

- **Tooling:** Haystack, integrated with Jira, Jenkins, and Git. Continuous instrumentation, not self-reported.
- **Duration:** Six years of focused transformation work.
- **Result:** DORA-elite tier in **deployment frequency** and **MTTR**. High-tier (one grade below elite) in **lead time for changes** and **change failure rate**.
- **Pattern interpretation:** "Could ship fast and recover fast, but planning/review/testing front-end hadn't fully caught up to the operational back-end." Recognizable profile for engineering-fluent readers.
- **Measurement benchmark:** Standard DORA bands from the State of DevOps reports.

**For CV: top-line is "DORA-elite engineering performance, measured continuously via Haystack." Full nuance (two elite, two high-tier; Jira/Jenkins/Git instrumentation; 6 years) belongs in conversation.**

### Tech stack

- **Languages:** Go, Python, Java
- **Cloud:** AWS (primary expertise — EKS, EC2, S3, Lambda)
- **Data:** MongoDB, Redis, ClickHouse, Kafka
- **Orchestration:** Kubernetes, hybrid environments

### Alternative bullets for tailored CVs

**Org-building emphasis:**
- Built the engineering organization from 10 to 60 people across R&D, DevOps, IT, NOC, and Product over 13 years.
- 5 direct reports at peak: Head of Product × 2 (separate lines of business), R&D Manager, Head of DevOps & IT, NOC Manager.
- Established CI/CD, modern SDLC, and the DORA measurement program from scratch.

**Operational excellence emphasis:**
- Owned 24/7 mission-critical operations including the NOC for a platform handling hundreds of millions of daily transactions at 99.99% availability.
- Drove the engineering organization to DORA-elite tier in deployment frequency and MTTR (with lead time and change failure rate one grade below), measured continuously via Haystack.
- Built and operated a real-money transaction platform under regulated-industry compliance and audit requirements.

**Architecture emphasis:**
- Architected a B2B SaaS platform from greenfield to hundreds of millions of daily transactions on AWS (EKS, EC2, S3) at 99.99% availability.
- Migrated a monolithic architecture to a high-performance microservices mesh across AWS and hybrid environments without an availability impact.
- Designed and optimized large-scale data infrastructure across MongoDB, Redis, ClickHouse, and Kafka for massive event throughput.

**Cost / FinOps emphasis:**
- Optimized large-scale AWS infrastructure for massive data volumes while driving down operational cost across multi-year periods.

---

## Earlier Roles (compact)

### Software Team Leader · DoubleVerify · 2010–2011
Built cloud-based web crawlers for ad verification at scale. Analyzed millions of web pages daily to ensure ad campaign integrity.

### Software Engineer · Equitick · 2009–2010
Developed real-time trading services for financial systems with strict security and reliability requirements.

### Team Leader · Microsoft Israel · 2008–2009
Led a team focused on Windows OS performance and reliability. Applied architectural patterns that reduced system crashes and maintenance overhead.

### Software Engineer · Oasis Capital Management (Hedge Fund) · 2005–2008
[Pre-2008 — cut from CV. Trajectory only.]

### Team Leader · SeaPass Solutions (Insurance Tech) · 2002–2004
[Pre-2008 — cut from CV. First leadership role.]

---

## Education

**B.Sc., Information Systems Engineering** · Technion — Israel Institute of Technology · 1998–2002

---

## Military Service

**Investigations Officer**, IDF Military Police · 1993–1997
- Led a team of 30 people.

---

## Languages

- Hebrew (native)
- English (business fluent)

---

## Technical Skills — Full Inventory

### Languages
Python (primary), Go (primary), C# (working), Java (working), SQL.

### Cloud & Infrastructure
- **AWS (primary, 13+ years):** EKS, EC2, S3, Lambda
- **Azure (current at CET):** AKS, VMSS, Azure DevOps
- Kubernetes, Docker, Terraform

### Architecture
Microservices, distributed systems, event-driven design, high-volume scalability, DDD, modernization patterns (Strangler Fig — avoid term on CV), cloud-native architecture.

### Data
MongoDB, Redis, MySQL, ClickHouse, Kafka, Kinesis.

### AI & LLM
LLM integration, RAG, MCP (Model Context Protocol), prompt engineering, AI-augmented SDLC tooling, Claude Code (daily user), spec-driven development. Working knowledge of agentic frameworks (LangGraph) — keep this caveat to avoid overclaiming.

### Observability & DevOps
Dynatrace, Coralogix, CI/CD, DORA metrics (Haystack), FinOps.

### Methodologies
Agile, AI-augmented development, spec-driven development, technical due diligence, modernization patterns.

---

## Distinctiveness — Reference Material

These are the things that genuinely separate Gil from the pool of senior Israeli engineering leaders. Don't put these *literally* on the CV; let them inform tone, summary, and bullet choices.

1. **People who've worked with him repeatedly choose to work with him again.** Current boss (EVP T&P at CET) is a former colleague. Former team members request to return. Unfakeable signal.

2. **Hands-on in the modern sense.** Operates Claude Code daily. Writes specs. Reviews architectures. Reviews code. Engages with AI agents conversationally to produce production output. Most CTOs at this seniority no longer touch the work; he does.

3. **Connection-points operator.** Bridges domain experts to engineering teams, executive judgment to hands-on contribution, macro to micro. Strong analytical skills for decision-making based on facts, experience, and research.

4. **NOC ownership at CG.** Most CTOs at the 60-person scale don't have NOC under them. He did, for 13 years, on a mission-critical platform.

5. **Built from scratch.** The 60-person org didn't exist when he arrived. The DORA-elite status didn't exist when he arrived. The CI/CD program didn't exist. These weren't inherited.

6. **Six-year transformation patience.** Real cultural change at engineering org scale takes years. He has the patience and political durability to sustain it.

7. **Combination of architecture depth + people leadership.** Can defend a system design at the whiteboard and run a five-direct-report executive team. Rare combination.

---

## Interview Prep / Things to Remember

### "Why did you leave CG Solutions after 13 years?"
[Gil to fill in the honest answer here when preparing for searches.]

### "Why are you looking 8 months into your CET role?"
[Gil to draft a clean verbal answer. The CV can't address this; conversation must.]

### "Tell me about the 'ownership transition' at CG Solutions."
> Partnership and shareholding changed; the company was restructured and renamed. I continued in the dual CTO & VP R&D role through and after the transition. New owners typically clean house at the top; they kept me. That's the answer.

### "How did you measure DORA-elite?"
> Haystack, integrated with Jira, Jenkins, and Git. Continuous instrumentation across the full delivery pipeline. We hit elite on deployment frequency and MTTR, high-tier on lead time and change failure rate. That profile — fast to ship, fast to recover, slightly slower on the planning front-end — is common and we owned it openly.

### "Why CET specifically?"
[Gil to draft. Mission angle, AI mandate, scope, something else?]

### "How hands-on are you, really?"
> Hands-on means something different in 2026 than it did five years ago. I work with Claude Code daily — writing specs, reviewing designs, reviewing code, pairing on hard problems with AI agents and engineers. I don't type every line, but the production output is genuinely mine in a meaningful sense. The work is real; the medium has changed.

### "What's your AI experience really?"
> Honest version: solid LLM integration experience (RAG, MCP, prompt engineering). Daily user of Claude Code. Built multi-agent code review tooling. Working knowledge of agentic frameworks like LangGraph — I've used them, I understand the patterns, but I'm not going to claim deep agent-architecture expertise. If you need someone who's spent 18 months on agent internals, I'm not your candidate. If you need someone who can lead an organization through AI adoption while keeping their hands in the work, I am.

---

## CV Editorial Principles

These are the principles we developed in the conversation that produced this document. They should govern every tailored version.

1. **Modern hands-on framing.** "Hands-on in the modern sense" — not "50% hands-on" (invites overclaim challenge).
2. **No "dysfunctional."** Don't denigrate prior teams. Describe what was built, not what it replaced.
3. **DORA detail stays in conversation.** CV says "DORA-elite engineering performance." Conversation handles "two elite, two high-tier; Haystack-instrumented."
4. **Keep Haystack on the page.** Naming the measurement tool makes the DORA claim unfakeable.
5. **Gaming framing: "regulated real-money gaming sector."** Anchors the company, frames technical challenge, less squint factor than "online gaming."
6. **No board-promotion language on the page.** "Promoted to CTO & VP R&D in 2012" is enough. The board detail belongs in conversation.
7. **No "Strangler Fig" on page.** Use "incremental migration patterns" — same meaning, accessible to broader audience.
8. **No "principal" titles.** CET uses "architect," not "principal architect."
9. **No CET operational metrics.** Don't claim 99.9% uptime or transaction volumes from CET on the CV — that work is owned by VP R&D and CIO, not the CTO role.
10. **No DORA at CET.** Only at CG, where it was earned.
11. **Earlier roles compressed to one line each.** They exist for trajectory, not detail.
12. **Cut Oasis (2005–2008) and SeaPass (2002–2004) entirely.** Pre-2008, irrelevant at this seniority.
13. **First-person summary, third-person bullets.** Voice in summary; executive register in bullets.
14. **Bold lead-ins on the CG bullets only.** Sparingly used for visual rhythm.
15. **Slate-blue section dividers, no flourish.** Dignified, executive.
16. **Target length: one page (US Letter, Calibri 11, ~0.5" top/bottom margins).** Two pages maximum if a target role genuinely needs more detail.

---

## What NOT to include in any tailored version

- "Highly experienced" — generic, weakest possible opener.
- ".NET" (use ".NET Core")
- "C# Core" (not a real term)
- "Groundbreaking" or other puffery adjectives.
- "Member of the executive team" at CET (not accurate — reports to EVP).
- "Manages a 60-person org" at CET (not accurate — has cross-functional influence).
- "International content standards initiative" (too niche).
- "BI analyst training" (tangential).
- "Secrets management" as a CV bullet (too granular).
- Any specific student / KPI number from CET beyond the rounded "1M+ students."
- LangGraph as a top-level skill (overclaim).
- "Strangler Fig" by name.
- "Dysfunctional" describing any prior org.
- Any post-promotion claim that places him on the executive team rather than reporting to it.

---

## Footprint

- **LinkedIn:** linkedin.com/in/gil-strauss — actively maintained.
  - Headline currently needs update (see LinkedIn package, separate document).
  - About section currently needs rewrite to match this CV.
  - Experience entries need title corrections (CG Solutions shows "Engineering manager, Hands-On" — should be "CTO & VP R&D").
- **GitHub:** none public.
- **Blog / writing:** none.
- **Conference talks:** none.
- **Open source:** none.

**Recommendation:** don't try to build public footprint before a search. LinkedIn polish and references do most of the verification work at this level. If footprint is desired, the highest-leverage move is a 3-post series on AI-augmented engineering culture written over 6 weeks.
