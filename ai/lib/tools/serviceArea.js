'use strict';

/**
 * Service area validation tool.
 *
 * Checks a ZIP code or city name against the configured service area.
 * Override the defaults via SERVICE_AREA_ZIPS and SERVICE_AREA_CITIES env vars
 * — no code change or redeploy required when the business expands its coverage.
 */

// Default Syracuse-metro ZIP codes.
const DEFAULT_ZIPS = [
  '13201', '13202', '13203', '13204', '13205', '13206', '13207', '13208',
  '13209', '13210', '13211', '13212', '13214', '13215', '13219', '13220',
  '13221', '13224', '13244', '13290',
  // Surrounding communities: Cicero, Liverpool, Camillus, East Syracuse, DeWitt
  '13027', '13031', '13035', '13057', '13066', '13088', '13090', '13104',
  '13116', '13120', '13122', '13132', '13152', '13153', '13159',
];

const DEFAULT_CITIES = [
  'syracuse', 'liverpool', 'cicero', 'camillus', 'east syracuse',
  'dewitt', 'salina', 'clay', 'geddes', 'solvay', 'tully', 'manlius',
  'fayetteville', 'minoa', 'baldwinsville',
];

/**
 * Load the service area from environment variables, falling back to defaults.
 * Called once at module load so parsing doesn't repeat on every request.
 */
function loadServiceArea() {
  const rawZips = process.env.SERVICE_AREA_ZIPS;
  const zips = rawZips
    ? new Set(rawZips.split(',').map(function (z) { return z.trim(); }).filter(Boolean))
    : new Set(DEFAULT_ZIPS);

  const rawCities = process.env.SERVICE_AREA_CITIES;
  const cities = rawCities
    ? new Set(
        rawCities
          .toLowerCase()
          .split(',')
          .map(function (c) { return c.trim(); })
          .filter(Boolean)
      )
    : new Set(DEFAULT_CITIES);

  return { zips, cities };
}

const serviceArea = loadServiceArea();

/**
 * Check whether a ZIP code or city name falls inside the service area.
 *
 * @param {string} zip   - 5-digit ZIP (or empty string).
 * @param {string} city  - City name (or neighborhood or empty string).
 * @returns {{ eligible: boolean|null, reason: string, zip: string|null }}
 */
function checkServiceArea(zip, city) {
  const normalizedZip = String(zip || '').trim().slice(0, 10);
  const normalizedCity = String(city || '').trim().toLowerCase();

  const hasZip = normalizedZip.length >= 5;
  const hasCity = normalizedCity.length > 0;

  if (!hasZip && !hasCity) {
    return { eligible: null, reason: 'no-location-provided', zip: null };
  }

  const zipEligible = hasZip && serviceArea.zips.has(normalizedZip.slice(0, 5));
  const cityEligible =
    hasCity &&
    Array.from(serviceArea.cities).some(function (c) {
      return normalizedCity.includes(c) || c.includes(normalizedCity);
    });

  if (zipEligible || cityEligible) {
    return {
      eligible: true,
      reason: 'in-service-area',
      zip: hasZip ? normalizedZip.slice(0, 5) : null,
    };
  }

  return {
    eligible: false,
    reason: 'outside-service-area',
    zip: hasZip ? normalizedZip.slice(0, 5) : null,
  };
}

module.exports = { checkServiceArea, loadServiceArea };
