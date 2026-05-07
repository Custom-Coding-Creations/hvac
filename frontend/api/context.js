'use strict';

/**
 * GET /api/context/service-area?zip=&city=
 *
 * Public context endpoint — lets the frontend or any tool pre-check whether
 * a location is in-service and fetch weather/AQI context for that area.
 * No authentication required; inputs are sanitised and the response is safe
 * to expose to the browser.
 */

const { checkServiceArea } = require('../lib/tools/serviceArea');
const { getWeatherContext } = require('../lib/tools/weather');
const { getAqiContext } = require('../lib/tools/aqi');
const { sanitizeString } = require('../lib/validate');

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const zip = sanitizeString(String(req.query.zip || ''), 10);
  const city = sanitizeString(String(req.query.city || ''), 100);

  const serviceArea = checkServiceArea(zip, city);

  const lat = parseFloat(process.env.BUSINESS_LAT || '');
  const lon = parseFloat(process.env.BUSINESS_LNG || '');

  const [weather, aqi] = await Promise.all([
    !isNaN(lat) && !isNaN(lon)
      ? getWeatherContext(lat, lon)
      : Promise.resolve(null),
    zip && process.env.AIRNOW_API_KEY
      ? getAqiContext(zip, process.env.AIRNOW_API_KEY)
      : Promise.resolve(null),
  ]);

  res.status(200).json({
    serviceArea,
    weather,
    aqi,
    timestamp: new Date().toISOString(),
  });
};
