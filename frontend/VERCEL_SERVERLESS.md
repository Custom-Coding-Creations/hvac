# AI Orchestration on Vercel Serverless Functions

The HVAC website's AI layer is now fully integrated into Vercel as serverless functions. **No external service deployment required** — everything runs on the same platform as the frontend.

## Architecture

```
potter-perrone.vercel.app/
├── /                    ← static site (homepage, templates, assets)
├── /api/session         ← POST session request
├── /api/lead            ← POST triage lead (enriched + routed)
├── /api/handoff         ← POST escalation to human
└── /api/context         ← GET service-area + weather/AQI
```

All handlers are in `frontend/api/` with shared logic in `frontend/lib/`.

## Features

- **No cold-start latency perception** — lead submission is async (fire-and-forget), so Vercel's ~1s cold start doesn't block the user
- **Weather enrichment** — NWS API (free, no key)
- **AQI context** — AirNow API (free key, opt-in)
- **Service area validation** — configurable ZIP codes and cities (defaults to Syracuse metro)
- **Lead delivery** — parallel webhook + email (SMTP)
- **Automation policy** — rule-based routing (urgent → call, financing → augment, routine → automate)

## Environment variables

Set these in Vercel → Settings → Environment Variables:

| Variable | Required | Notes |
|----------|----------|-------|
| `WEBHOOK_URL` | If no email | Zapier, Make, n8n, or CRM webhook |
| `WEBHOOK_SECRET` | Optional | HMAC-SHA256 signature for webhook |
| `SMTP_HOST` | If no webhook | Email delivery (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | If SMTP | Usually 587 or 465 |
| `SMTP_USER` | If SMTP | Email account username |
| `SMTP_PASS` | If SMTP | Email account password or app key |
| `LEAD_TO_EMAIL` | If SMTP | Recipient address |
| `LEAD_FROM_EMAIL` | If SMTP | Sender address (defaults to SMTP_USER) |
| `AIRNOW_API_KEY` | Optional | Free key from https://docs.airnowapi.org/ |
| `BUSINESS_LAT` | Optional | Default: 43.0481 (Potter-Perrone) |
| `BUSINESS_LNG` | Optional | Default: -76.1474 |
| `SERVICE_AREA_ZIPS` | Optional | Comma-separated ZIP list (defaults to Syracuse metro) |
| `SERVICE_AREA_CITIES` | Optional | Comma-separated city names (lowercase) |

## Deploying

1. **Push to GitHub** — the repo is already configured with CI/CD in `.github/workflows/`.
2. **Connect Vercel** — go to vercel.com, import this GitHub repo.
3. **Set environment variables** — in the Vercel dashboard, add at least one of `WEBHOOK_URL` or `SMTP_*` variables.
4. **Deploy** — Vercel automatically deploys on `git push main`.

## Testing locally

Run the frontend validation suite:

```bash
cd frontend
npm test
npm run validate
```

Or test a specific API handler manually:

```bash
# Test the session endpoint
curl -X POST http://localhost:3001/api/session \
  -H "Content-Type: application/json" \
  -d '{"template":"homepage"}'

# Test the lead endpoint (requires WEBHOOK_URL or SMTP_* configured)
curl -X POST http://localhost:3001/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "template": "service",
    "promptLabel": "No heat",
    "summary": "No heat in the house",
    "urgency": "urgent",
    "fields": { "name": "Jane", "phone": "3155550100", "zip": "13202" }
  }'
```

## Rate limiting

In-memory rate limiter: **30 requests per minute per IP**.  No configuration required — hard-coded in `lib/rateLimit.js`.

## Alternative: Separate service

If you prefer to keep the AI service separate:

1. Keep the code in the `ai/` directory (not used in the current setup)
2. Deploy to Railway, Render, or Fly.io using their deployment configs
3. Update `window.HVAC_AI.endpoint` in templates to point to the external service
4. Update `vercel.json` CSP `connect-src` to allow that domain

The Vercel serverless approach is simpler for small-to-medium traffic and requires zero additional infrastructure costs.

---

**Env var setup checklist:**

- [ ] Set `WEBHOOK_URL` to your Zapier/Make/n8n inbox URL OR
- [ ] Set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `LEAD_TO_EMAIL` for email delivery
- [ ] (Optional) Set `AIRNOW_API_KEY` for air quality context
- [ ] (Optional) Override `SERVICE_AREA_ZIPS` if expanding service area
- [ ] Push to main → Vercel deploys automatically
