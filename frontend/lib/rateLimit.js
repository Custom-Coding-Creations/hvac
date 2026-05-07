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

/**
 * In-memory rate limiter.  Returns { allowed: true } or { allowed: false, resetAfter: ms }.
 */
function checkLimit(ip) {
  const now = Date.now();
  const entry = store.get(ip) || { count: 0, windowStart: now };

  if (now - entry.windowStart > WINDOW_MS) {
    entry.count = 0;
    entry.windowStart = now;
  }

  entry.count += 1;
  store.set(ip, entry);

  if (entry.count > MAX_PER_WINDOW) {
    return { allowed: false, resetAfter: Math.ceil((entry.windowStart + WINDOW_MS - now) / 1000) };
  }

  return { allowed: true };
}

module.exports = { checkLimit };
