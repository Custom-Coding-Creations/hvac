'use strict';

const store = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_PER_WINDOW = 30;

// Periodic cleanup to prevent unbounded memory growth.
setInterval(function () {
  const cutoff = Date.now() - WINDOW_MS;
  store.forEach(function (entry, key) {
    if (entry.windowStart < cutoff) {
      store.delete(key);
    }
  });
}, WINDOW_MS).unref();

module.exports = function rateLimit(req, res, next) {
  const forwarded = req.headers && req.headers['x-forwarded-for'];
  const ip =
    (forwarded && forwarded.split(',')[0].trim()) ||
    (req.socket && req.socket.remoteAddress) ||
    'unknown';

  const now = Date.now();
  const entry = store.get(ip) || { count: 0, windowStart: now };

  if (now - entry.windowStart > WINDOW_MS) {
    entry.count = 0;
    entry.windowStart = now;
  }

  entry.count += 1;
  store.set(ip, entry);

  if (entry.count > MAX_PER_WINDOW) {
    res.status(429).json({ error: 'Too many requests. Please wait before trying again.' });
    return;
  }

  next();
};
