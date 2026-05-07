'use strict';

/**
 * Email adapter (SMTP via nodemailer).
 *
 * Sends a plain-text lead summary to the configured recipient.
 * Only active when SMTP_HOST, SMTP_USER, SMTP_PASS, and LEAD_TO_EMAIL are set.
 * Falls back gracefully with { skipped: true } when not configured.
 */

let transporterCache = null;

function getTransporter() {
  if (transporterCache) return transporterCache;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  try {
    const nodemailer = require('nodemailer');
    const port = parseInt(SMTP_PORT || '587', 10);
    transporterCache = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    return transporterCache;
  } catch (_) {
    return null;
  }
}

/**
 * Send a lead or handoff payload as a plain-text email.
 *
 * @param {object} payload - Sanitised lead or handoff payload.
 * @returns {Promise<{ sent: boolean, messageId?: string, error?: string }>}
 */
async function send(payload) {
  const transporter = getTransporter();
  const toEmail = process.env.LEAD_TO_EMAIL;
  const fromEmail = process.env.LEAD_FROM_EMAIL || process.env.SMTP_USER;

  if (!transporter) return { skipped: true, reason: 'smtp-not-configured' };
  if (!toEmail) return { skipped: true, reason: 'no-recipient' };

  const fields = payload.fields || {};
  const name = fields.name || '(not provided)';
  const phone = fields.phone || '(not provided)';
  const location = fields.zip || fields.neighborhood || fields.city || '(not provided)';
  const issue = fields.issue || payload.promptLabel || '(not provided)';
  const isUrgent = payload.urgency === 'urgent' || (payload.policyDecision && payload.policyDecision.priority === 'high');

  const subject =
    '[HVAC Lead]' +
    (isUrgent ? ' URGENT — ' : ' ') +
    issue.slice(0, 80);

  const weatherLine = payload.weatherContext
    ? 'Weather alerts: ' + (payload.weatherContext.hasActiveAlerts
        ? payload.weatherContext.alertCount + ' active alert(s)'
        : 'none')
    : null;

  const policyLine = payload.policyDecision
    ? 'Routing: ' + payload.policyDecision.mode + ' — ' + payload.policyDecision.reason
    : null;

  const serviceAreaLine = payload.serviceArea
    ? 'Service area: ' + (payload.serviceArea.eligible === true
        ? 'eligible'
        : payload.serviceArea.eligible === false
          ? 'outside area'
          : 'unknown (no location provided)')
    : null;

  const lines = [
    'New HVAC lead',
    '─'.repeat(40),
    'Name:     ' + name,
    'Phone:    ' + phone,
    'Location: ' + location,
    'Issue:    ' + issue,
    'Urgency:  ' + (payload.urgency || 'standard'),
    'Summary:  ' + (payload.summary || '(none)'),
    'Template: ' + (payload.template || 'unknown'),
    '',
    serviceAreaLine,
    weatherLine,
    policyLine,
    '',
    'Received: ' + (payload.capturedAt || new Date().toISOString()),
  ].filter(function (l) { return l !== null; });

  try {
    const result = await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject,
      text: lines.join('\n'),
    });
    return { sent: true, messageId: result.messageId };
  } catch (err) {
    return { sent: false, error: err.message };
  }
}

// Reset cached transporter (used in tests to clear between runs).
function resetTransporter() {
  transporterCache = null;
}

module.exports = { send, resetTransporter };
