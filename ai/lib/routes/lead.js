'use strict';

/**
 * POST /ai/lead
 *
 * Receives an AI-triage lead from the frontend, enriches it with weather and
 * service-area context, applies the automation policy, then fans out to all
 * configured adapters (webhook, email) in parallel.
 */

const { validateLeadPayload, sanitizeString, sanitizeFields } = require('../validate');
const { checkServiceArea } = require('../tools/serviceArea');
const { getWeatherContext } = require('../tools/weather');
const { decide } = require('../policy');
const webhookAdapter = require('../adapters/webhook');
const emailAdapter = require('../adapters/email');

module.exports = async function leadRoute(req, res) {
  // Validate
  const validation = validateLeadPayload(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: 'Invalid lead payload', details: validation.errors });
  }

  const body = req.body;
  const fields = sanitizeFields(body.fields || {});

  // Build sanitized payload
  const payload = {
    template: sanitizeString(String(body.template || 'homepage'), 64),
    promptLabel: sanitizeString(String(body.promptLabel || ''), 200),
    summary: sanitizeString(String(body.summary || ''), 500),
    urgency: sanitizeString(String(body.urgency || 'standard'), 32),
    handoff: sanitizeString(String(body.handoff || 'form'), 32),
    destination: sanitizeString(String(body.destination || 'fallback'), 64),
    capturedAt: sanitizeString(String(body.capturedAt || new Date().toISOString()), 64),
    fields,
  };

  // Service area check (synchronous — loaded from env at startup)
  const zip = fields.zip || '';
  const city = fields.neighborhood || fields.city || '';
  payload.serviceArea = checkServiceArea(zip, city);

  // Weather enrichment (best-effort, capped at 3 s so it never blocks delivery)
  const lat = parseFloat(process.env.BUSINESS_LAT || '');
  const lon = parseFloat(process.env.BUSINESS_LNG || '');
  if (!isNaN(lat) && !isNaN(lon)) {
    try {
      payload.weatherContext = await Promise.race([
        getWeatherContext(lat, lon),
        new Promise(function (resolve) {
          setTimeout(function () { resolve(null); }, 3000);
        }),
      ]);
    } catch (_) {
      payload.weatherContext = null;
    }
  }

  // Automation policy
  const policyDecision = decide({
    issueType: payload.promptLabel || fields.issue || '',
    urgency: payload.urgency,
    confidence: 1.0,
  });
  payload.policyDecision = policyDecision;

  // Fan-out delivery (parallel, failures logged but never surface to caller)
  const [webhookResult, emailResult] = await Promise.all([
    webhookAdapter.send(process.env.WEBHOOK_URL, payload, process.env.WEBHOOK_SECRET),
    emailAdapter.send(payload),
  ]);

  const leadId =
    Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);

  res.json({
    received: true,
    leadId,
    policyDecision,
    serviceArea: payload.serviceArea,
    deliveryStatus: {
      webhook: webhookResult,
      email: emailResult,
    },
    timestamp: new Date().toISOString(),
  });
};
