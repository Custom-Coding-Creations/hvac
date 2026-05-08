#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Vercel Environment Setup Script
# Sets all required environment variables for the HVAC chatbot
# ─────────────────────────────────────────────────────────────────────────────

set -e

PROJECT_NAME="hvac"
ENVIRONMENT="production"  # Change to 'preview' or 'development' if needed

echo "🔐 Setting up Vercel environment variables for: $PROJECT_NAME"
echo "📍 Environment: $ENVIRONMENT"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Install it with: npm install -g vercel"
    exit 1
fi

# Array of environment variables to set
declare -A ENV_VARS=(
    ["OPENAI_API_KEY"]="Your OpenAI API key (from ai/.env)"
    ["OPENAI_MODEL"]="gpt-4o-mini"
    ["OPENAI_TIMEOUT_MS"]="7000"
    ["OPENAI_MAX_TOKENS"]="320"
    ["OPENAI_HISTORY_MAX_TURNS"]="8"
)

# Set each variable
for var_name in "${!ENV_VARS[@]}"; do
    var_value="${ENV_VARS[$var_name]}"
    echo -e "${BLUE}→${NC} Setting ${GREEN}$var_name${NC}..."
    
    # For OPENAI_API_KEY, read from ai/.env or prompt user
    if [ "$var_name" = "OPENAI_API_KEY" ]; then
        if [ -f "ai/.env" ]; then
            api_key=$(grep "^AI_PROVIDER_KEY=" ai/.env | cut -d'=' -f2- || echo "")
            if [ -n "$api_key" ]; then
                echo "$api_key" | vercel env add "$var_name" --environment="$ENVIRONMENT"
                echo -e "  ${GREEN}✓${NC} Set from ai/.env"
            else
                echo "  ⚠️  Could not find API key in ai/.env"
                echo "  Please run: echo 'YOUR_KEY' | vercel env add $var_name --environment=$ENVIRONMENT"
            fi
        fi
    else
        echo "$var_value" | vercel env add "$var_name" --environment="$ENVIRONMENT"
        echo -e "  ${GREEN}✓${NC} Set to: $var_value"
    fi
done

echo ""
echo -e "${GREEN}✅ Vercel environment setup complete!${NC}"
echo ""
echo "📋 Next steps:"
echo "  1. Run: vercel deploy"
echo "  2. Test the chatbot at: https://potter-perrone.vercel.app"
echo ""
echo "🔍 Verify variables are set:"
echo "  vercel env ls"
