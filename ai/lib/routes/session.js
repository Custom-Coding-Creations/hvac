'use strict';

const { randomUUID } = require('crypto');

/**
 * POST /ai/session
 *
 * Returns a session token and the set of AI capabilities that are currently
 * configured on this server.  The frontend uses this to decide which AI
 * features to advertise to the user.
 */
module.exports = function sessionRoute(req, res) {
  const body = req.body || {};
  const template = String(body.template || 'homepage').slice(0, 64);

  res.json({
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
