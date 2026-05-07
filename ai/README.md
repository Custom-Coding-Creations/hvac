# HVAC AI Orchestration Service

Stack-agnostic lead enrichment and routing layer for the Potter-Perrone HVAC website. Works with any CMS, CRM, or frontend stack — no database required.

## What it does

1. **Receives** AI-triage leads from the frontend (`POST /ai/lead`)
2. **Enriches** each lead with weather alerts (NWS, free) and AQI data (AirNow, free key)
3. **Checks** the service area (ZIP code and city name, configurable via env)
4. **Routes** to a human via the policy engine (urgent issues → call, financing → augment, routine → automate)
5. **Delivers** to any webhook (Zapier, Make, n8n, CRM) and/or SMTP email in parallel

All enrichment is best-effort and non-blocking — a weather outage never delays lead delivery.

---

## Quick start (local)

```bash
cd ai
cp .env.example .env          # fill in at least LEAD_TO_EMAIL or WEBHOOK_URL
npm install
npm start
```

The service starts on `http://localhost:3001`. Test the health endpoint:

```bash
curl http://localhost:3001/health
```

---

## Deploy

### Option A — Railway (recommended, free tier available)

1. Push this repo to GitHub.
2. Go to [railway.app](https://railway.app), create a new project → "Deploy from GitHub repo".
3. Select this repository, set **Root Directory** to `ai/`.
4. Add environment variables in the Railway dashboard (see `.env.example`).
5. Railway reads `railway.toml` automatically — no further config needed.
6. Copy the generated `*.railway.app` URL into your templates' `window.HVAC_AI.endpoint`.

### Option B — Render (free tier, spins down after 15 min of inactivity)

1. Go to [render.com](https://render.com) → "New" → "Web Service" → connect GitHub repo.
2. Set **Root Directory** to `ai/`, or use the `render.yaml` blueprint.
3. Add secret env vars in the Render dashboard.
4. Copy the `*.onrender.com` URL into your templates' `window.HVAC_AI.endpoint`.

### Option C — Fly.io

```bash
cd ai
fly launch --name hvac-ai --region ewr   # New York region (closest to Syracuse)
fly secrets set WEBHOOK_URL=https://...
fly secrets set LEAD_TO_EMAIL=owner@potter-perrone.com
fly deploy
```

### Option D — Any VPS / Docker

```bash
docker run -d \
  -p 3001:3001 \
  -e NODE_ENV=production \
  -e WEBHOOK_URL=https://your-webhook \
  -e ALLOWED_ORIGINS=https://potter-perrone.vercel.app \
  node:18-alpine sh -c "npm install --production && node server.js"
```

---

## Wire the frontend

After deploying, set `endpoint` in each template's `window.HVAC_AI` block:

```html
<script>
  window.HVAC_AI = {
    endpoint: 'https://hvac-ai.up.railway.app',   // ← your service URL
    webhookUrl: ''
  };
</script>
```

This block is already present (commented-empty) in:
- `frontend/templates/homepage.html`
- `frontend/templates/service-template.html`
- `frontend/templates/location-template.html`
- `frontend/templates/emergency-landing.html`

If your service domain is not `*.railway.app` or `*.onrender.com`, add it to the `connect-src` directive in `vercel.json`.

---

## API reference

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Liveness check |
| `POST` | `/ai/session` | Get session token + capability flags |
| `POST` | `/ai/lead` | Submit a triage lead (enriched + delivered) |
| `POST` | `/ai/handoff` | Escalate a conversation to a human |
| `GET` | `/ai/context/service-area?zip=&city=` | Check eligibility + weather/AQI |

### `POST /ai/lead` payload

```json
{
  "template": "service",
  "promptLabel": "No heat",
  "summary": "Customer has no heat",
  "urgency": "urgent",
  "handoff": "call",
  "capturedAt": "2026-05-06T12:00:00Z",
  "fields": {
    "name": "Jane Smith",
    "phone": "3155550100",
    "zip": "13202"
  }
}
```

### Response

```json
{
  "received": true,
  "leadId": "lx3k8a-r4f2z9",
  "policyDecision": {
    "mode": "handoff",
    "reason": "urgent-issue",
    "recommendedAction": "call",
    "priority": "high",
    "afterHours": false
  },
  "serviceArea": { "eligible": true, "reason": "in-service-area", "zip": "13202" },
  "deliveryStatus": {
    "webhook": { "sent": true, "status": 200, "attempt": 0 },
    "email": { "sent": true, "messageId": "..." }
  },
  "timestamp": "2026-05-06T12:00:00.000Z"
}
```

---

## Environment variables

See `.env.example` for the full list. The minimum viable configuration is:

| Variable | Required | Notes |
|----------|----------|-------|
| `ALLOWED_ORIGINS` | Yes | Comma-separated list of your Vercel URLs |
| `WEBHOOK_URL` or `SMTP_HOST+LEAD_TO_EMAIL` | At least one | Lead delivery destination |

---

## Tests

```bash
npm test
```

44 tests across three suites: `policy`, `serviceArea`, `validate`.

---

## Service area

Default coverage: the 31 Syracuse-metro ZIP codes listed in `lib/tools/serviceArea.js`. Override without code changes:

```
SERVICE_AREA_ZIPS=13201,13202,...
SERVICE_AREA_CITIES=syracuse,liverpool,...
```
