'use strict';

/**
 * Automation policy engine.
 *
 * Maps a lead context to one of three modes:
 *   'handoff'  — route to a human immediately (urgent or low-confidence)
 *   'augment'  — AI prepares the lead, human makes the final decision
 *   'automate' — AI can handle the full capture flow without a human touch
 */

const URGENT_ISSUES = new Set([
  'no-heat',
  'no-cooling',
  'active-leak',
  'gas-odor',
  'no-water',
  'emergency',
  'fire',
  'flood',
  'no heat',
  'no cooling',
  'active leak',
  'gas odor',
  'no heat or cooling',
  'no heat or cooling emergency',
  'active leak emergency',
]);

const ASSISTED_ISSUES = new Set([
  'financing',
  'estimate',
  'replacement estimate',
  'system-replacement',
  'commercial',
  'quote',
  'pricing',
  'repair or replace',
]);

/** Normalize an issue label for consistent matching. */
function normalizeIssue(raw) {
  if (!raw) return '';
  return String(raw)
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Determine whether a given datetime is outside business hours.
 * @param {Date|null} date - Date to check; defaults to now.
 * @param {number}   tzOffset - Hours offset from UTC (Eastern = -5 / -4).
 */
function isAfterHours(date, tzOffset) {
  const d = date instanceof Date ? date : new Date();
  const offset = typeof tzOffset === 'number' ? tzOffset : -5;
  const localHour = ((d.getUTCHours() + offset) % 24 + 24) % 24;
  const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isDuringBusinessHours = localHour >= 8 && localHour < 18;
  return isWeekend || !isDuringBusinessHours;
}

/**
 * Make an automation decision.
 *
 * @param {object} context
 * @param {string}  context.issueType      - Issue label from the prompt catalog.
 * @param {string}  [context.urgency]      - 'urgent' | 'standard'
 * @param {number}  [context.confidence]   - 0–1; defaults to 1.0 for rule-based.
 * @param {Date}    [context.date]         - Timestamp for after-hours check.
 * @param {number}  [context.tzOffset]     - Hours from UTC (default -5 Eastern).
 * @returns {{ mode, reason, recommendedAction, priority, afterHours }}
 */
function decide(context) {
  const issue = normalizeIssue(context.issueType || context.issue || '');
  const urgency = String(context.urgency || 'standard').toLowerCase();
  const confidence = typeof context.confidence === 'number' ? context.confidence : 1.0;
  const afterHours = isAfterHours(context.date || null, context.tzOffset);

  if (urgency === 'urgent' || URGENT_ISSUES.has(issue)) {
    return {
      mode: 'handoff',
      reason: 'urgent-issue',
      recommendedAction: 'call',
      priority: 'high',
      afterHours,
    };
  }

  if (confidence < 0.5) {
    return {
      mode: 'handoff',
      reason: 'low-confidence',
      recommendedAction: 'form',
      priority: 'medium',
      afterHours,
    };
  }

  if (ASSISTED_ISSUES.has(issue)) {
    return {
      mode: 'augment',
      reason: 'requires-human-judgment',
      recommendedAction: 'form',
      priority: 'medium',
      afterHours,
    };
  }

  return {
    mode: 'automate',
    reason: afterHours ? 'after-hours-capture' : 'standard-flow',
    recommendedAction: 'form',
    priority: 'low',
    afterHours,
  };
}

module.exports = { decide, isAfterHours, normalizeIssue };
