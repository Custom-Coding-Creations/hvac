'use strict';

/**
 * Webhook adapter.
 *
 * POSTs a JSON payload to any HTTPS endpoint.  Works with Zapier, Make, n8n,
 * your own CRM webhook, or a plain Cloud Function.
 *
 * Retries up to MAX_RETRIES times on 5xx responses or network errors.
 * Includes an optional HMAC-SHA256 signature header for verification.
 */

const TIMEOUT_MS = 8000;
const MAX_RETRIES = 2;

/**
 * Send a payload to the configured webhook URL.
 *
 * @param {string}  url     - Destination HTTPS URL.
 * @param {object}  payload - JSON-serializable lead or handoff payload.
 * @param {string}  [secret]- Optional HMAC secret for X-Signature-256 header.
 * @returns {Promise<{ sent: boolean, status?: number, error?: string }>}
 */
async function send(url, payload, secret) {
  if (!url) {
    return { skipped: true, reason: 'no-webhook-url' };
  }

  const body = JSON.stringify(payload);
  const headers = {
    'Content-Type': 'application/json',
    'X-Source': 'hvac-ai',
    'X-Timestamp': new Date().toISOString(),
  };

  if (secret) {
    try {
      const crypto = require('crypto');
      const sig = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');
      headers['X-Signature-256'] = 'sha256=' + sig;
    } catch (_) {
      // crypto unavailable; skip signature
    }
  }

  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(function () {
      controller.abort();
    }, TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        return { sent: true, status: res.status, attempt };
      }

      lastError = new Error('Webhook returned HTTP ' + res.status);

      // Client errors (4xx) are not retried — they indicate a config problem.
      if (res.status < 500) {
        return { sent: false, error: lastError.message, status: res.status };
      }
    } catch (err) {
      clearTimeout(timer);
      lastError = err;
      if (attempt < MAX_RETRIES) {
        await new Promise(function (resolve) {
          setTimeout(resolve, 500 * (attempt + 1));
        });
      }
    }
  }

  return {
    sent: false,
    error: lastError ? lastError.message : 'unknown',
    retries: MAX_RETRIES,
  };
}

module.exports = { send };
