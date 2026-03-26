#!/bin/bash
# =============================================================================
# Bukito Brand & Marketing — First-Time Setup
# Run this after cloning: ./scripts/setup.sh
# =============================================================================

set -e

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   BUKITO BRAND & MARKETING — SETUP      ║"
echo "╚══════════════════════════════════════════╝"
echo ""

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

# --- Step 1: Check Node.js ---
echo -e "${BOLD}[1/7] Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Node.js $(node -v)"
else
    echo -e "  ${RED}✗${NC} Node.js not found. Install from https://nodejs.org"
    exit 1
fi

# --- Step 2: Check API keys ---
echo -e "${BOLD}[2/7] Checking API keys...${NC}"
API_KEYS_FILE="$HOME/.claude/api-keys.conf"
if [ -f "$API_KEYS_FILE" ]; then
    if grep -q "RUNWAY_API_KEY=" "$API_KEYS_FILE"; then
        echo -e "  ${GREEN}✓${NC} Runway API key found"
    else
        echo -e "  ${YELLOW}!${NC} Runway API key missing — add RUNWAY_API_KEY to $API_KEYS_FILE"
    fi
    if grep -q "SUPABASE_ACCESS_TOKEN=" "$API_KEYS_FILE" || [ -n "$SUPABASE_ACCESS_TOKEN" ]; then
        echo -e "  ${GREEN}✓${NC} Supabase access token found"
    else
        echo -e "  ${YELLOW}!${NC} Supabase access token missing — needed for MCP"
    fi
else
    echo -e "  ${YELLOW}!${NC} No api-keys.conf found at $API_KEYS_FILE"
    echo "  Create it with your API keys. See CLAUDE.md for required keys."
fi

# --- Step 3: Create local directories ---
echo -e "${BOLD}[3/7] Creating local directories...${NC}"
mkdir -p photos output/ai-videos output/reels output/posts
echo -e "  ${GREEN}✓${NC} photos/, output/ directories created"

# --- Step 4: Sync photos from Supabase ---
echo -e "${BOLD}[4/7] Syncing photos from Supabase Storage...${NC}"
SUPABASE_URL="https://glmgwaywptqlzudoiwot.supabase.co/storage/v1/object/public/media/Bukito%20brand%20book/photos"
PHOTOS=(
    "BUKITO_IG1.webp"
    "BUKITO_IG3.webp"
    "BUKITO_IG7.webp"
    "BUKITO_IG11.webp"
    "BUKITO_IG15.webp"
    "BUKITO_IG19.webp"
    "BUKITO_IG22.webp"
    "BUKITO_IG24.webp"
    "bukito-barista.webp"
    "bukito-exterior.webp"
)

SYNCED=0
for photo in "${PHOTOS[@]}"; do
    if [ ! -f "photos/$photo" ]; then
        curl -sL "$SUPABASE_URL/$photo" -o "photos/$photo" 2>/dev/null && ((SYNCED++))
    fi
done
EXISTING=$(ls photos/*.webp 2>/dev/null | wc -l | tr -d ' ')
echo -e "  ${GREEN}✓${NC} $EXISTING photos available ($SYNCED newly synced)"

# --- Step 5: Install Remotion ---
echo -e "${BOLD}[5/7] Setting up Remotion video project...${NC}"
if [ ! -d "remotion/node_modules" ]; then
    if [ -f "remotion/package.json" ]; then
        cd remotion && npm install --silent && cd ..
        echo -e "  ${GREEN}✓${NC} Remotion dependencies installed"
    else
        echo -e "  ${YELLOW}!${NC} Remotion project not found — will be created on first use"
    fi
else
    echo -e "  ${GREEN}✓${NC} Remotion already installed"
fi

# --- Step 6: Install tools ---
echo -e "${BOLD}[6/7] Installing tools...${NC}"
if [ -f "tools/image-to-video.ts" ]; then
    cd tools
    if [ ! -d "node_modules" ]; then
        npm init -y --silent 2>/dev/null
        npm install dotenv tsx --silent 2>/dev/null
    fi
    cd ..
    echo -e "  ${GREEN}✓${NC} Image-to-video tool ready"
else
    echo -e "  ${YELLOW}!${NC} tools/image-to-video.ts not found"
fi

# --- Step 7: Verify skills ---
echo -e "${BOLD}[7/7] Verifying skills...${NC}"
if [ -f ".claude/skills/bukito-brand/SKILL.md" ]; then
    echo -e "  ${GREEN}✓${NC} bukito-brand skill"
else
    echo -e "  ${RED}✗${NC} bukito-brand skill missing"
fi
if [ -f ".claude/skills/bukito-content/SKILL.md" ]; then
    echo -e "  ${GREEN}✓${NC} bukito-content skill"
else
    echo -e "  ${RED}✗${NC} bukito-content skill missing"
fi

# --- Done ---
echo ""
echo "══════════════════════════════════════════"
echo -e "  ${GREEN}${BOLD}Setup complete!${NC}"
echo ""
echo "  Next steps:"
echo "  1. Open this folder in Claude Code"
echo "  2. Say 'make Bukito content' to start creating"
echo "  3. Use 'bukito-brand' for brand guidelines"
echo ""
echo "  Brand: Sunrust #6D0000 on Coconut Sand #F8F5EA"
echo "  Font:  Kisrre — ALL CAPS — tracking -60"
echo "  Vibe:  Paradise With Fangs 🐍"
echo "══════════════════════════════════════════"
echo ""
