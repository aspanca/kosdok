#!/bin/bash

# Kosdok Client - Netlify Deploy Script
# ======================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║     Kosdok Client - Deploy Script     ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null; then
    echo -e "${YELLOW}⚠️  Netlify CLI not found. Installing...${NC}"
    npm install -g netlify-cli
    echo -e "${GREEN}✓ Netlify CLI installed${NC}"
fi

# Check if logged in to Netlify
echo -e "${BLUE}🔐 Checking Netlify authentication...${NC}"
if ! netlify status &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Netlify. Opening browser for login...${NC}"
    netlify login
fi
echo -e "${GREEN}✓ Authenticated with Netlify${NC}"

# Build the project
echo -e "${BLUE}🔨 Building project...${NC}"
yarn build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Build successful${NC}"

# Deploy options
echo ""
echo -e "${YELLOW}Choose deployment type:${NC}"
echo "  1) Production deploy (live site)"
echo "  2) Preview deploy (draft URL)"
echo ""
read -p "Enter choice [1/2]: " choice

case $choice in
    1)
        echo -e "${BLUE}🚀 Deploying to production...${NC}"
        netlify deploy --prod --dir=dist
        ;;
    2)
        echo -e "${BLUE}🔍 Creating preview deploy...${NC}"
        netlify deploy --dir=dist
        ;;
    *)
        echo -e "${YELLOW}Invalid choice. Defaulting to preview deploy...${NC}"
        netlify deploy --dir=dist
        ;;
esac

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         Deployment Complete! ✓        ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
