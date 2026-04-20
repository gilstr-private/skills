#!/bin/bash
# install.sh — Install the code-review skill (v2) into a Claude Code project
#
# Usage: bash install.sh [target_project_dir]
# If no target is specified, installs in the current directory.

set -euo pipefail

TARGET="${1:-.}"
SKILL_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🔍 Installing agentic code review skill (v2, parallel reviewers + validator)..."
echo "   Source:  $SKILL_DIR"
echo "   Target:  $(cd "$TARGET" && pwd)"

# Create the .claude/commands directory if it doesn't exist
mkdir -p "$TARGET/.claude/commands"

# Copy the command file, replacing $SKILL_PATH with the actual path
RESOLVED_SKILL_PATH="$(cd "$SKILL_DIR" && pwd)"
sed "s|\$SKILL_PATH|$RESOLVED_SKILL_PATH|g" \
    "$SKILL_DIR/commands/review.md" \
    > "$TARGET/.claude/commands/review.md"

echo ""
echo "✅ Installed successfully!"
echo ""
echo "📋 Usage:"
echo "   In Claude Code, type: /review"
echo "   Or say: 'review my code for story XYZ'"
echo "   To bypass eligibility checks: /review --force"
echo ""
echo "📁 Skill files:"
echo "   $RESOLVED_SKILL_PATH/SKILL.md                           — Main orchestrator (7-stage pipeline)"
echo "   $RESOLVED_SKILL_PATH/agents/reviewer.md                 — Base reviewer (R1-R5 roles)"
echo "   $RESOLVED_SKILL_PATH/agents/validator.md                — NEW: confidence-scoring validator"
echo "   $RESOLVED_SKILL_PATH/agents/fixer.md                    — Fixer agent (raised dispute bar)"
echo "   $RESOLVED_SKILL_PATH/references/confidence-rubric.md    — NEW: used verbatim by validators"
echo "   $RESOLVED_SKILL_PATH/references/dont-flag.md            — NEW: explicit negative list"
echo "   $RESOLVED_SKILL_PATH/references/eligibility-rules.md    — NEW: Stage 1 pre-flight rubric"
echo "   $RESOLVED_SKILL_PATH/references/orchestrator-logic.md   — Decision logic (updated for v2)"
echo "   $RESOLVED_SKILL_PATH/references/review-categories.md    — Category → reviewer mapping"
echo "   $RESOLVED_SKILL_PATH/references/report-template.md      — Final report format"
echo ""
echo "🗑️  To uninstall: rm $TARGET/.claude/commands/review.md"
