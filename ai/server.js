'use strict';

// Load .env when available (local dev).  Never throws — production relies on
// the platform's environment variable injection instead.
try { require('dotenv').config(); } catch (_) { /* rely on system env */ }

const express = require('express');
const rateLimit = require('./lib/rateLimit');
const sessionRoute = require('./lib/routes/session');
const leadRoute = require('./lib/routes/lead');
const handoffRoute = require('./lib/routes/handoff');
const contextRoute = require('./lib/routes/context');

const app = express();

// ─── Security headers ────────────────────────────────────────────────────────
app.use(function (req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(function (s) { return s.trim(); })
  .filter(Boolean);

app.use(function (req, res, next) {
  const origin = req.headers.origin || '';
  const allowed =
    !allowedOrigins.length ||
    allowedOrigins.includes('*') ||
    allowedOrigins.includes(origin);

  if (allowed && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
});

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '32kb' }));

// ─── Rate limiting ────────────────────────────────────────────────────────────
app.use(rateLimit);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/health', function (req, res) {
  res.json({
    status: 'ok',
    service: 'hvac-ai',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'production',
  });
});

app.post('/ai/session', sessionRoute);
app.post('/ai/lead', leadRoute);
app.post('/ai/handoff', handoffRoute);
app.get('/ai/context/service-area', contextRoute);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use(function (req, res) {
  res.status(404).json({ error: 'Not found' });
});

// ─── Error handler ────────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  const status = (err && err.status) || 500;
  const isProd = process.env.NODE_ENV === 'production';
  res.status(status).json({
    error: isProd ? 'Internal error' : ((err && err.message) || 'Internal error'),
  });
});

// ─── Entry point (standalone mode) ───────────────────────────────────────────
module.exports = app;

if (require.main === module) {
  const PORT = parseInt(process.env.PORT || '3001', 10);
  const http = require('http');

  http.createServer(app).listen(PORT, function () {
    console.log('[hvac-ai] Listening on port ' + PORT);

    const hasWebhook = !!process.env.WEBHOOK_URL;
    const hasEmail = !!(process.env.SMTP_HOST && process.env.LEAD_TO_EMAIL);

    if (hasWebhook) console.log('[hvac-ai] Webhook delivery : enabled');
    if (hasEmail)   console.log('[hvac-ai] Email delivery   : enabled');

    if (!hasWebhook && !hasEmail) {
      console.warn(
        '[hvac-ai] Warning: no lead delivery configured.\n' +
        '  Set WEBHOOK_URL or SMTP_HOST+LEAD_TO_EMAIL in .env to receive leads.'
      );
    }
  });
}
