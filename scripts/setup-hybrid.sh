#!/bin/bash

# 🏛️ Hybrid Architecture Setup Script
# Rascacielo Digital - Backend + Flutter Frontend

set -e

echo "🏛️ Rascacielo Digital - Hybrid Architecture Setup"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js >= 18${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) found${NC}"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm $(npm --version) found${NC}"

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version must be >= 18. Current: $(node --version)${NC}"
    exit 1
fi

echo ""
echo "📦 Installing Backend Dependencies..."
npm install

echo ""
echo "🧪 Running Tests..."
npm test

echo ""
echo "🔍 Running Linter..."
npm run lint || echo -e "${YELLOW}⚠️  Linter found issues (non-blocking)${NC}"

echo ""
echo "📝 Setting up Environment Variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created .env file from .env.example${NC}"
    echo -e "${YELLOW}⚠️  Please update .env with your actual configuration${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists${NC}"
fi

echo ""
echo "📂 Verifying API Structure..."
if [ -d "api/v1" ]; then
    echo -e "${GREEN}✅ API directory structure exists${NC}"
else
    echo -e "${RED}❌ API directory structure missing${NC}"
    exit 1
fi

echo ""
echo "🤖 Verifying Agents..."
AGENTS=("build-agent.js" "security-agent.js" "deploy-agent.js" "orchestrator-agent.js")
for agent in "${AGENTS[@]}"; do
    if [ -f "agents/$agent" ]; then
        echo -e "${GREEN}✅ $agent found${NC}"
    else
        echo -e "${RED}❌ $agent missing${NC}"
        exit 1
    fi
done

echo ""
echo "📚 Documentation Check..."
DOCS=("HYBRID_ARCHITECTURE.md" "FLUTTER_SETUP.md" "FLUTTER_PUBSPEC.yaml")
for doc in "${DOCS[@]}"; do
    if [ -f "docs/$doc" ]; then
        echo -e "${GREEN}✅ $doc found${NC}"
    else
        echo -e "${YELLOW}⚠️  $doc missing${NC}"
    fi
done

echo ""
echo "🔧 GitHub Actions Workflows Check..."
WORKFLOWS=("deploy-backend.yml" "deploy-frontend.yml")
for workflow in "${WORKFLOWS[@]}"; do
    if [ -f ".github/workflows/$workflow" ]; then
        echo -e "${GREEN}✅ $workflow found${NC}"
    else
        echo -e "${YELLOW}⚠️  $workflow missing${NC}"
    fi
done

echo ""
echo "=================================================="
echo -e "${GREEN}✅ Backend Setup Complete!${NC}"
echo ""
echo "📋 Next Steps:"
echo "1. Update .env with your configuration"
echo "2. Configure Vercel secrets for deployment:"
echo "   - VERCEL_TOKEN"
echo "   - VERCEL_ORG_ID"
echo "   - VERCEL_PROJECT_ID"
echo "   - VERCEL_TOKEN_FRONTEND"
echo "   - VERCEL_PROJECT_ID_FRONTEND"
echo ""
echo "3. Start backend server:"
echo "   npm start"
echo ""
echo "4. Deploy to Vercel:"
echo "   vercel --prod"
echo ""
echo "5. Setup Flutter frontend (see docs/FLUTTER_SETUP.md)"
echo ""
echo "📖 Documentation:"
echo "   - Architecture: docs/HYBRID_ARCHITECTURE.md"
echo "   - Flutter Setup: docs/FLUTTER_SETUP.md"
echo "   - API Docs: http://localhost:3000/api/v1/docs (after starting server)"
echo ""
echo "🎉 Happy coding!"
