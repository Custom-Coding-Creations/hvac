'use strict';

/**
 * National Weather Service (NWS) API tool.
 *
 * Free, no API key required — only a User-Agent header identifying the app.
 * Fetches active alerts and point metadata for a lat/lon.  Failures are
 * always non-fatal: the caller gets null or an error descriptor.
 */

const NWS_BASE = 'https://api.weather.gov';
const USER_AGENT = '(hvac-ai-orchestration, contact@potter-perrone.com)';
const TIMEOUT_MS = 4000;

function nwsFetch(url) {
  const controller = new AbortController();
  const timer = setTimeout(function () {
    controller.abort();
  }, TIMEOUT_MS);

  return fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'application/geo+json',
    },
    signal: controller.signal,
  })
    .then(function (res) {
      clearTimeout(timer);
      if (!res.ok) throw new Error('NWS returned HTTP ' + res.status);
      return res.json();
    })
    .catch(function (err) {
      clearTimeout(timer);
      throw err;
    });
}

/**
 * Get weather context for a lat/lon pair.
 *
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<object|null>}
 */
async function getWeatherContext(lat, lon) {
  if (lat == null || lon == null) return null;

  try {
    const [pointData, alertData] = await Promise.all([
      nwsFetch(NWS_BASE + '/points/' + lat + ',' + lon),
      nwsFetch(NWS_BASE + '/alerts/active?point=' + lat + ',' + lon),
    ]);

    const props = (pointData && pointData.properties) || {};
    const features = (alertData && alertData.features) || [];

    const activeAlerts = features.map(function (feature) {
      const p = feature.properties || {};
      return {
        event: p.event || '',
        severity: p.severity || '',
        headline: (p.headline || '').slice(0, 200),
        description: (p.description || '').slice(0, 300),
      };
    });

    const relLoc =
      props.relativeLocation &&
      props.relativeLocation.properties;

    return {
      city: relLoc ? relLoc.city : null,
      state: relLoc ? relLoc.state : null,
      forecastZone: props.forecastZone || null,
      hasActiveAlerts: activeAlerts.length > 0,
      alertCount: activeAlerts.length,
      alerts: activeAlerts.slice(0, 3),
    };
  } catch (err) {
    // Weather enrichment is best-effort; a failure must not block lead delivery.
    return { error: 'weather-unavailable', reason: err.message };
  }
}

module.exports = { getWeatherContext };
