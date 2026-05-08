# Vercel Environment Variables Setup Guide

## Overview
The HVAC chatbot requires OpenAI API credentials to function. These must be set in Vercel as environment variables for the serverless functions in `/frontend/api/` to access them.

## Required Variables

| Variable | Value | Source |
|----------|-------|--------|
| `OPENAI_API_KEY` | Your OpenAI API key | https://platform.openai.com/api-keys |
| `OPENAI_MODEL` | `gpt-4o-mini` | Recommended model |
| `OPENAI_TIMEOUT_MS` | `7000` | 7 second timeout |
| `OPENAI_MAX_TOKENS` | `320` | Max response tokens |
| `OPENAI_HISTORY_MAX_TURNS` | `8` | Conversation history depth |

## Setup Methods

### Quick Setup (Using CLI)

1. **Ensure you're logged into Vercel:**
   ```bash
   vercel login
   ```

2. **From the project root, run:**
   ```bash
   cd /home/obsidian/Projects/hvac
   bash scripts/setup-vercel-env.sh
   ```

3. **Deploy:**
   ```bash
   vercel deploy --prod
   ```

### Manual Setup (Dashboard)

1. Go to https://vercel.com/dashboard
2. Select your **hvac** project
3. Click **Settings** → **Environment Variables**
4. Add each variable from the table above
5. Ensure each variable is available for `Production`, `Preview`, and `Development` environments
6. Redeploy: Click **Deployments** → latest deployment → **Redeploy**

### Environment Setup (via CLI)

```bash
# Set production environment variables
echo "sk-proj-YOUR_KEY_HERE" | vercel env add OPENAI_API_KEY --environment=production
echo "gpt-4o-mini" | vercel env add OPENAI_MODEL --environment=production
echo "7000" | vercel env add OPENAI_TIMEOUT_MS --environment=production
echo "320" | vercel env add OPENAI_MAX_TOKENS --environment=production
echo "8" | vercel env add OPENAI_HISTORY_MAX_TURNS --environment=production

# Verify they're set
vercel env ls
```

## Verification

After setting variables:

1. **Check Vercel dashboard shows all variables**
2. **Redeploy the application:** `vercel deploy --prod`
3. **Test the chatbot:**
   - Visit https://potter-perrone.vercel.app
   - Try typing any message in the chat
   - Should get a real AI response (not the fallback message)

4. **Check function logs:**
   ```bash
   vercel logs --state=ready
   ```

## Troubleshooting

### Chatbot still shows fallback response after deployment

1. **Verify variables in Vercel:**
   ```bash
   vercel env ls
   ```

2. **Confirm they're in `Production` scope:**
   - Dashboard → Settings → Environment Variables → check the filter

3. **Check deployment logs:**
   ```bash
   vercel logs --follow
   ```

4. **Force redeploy:**
   ```bash
   vercel deploy --prod --force
   ```

### "Unauthorized" errors from OpenAI API

- Verify the API key is valid: https://platform.openai.com/api-keys
- Check key has not exceeded rate limits or quota
- Ensure key has `chat.completions` permissions

### API Key shows in logs

If you accidentally exposed your API key:
1. **Immediately rotate it:**
   - https://platform.openai.com/api-keys
   - Delete old key → Generate new key
2. **Update Vercel:**
   ```bash
   vercel env pull # pulls current env
   # Edit .env.local with new key
   vercel env add OPENAI_API_KEY --environment=production
   ```

## Local Development

For local testing, you can add credentials to `frontend/.env`:

```bash
cd frontend
# Add your API key temporarily
echo "OPENAI_API_KEY=sk-proj-YOUR_KEY" >> .env

# Install and run locally
npm install
vercel dev
```

⚠️ **Never commit `.env` files to git** — they're already in `.gitignore`

## Security Best Practices

- ✅ `.env` files are in `.gitignore`
- ✅ Never hardcode secrets in code
- ✅ Use Vercel's environment variable system
- ✅ Rotate API keys periodically
- ✅ Review Vercel logs for suspicious activity
- ✅ Set up billing alerts in OpenAI dashboard

## File References

- **Config:** [vercel.json](../vercel.json)
- **Chat handler:** [frontend/api/chat.js](../frontend/api/chat.js#L162-L169)
- **Frontend config:** [frontend/index.html](../frontend/index.html#L430-L436)
- **Setup script:** [scripts/setup-vercel-env.sh](../scripts/setup-vercel-env.sh)
- **Environment template:** [frontend/.env](../frontend/.env)
