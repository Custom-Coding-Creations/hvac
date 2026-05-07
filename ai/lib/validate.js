'use strict';

const ALLOWED_TEMPLATES = new Set(['homepage', 'service', 'location', 'emergency']);
const MAX_STRING_LEN = 1000;
const PHONE_DIGITS_RE = /^\d{10,15}$/;
const ZIP_RE = /^\d{5}(-\d{4})?$/;

/**
 * Trim and truncate a string value. Returns empty string for non-strings.
 */
function sanitizeString(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength || MAX_STRING_LEN);
}

/**
 * Sanitize every value in a flat key→string object. Drops non-string values.
 */
function sanitizeFields(fields) {
  if (!fields || typeof fields !== 'object') return {};
  const cleaned = {};
  Object.keys(fields).forEach(function (rawKey) {
    const key = sanitizeString(rawKey, 64);
    if (key && typeof fields[rawKey] === 'string') {
      cleaned[key] = sanitizeString(fields[rawKey]);
    }
  });
  return cleaned;
}

/**
 * Validate the shape and basic content of an incoming lead payload.
 * Returns { valid: boolean, errors: string[] }.
 */
function validateLeadPayload(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Invalid request body'] };
  }

  if (!body.fields || typeof body.fields !== 'object') {
    errors.push('fields is required');
  } else {
    const phone = String(body.fields.phone || '').replace(/\D/g, '');
    if (body.fields.phone && !PHONE_DIGITS_RE.test(phone)) {
      errors.push('phone must have 10–15 digits');
    }

    const zip = String(body.fields.zip || '').trim();
    if (zip && !ZIP_RE.test(zip)) {
      errors.push('zip must be a valid 5-digit code');
    }
  }

  const tmpl = String(body.template || '');
  if (tmpl && !ALLOWED_TEMPLATES.has(tmpl)) {
    errors.push('template must be one of: homepage, service, location, emergency');
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { sanitizeString, sanitizeFields, validateLeadPayload };
