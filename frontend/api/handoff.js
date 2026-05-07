'use strict';

/**
 * POST /api/handoff
 *
 * Called when the policy engine decides a conversation should be escalated to
 * a human.  Accepts an optional conversation transcript, sanitises it, and
 * fans out to configured adapters so a human can follow up promptly.
 */

const { sanitizeString, sanitizeFields } = require('../lib/validate');
const webhookAdapter = require('../lib/adapters/webhook');
const emailAdapter = require('../lib/adapters/email');

module.exports = async function handler(req, res) {
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
  const fields = sanitizeFields(body.fields || {});

  // Sanitise transcript (max 50 turns, each role+content truncated)
  const rawTranscript = Array.isArray(body.transcript) ? body.transcript : [];
  const transcript = rawTranscript.slice(0, 50).map(function (turn) {
    return {
      role: sanitizeString(String(turn.role || 'user'), 16),
      content: sanitizeString(String(turn.content || ''), 500),
    };
  });

  const payload = {
    type: 'handoff',
    template: sanitizeString(String(body.template || ''), 64),
    reason: sanitizeString(String(body.reason || ''), 200),
    urgency: sanitizeString(String(body.urgency || 'standard'), 32),
    recommendedAction: sanitizeString(String(body.recommendedAction || 'form'), 32),
    summary: sanitizeString(String(body.summary || ''), 500),
    transcript,
    fields,
    capturedAt: new Date().toISOString(),
  };

  const [webhookResult, emailResult] = await Promise.all([
    webhookAdapter.send(process.env.WEBHOOK_URL, payload, process.env.WEBHOOK_SECRET),
    emailAdapter.send(payload),
  ]);

  const handoffId =
    Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);

  res.status(200).json({
    received: true,
    handoffId,
    deliveryStatus: {
      webhook: webhookResult,
      email: emailResult,
    },
    timestamp: new Date().toISOString(),
  });
};
