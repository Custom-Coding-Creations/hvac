'use strict';

const { validateLeadPayload, sanitizeString, sanitizeFields } = require('../lib/validate');

describe('validateLeadPayload()', () => {
  test('valid minimal payload passes', () => {
    const result = validateLeadPayload({ fields: { name: 'Alice', phone: '3155550100' } });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('missing fields property fails', () => {
    const result = validateLeadPayload({ template: 'homepage' });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('fields is required');
  });

  test('fields: {} (empty object) passes — phone is optional', () => {
    const result = validateLeadPayload({ fields: {} });
    expect(result.valid).toBe(true);
  });

  test('invalid short phone fails', () => {
    const result = validateLeadPayload({ fields: { phone: '123' } });
    expect(result.valid).toBe(false);
  });

  test('valid 10-digit phone passes', () => {
    const result = validateLeadPayload({ fields: { phone: '3155550100' } });
    expect(result.valid).toBe(true);
  });

  test('phone with formatting chars passes (non-digits stripped internally)', () => {
    const result = validateLeadPayload({ fields: { phone: '(315) 555-0100' } });
    expect(result.valid).toBe(true);
  });

  test('invalid template fails', () => {
    const result = validateLeadPayload({ fields: {}, template: 'evil-page' });
    expect(result.valid).toBe(false);
  });

  test('valid template passes', () => {
    const result = validateLeadPayload({ fields: {}, template: 'service' });
    expect(result.valid).toBe(true);
  });

  test('invalid ZIP format fails', () => {
    const result = validateLeadPayload({ fields: { zip: 'ABCDE' } });
    expect(result.valid).toBe(false);
  });

  test('valid 5-digit ZIP passes', () => {
    const result = validateLeadPayload({ fields: { zip: '13202' } });
    expect(result.valid).toBe(true);
  });

  test('non-object body returns invalid', () => {
    const result = validateLeadPayload('not-an-object');
    expect(result.valid).toBe(false);
  });

  test('null body returns invalid', () => {
    const result = validateLeadPayload(null);
    expect(result.valid).toBe(false);
  });
});

describe('sanitizeString()', () => {
  test('trims surrounding whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
  });

  test('truncates to maxLength', () => {
    expect(sanitizeString('a'.repeat(1200))).toHaveLength(1000);
    expect(sanitizeString('a'.repeat(50), 20)).toHaveLength(20);
  });

  test('returns empty string for non-string values', () => {
    expect(sanitizeString(null)).toBe('');
    expect(sanitizeString(42)).toBe('');
    expect(sanitizeString(undefined)).toBe('');
    expect(sanitizeString({})).toBe('');
  });
});

describe('sanitizeFields()', () => {
  test('passes through string values', () => {
    const result = sanitizeFields({ name: 'Alice', phone: '3155550100' });
    expect(result.name).toBe('Alice');
    expect(result.phone).toBe('3155550100');
  });

  test('drops non-string values', () => {
    const result = sanitizeFields({ name: 'Alice', count: 5, flag: true });
    expect(result.name).toBe('Alice');
    expect(result.count).toBeUndefined();
    expect(result.flag).toBeUndefined();
  });

  test('truncates keys longer than 64 chars', () => {
    const longKey = 'k'.repeat(80);
    const result = sanitizeFields({ [longKey]: 'value' });
    const keys = Object.keys(result);
    expect(keys[0]).toHaveLength(64);
  });

  test('returns empty object for null input', () => {
    expect(sanitizeFields(null)).toEqual({});
    expect(sanitizeFields(undefined)).toEqual({});
  });
});
