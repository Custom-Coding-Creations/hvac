'use strict';

/**
 * GET /ai/context/service-area?zip=&city=
 *
 * Public context endpoint — lets the frontend or any tool pre-check whether
 * a location is in-service and fetch weather/AQI context for that area.
 * No authentication required; inputs are sanitised and the response is safe
 * to expose to the browser.
 */

const { checkServiceArea } = require('../tools/serviceArea');
const { getWeatherContext } = require('../tools/weather');
const { getAqiContext } = require('../tools/aqi');
const { sanitizeString } = require('../validate');

module.exports = async function contextRoute(req, res) {
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

  res.json({
    serviceArea,
    weather,
    aqi,
    timestamp: new Date().toISOString(),
  });
};
