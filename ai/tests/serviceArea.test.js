'use strict';

const { checkServiceArea } = require('../lib/tools/serviceArea');

describe('checkServiceArea()', () => {
  test('known Syracuse ZIP (13202) is eligible', () => {
    const result = checkServiceArea('13202', '');
    expect(result.eligible).toBe(true);
    expect(result.zip).toBe('13202');
  });

  test('out-of-area ZIP (90210 Beverly Hills) is ineligible', () => {
    const result = checkServiceArea('90210', '');
    expect(result.eligible).toBe(false);
    expect(result.reason).toBe('outside-service-area');
  });

  test('known city name "Liverpool" is eligible (case-insensitive)', () => {
    const result = checkServiceArea('', 'Liverpool');
    expect(result.eligible).toBe(true);
  });

  test('known city name "Syracuse" is eligible', () => {
    const result = checkServiceArea('', 'Syracuse');
    expect(result.eligible).toBe(true);
  });

  test('no location provided returns null eligibility', () => {
    const result = checkServiceArea('', '');
    expect(result.eligible).toBeNull();
    expect(result.reason).toBe('no-location-provided');
    expect(result.zip).toBeNull();
  });

  test('unknown city AND unknown ZIP is ineligible', () => {
    const result = checkServiceArea('99999', 'Los Angeles');
    expect(result.eligible).toBe(false);
  });

  test('ZIP takes priority when both zip and city match', () => {
    const result = checkServiceArea('13205', 'Syracuse');
    expect(result.eligible).toBe(true);
    expect(result.zip).toBe('13205');
  });

  test('eligible when city matches even if ZIP does not', () => {
    const result = checkServiceArea('00000', 'cicero');
    expect(result.eligible).toBe(true);
  });
});
