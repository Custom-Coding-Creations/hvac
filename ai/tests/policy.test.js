'use strict';

const { decide, isAfterHours, normalizeIssue } = require('../lib/policy');

describe('Policy engine — decide()', () => {
  test('urgent urgency field → handoff + call + high priority', () => {
    const result = decide({ urgency: 'urgent', issueType: 'maintenance', confidence: 1.0 });
    expect(result.mode).toBe('handoff');
    expect(result.recommendedAction).toBe('call');
    expect(result.priority).toBe('high');
  });

  test('no-heat issue → handoff regardless of urgency field', () => {
    const result = decide({ urgency: 'standard', issueType: 'no-heat', confidence: 1.0 });
    expect(result.mode).toBe('handoff');
    expect(result.priority).toBe('high');
  });

  test('gas-odor issue → handoff', () => {
    const result = decide({ urgency: 'standard', issueType: 'gas-odor', confidence: 1.0 });
    expect(result.mode).toBe('handoff');
    expect(result.recommendedAction).toBe('call');
  });

  test('active-leak issue → handoff', () => {
    const result = decide({ urgency: 'standard', issueType: 'active-leak', confidence: 1.0 });
    expect(result.mode).toBe('handoff');
  });

  test('financing issue → augment mode', () => {
    const result = decide({ urgency: 'standard', issueType: 'financing', confidence: 1.0 });
    expect(result.mode).toBe('augment');
    expect(result.reason).toBe('requires-human-judgment');
    expect(result.priority).toBe('medium');
  });

  test('estimate issue → augment mode', () => {
    const result = decide({ urgency: 'standard', issueType: 'estimate', confidence: 1.0 });
    expect(result.mode).toBe('augment');
  });

  test('maintenance with high confidence → automate', () => {
    const result = decide({ urgency: 'standard', issueType: 'maintenance', confidence: 0.9 });
    expect(result.mode).toBe('automate');
  });

  test('low confidence → handoff', () => {
    const result = decide({ urgency: 'standard', issueType: 'maintenance', confidence: 0.3 });
    expect(result.mode).toBe('handoff');
    expect(result.reason).toBe('low-confidence');
  });

  test('result includes afterHours flag', () => {
    const result = decide({ urgency: 'standard', issueType: 'maintenance', confidence: 1.0 });
    expect(typeof result.afterHours).toBe('boolean');
  });
});

describe('Policy engine — normalizeIssue()', () => {
  test('strips special chars and lowercases', () => {
    expect(normalizeIssue('No Heat!')).toBe('no heat');
    expect(normalizeIssue('  GAS ODOR  ')).toBe('gas odor');
    expect(normalizeIssue('Active-Leak')).toBe('active-leak');
  });

  test('handles empty and null input', () => {
    expect(normalizeIssue('')).toBe('');
    expect(normalizeIssue(null)).toBe('');
    expect(normalizeIssue(undefined)).toBe('');
  });
});

describe('Policy engine — isAfterHours()', () => {
  test('returns false during weekday business hours (Eastern 10 am Mon)', () => {
    // 2026-05-04 is a Monday; 15:00 UTC = 10:00 ET (offset -5)
    const date = new Date('2026-05-04T15:00:00Z');
    expect(isAfterHours(date, -5)).toBe(false);
  });

  test('returns true before 8 am on a weekday', () => {
    // Monday 12:00 UTC = 7:00 ET
    const date = new Date('2026-05-04T12:00:00Z');
    expect(isAfterHours(date, -5)).toBe(true);
  });

  test('returns true after 6 pm on a weekday', () => {
    // Monday 23:30 UTC = 18:30 ET
    const date = new Date('2026-05-04T23:30:00Z');
    expect(isAfterHours(date, -5)).toBe(true);
  });

  test('returns true on Saturday', () => {
    const date = new Date('2026-05-09T14:00:00Z'); // Saturday
    expect(isAfterHours(date, -5)).toBe(true);
  });

  test('returns true on Sunday', () => {
    const date = new Date('2026-05-10T14:00:00Z'); // Sunday
    expect(isAfterHours(date, -5)).toBe(true);
  });

  test('uses current date when none provided', () => {
    // Just verify it returns a boolean and does not throw.
    expect(typeof isAfterHours(null, -5)).toBe('boolean');
  });
});
