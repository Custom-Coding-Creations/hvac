'use strict';

const { randomUUID } = require('crypto');

/**
 * POST /api/session
 *
 * Returns a session token and the set of AI capabilities that are currently
 * configured on this server.  The frontend uses this to decide which AI
 * features to advertise to the user.
 */
module.exports = function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body || {};
  const template = String(body.template || 'homepage').slice(0, 64);

  res.status(200).json({
    sessionId: randomUUID(),
    template,
    timestamp: new Date().toISOString(),
    capabilities: {
      triage: true,
      serviceAreaCheck: true,
      weatherContext: !!(process.env.BUSINESS_LAT && process.env.BUSINESS_LNG),
      aqiContext: !!process.env.AIRNOW_API_KEY,
      webhookDelivery: !!process.env.WEBHOOK_URL,
      emailDelivery: !!(process.env.SMTP_HOST && process.env.LEAD_TO_EMAIL),
    },
  });
};
