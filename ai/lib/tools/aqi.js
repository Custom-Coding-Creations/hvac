'use strict';

/**
 * AirNow AQI tool.
 *
 * Free registration at https://docs.airnowapi.org/
 * Set AIRNOW_API_KEY env var to enable.  Returns null gracefully when not
 * configured or when the API is unreachable.
 */

const AIRNOW_BASE =
  'https://www.airnowapi.org/aq/observation/zipCode/current/';
const TIMEOUT_MS = 4000;

/**
 * Fetch current AQI for a ZIP code.
 *
 * @param {string} zip      - 5-digit ZIP code.
 * @param {string} apiKey   - AirNow API key from process.env.AIRNOW_API_KEY.
 * @returns {Promise<object|null>}
 */
async function getAqiContext(zip, apiKey) {
  if (!zip || !apiKey) return null;

  const controller = new AbortController();
  const timer = setTimeout(function () {
    controller.abort();
  }, TIMEOUT_MS);

  const url =
    AIRNOW_BASE +
    '?format=application/json' +
    '&zipCode=' + encodeURIComponent(zip) +
    '&distance=25' +
    '&API_KEY=' + encodeURIComponent(apiKey);

  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const pm25 = data.find(function (d) { return d.ParameterName === 'PM2.5'; });
    const ozone = data.find(function (d) { return d.ParameterName === 'O3'; });
    const primary = pm25 || data[0];

    return {
      aqi: primary.AQI,
      category: primary.Category && primary.Category.Name,
      isHealthConcern: primary.AQI >= 101,
      pm25Aqi: pm25 ? pm25.AQI : null,
      ozoneAqi: ozone ? ozone.AQI : null,
    };
  } catch (err) {
    clearTimeout(timer);
    return { error: 'aqi-unavailable', reason: err.message };
  }
}

module.exports = { getAqiContext };
