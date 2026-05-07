'use strict';

const { checkLimit } = require('../lib/rateLimit');
const { decide } = require('../lib/policy');
const { checkServiceArea } = require('../lib/tools/serviceArea');
const { sanitizeString } = require('../lib/validate');

function pickReply(message, template) {
  const lower = String(message || '').toLowerCase();

  if (/gas|leak|flood|smoke|emergency|urgent|no heat|no cooling/.test(lower)) {
    const policyDecision = decide({ issueType: lower, urgency: 'urgent', confidence: 1.0 });
    return {
      reply:
        'This sounds urgent. Please call dispatch now at (315) 472-3557. I can still prefill the request form so your details are captured immediately.',
      suggestedPrompt: template === 'homepage' ? 'No cooling right now' : 'No heat',
      policyDecision,
    };
  }

  if (/finance|financing|price|quote|estimate|replace/.test(lower)) {
    const policyDecision = decide({ issueType: 'estimate', urgency: 'standard', confidence: 0.95 });
    return {
      reply:
        'I can help with estimates and financing options. Share your ZIP and what system you have, and I will guide the fastest next step.',
      suggestedPrompt: template === 'homepage' ? 'I want financing options' : 'Replacement estimate',
      policyDecision,
    };
  }

  if (/maint|tune|service plan|seasonal/.test(lower)) {
    const policyDecision = decide({ issueType: 'maintenance', urgency: 'standard', confidence: 0.98 });
    return {
      reply:
        'Great choice. Preventive maintenance is usually a standard-priority visit. If you share your ZIP, I can confirm service-area coverage too.',
      suggestedPrompt: 'Routine maintenance',
      policyDecision,
    };
  }

  const policyDecision = decide({ issueType: 'general', urgency: 'standard', confidence: 0.8 });
  return {
    reply:
      'I can triage issues, check service-area fit, and prep your request form. Tell me whether this is heating, cooling, plumbing, or an emergency.',
    suggestedPrompt: template === 'homepage' ? 'Heating issue' : 'Routine maintenance',
    policyDecision,
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const forwarded = req.headers && req.headers['x-forwarded-for'];
  const ip = (forwarded && forwarded.split(',')[0].trim()) || req.socket?.remoteAddress || 'unknown';
  const rateLimitCheck = checkLimit(ip);

  if (!rateLimitCheck.allowed) {
    res.status(429).json({
      error: 'Too many requests',
      resetAfter: rateLimitCheck.resetAfter,
    });
    return;
  }

  const body = req.body || {};
  const message = sanitizeString(String(body.message || ''), 500);
  const template = sanitizeString(String(body.template || 'homepage'), 32) || 'homepage';
  const zip = sanitizeString(String((body.context && body.context.zip) || ''), 10);
  const city = sanitizeString(String((body.context && body.context.city) || ''), 100);

  if (!message) {
    res.status(400).json({ error: 'message is required' });
    return;
  }

  const base = pickReply(message, template);
  const serviceArea = checkServiceArea(zip, city);

  res.status(200).json({
    reply: base.reply,
    suggestedPrompt: base.suggestedPrompt,
    policyDecision: base.policyDecision,
    serviceArea,
    timestamp: new Date().toISOString(),
  });
};
