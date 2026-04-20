#!/bin/bash
# install.sh - Install the code-review skill (v2) into Claude Code
#
# Usage:
#   bash install.sh                        Install machine-wide to ~/.claude (default)
#   bash install.sh --project <path>       Install to <path>/.claude (project-scoped)
#   bash install.sh -p <path>              Short form of --project
#   bash install.sh --help | -h            Show usage
#
# Examples:
#   bash install.sh
#   bash install.sh --project /path/to/your/project
#   bash install.sh -p .

set -euo pipefail

SKILL_NAME="code-review"
SKILL_SRC_DIR="$(cd "$(dirname "$0")" && pwd)"

usage() {
    cat <<EOF
Install the code-review skill into Claude Code.

Usage:
  bash install.sh                        Install machine-wide to ~/.claude (default)
  bash install.sh --project <path>       Install to <path>/.claude (project-scoped)
  bash install.sh -p <path>              Short form of --project
  bash install.sh --help | -h            Show this help

Examples:
  bash install.sh
  bash install.sh --project /path/to/your/project
  bash install.sh -p .
EOF
}

# ---- Parse arguments -----------------------------------------------------

INSTALL_MODE="machine"
PROJECT_PATH=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --project|-p)
            INSTALL_MODE="project"
            if [[ $# -lt 2 || -z "${2:-}" || "${2:-}" == -* ]]; then
                echo "Error: $1 requires a path argument." >&2
                echo "" >&2
                usage >&2
                exit 1
            fi
            PROJECT_PATH="$2"
            shift 2
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        *)
            echo "Error: unknown argument '$1'." >&2
            echo "" >&2
            usage >&2
            exit 1
            ;;
    esac
done

# ---- Resolve install root ------------------------------------------------

if [[ "$INSTALL_MODE" == "machine" ]]; then
    INSTALL_ROOT="$HOME/.claude"
    SCOPE_LABEL="machine-wide ($INSTALL_ROOT)"
else
    if [[ ! -d "$PROJECT_PATH" ]]; then
        echo "Error: project path does not exist or is not a directory: $PROJECT_PATH" >&2
        exit 1
    fi
    INSTALL_ROOT="$(cd "$PROJECT_PATH" && pwd)/.claude"
    SCOPE_LABEL="project ($INSTALL_ROOT)"
fi

SKILL_INSTALL_DIR="$INSTALL_ROOT/skills/$SKILL_NAME"
COMMANDS_INSTALL_DIR="$INSTALL_ROOT/commands"

# Safety: don't let a misconfigured SKILL_INSTALL_DIR collide with the source.
if [[ "$SKILL_INSTALL_DIR" == "$SKILL_SRC_DIR" ]]; then
    echo "Error: install target equals source directory. Aborting to avoid self-overwrite." >&2
    exit 1
fi

echo "Installing agentic code review skill (v2, parallel reviewers + validator)..."
echo "   Scope:    $SCOPE_LABEL"
echo "   Source:   $SKILL_SRC_DIR"
echo "   Skill:    $SKILL_INSTALL_DIR"
echo "   Command:  $COMMANDS_INSTALL_DIR/review.md"
echo ""

# ---- Install -------------------------------------------------------------

mkdir -p "$SKILL_INSTALL_DIR" "$COMMANDS_INSTALL_DIR"

echo "Copying skill files:"

# Copy skill payload (SKILL.md, agents/, references/, README.md).
# Exclude install.sh, commands/, and any VCS/OS cruft.
for item in SKILL.md README.md agents references; do
    src="$SKILL_SRC_DIR/$item"
    dest="$SKILL_INSTALL_DIR/$item"
    if [[ -e "$src" ]]; then
        if [[ -d "$src" ]]; then
            rm -rf "$dest"
            cp -R "$src" "$SKILL_INSTALL_DIR/"
            # Print each file copied within the directory.
            while IFS= read -r f; do
                rel="${f#$src/}"
                echo "  copy  $src/$rel -> $dest/$rel"
            done < <(find "$src" -type f)
        else
            cp "$src" "$dest"
            echo "  copy  $src -> $dest"
        fi
    else
        echo "  skip  $src (not found)"
    fi
done

# Render the command file, substituting $SKILL_PATH with the installed location.
echo "Rendering command file:"
echo "  render $SKILL_SRC_DIR/commands/review.md -> $COMMANDS_INSTALL_DIR/review.md"
echo "         (\$SKILL_PATH -> $SKILL_INSTALL_DIR)"
sed "s|\$SKILL_PATH|$SKILL_INSTALL_DIR|g" \
    "$SKILL_SRC_DIR/commands/review.md" \
    > "$COMMANDS_INSTALL_DIR/review.md"

# ---- Summary -------------------------------------------------------------

echo "Installed successfully."
echo ""
echo "Usage:"
echo "   In Claude Code, type: /review"
echo "   Or say: 'review my code for story XYZ'"
echo "   To bypass eligibility checks: /review --force"
echo ""
echo "Installed files:"
echo "   $SKILL_INSTALL_DIR/SKILL.md                  - Main orchestrator (7-stage pipeline)"
echo "   $SKILL_INSTALL_DIR/agents/reviewer.md        - Base reviewer (R1-R5 roles)"
echo "   $SKILL_INSTALL_DIR/agents/validator.md       - Confidence-scoring validator"
echo "   $SKILL_INSTALL_DIR/agents/fixer.md           - Fixer agent (raised dispute bar)"
echo "   $SKILL_INSTALL_DIR/references/               - Rubric, don't-flag list, rules, templates"
echo "   $COMMANDS_INSTALL_DIR/review.md              - Slash command entry point"
echo ""
echo "To uninstall:"
echo "   rm -rf \"$SKILL_INSTALL_DIR\""
echo "   rm \"$COMMANDS_INSTALL_DIR/review.md\""
