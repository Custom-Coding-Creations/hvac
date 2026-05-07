'use strict';

const { checkLimit } = require('../lib/rateLimit');
const { decide } = require('../lib/policy');
const { checkServiceArea } = require('../lib/tools/serviceArea');
const { getBusinessKnowledge, HVAC_PLUMBING_KB, findMatchingKnowledge, buildKnowledgeResponse, POTTER_PERRONE_FACTS } = require('../lib/tools/businessKnowledge');
const { sanitizeString } = require('../lib/validate');

function tokenize(message) {
  return String(message || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(function (token) {
      return token && token.length > 2;
    });
}

async function generateModelReply(message, template, serviceArea, knowledge) {
  const apiKey = String(process.env.OPENAI_API_KEY || '').trim();
  if (!apiKey) {
    return null;
  }

  const endpoint = String(process.env.OPENAI_API_BASE || 'https://api.openai.com/v1/chat/completions').trim();
  const model = String(process.env.OPENAI_MODEL || 'gpt-4o-mini').trim();

  const phone = (knowledge && knowledge.facts && knowledge.facts.phones && knowledge.facts.phones[0]) || '(315) 472-3557';
  const knowledgeText = String((knowledge && knowledge.text) || '').slice(0, 9000);

  const controller = new AbortController();
  const timer = setTimeout(function () {
    controller.abort();
  }, 7000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 320,
        messages: [
          {
            role: 'system',
            content:
              'You are a high-conversion HVAC/plumbing assistant for Potter-Perrone. Use only known business facts from the provided knowledge context. If data is missing, say so clearly and suggest calling dispatch at ' +
              phone +
              '. Always prioritize safety and urgent escalation for emergency symptoms. Keep responses concise and actionable.',
          },
          {
            role: 'user',
            content:
              'Customer message: ' +
              String(message || '') +
              '\nTemplate: ' +
              template +
              '\nService area check: ' +
              JSON.stringify(serviceArea || {}) +
              '\nLive business knowledge:\n' +
              knowledgeText,
          },
        ],
      }),
    });

    if (!response || !response.ok) {
      return null;
    }

    const payload = await response.json();
    const text =
      payload &&
      payload.choices &&
      payload.choices[0] &&
      payload.choices[0].message &&
      payload.choices[0].message.content;

    const cleaned = sanitizeString(String(text || ''), 2400);
    return cleaned || null;
  } catch (_) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function pickReply(message, template, knowledge, serviceArea) {
  const lower = String(message || '').toLowerCase();
  const facts = (knowledge && knowledge.facts) || POTTER_PERRONE_FACTS;
  const primaryPhone = (facts.phones && facts.phones[0]) || '(315) 472-3557';

  // First try to find matching knowledge from the HVAC/plumbing KB
  const matches = findMatchingKnowledge(message);
  
  if (matches && matches.length > 0) {
    const bestMatch = matches[0];
    const entry = bestMatch.entry;
    
    // For critical issues, prioritize emergency dispatch
    if (entry.urgency === 'critical' || entry.urgency === 'urgent') {
      const policyDecision = decide({ 
        issueType: bestMatch.key, 
        urgency: entry.urgency, 
        confidence: Math.min(1.0, bestMatch.matchCount / 3)
      });
      
      const initialSteps = entry.initialSteps && entry.initialSteps.length 
        ? '\n\nImmediate steps:\n' + entry.initialSteps.slice(0, 3).map(function(s) { return '• ' + s; }).join('\n')
        : '';
      
      return {
        reply: entry.whenToCallDispatch + '. ' + entry.businessTip + initialSteps,
        suggestedPrompt: entry.category === 'heating' ? 'No heat' : 
                        entry.category === 'cooling' ? 'No cooling' : 
                        'Emergency dispatch',
        policyDecision,
        confidence: bestMatch.matchCount / 3,
        category: entry.category
      };
    }
    
    // For standard issues, provide diagnostic help
    const policyDecision = decide({ 
      issueType: bestMatch.key, 
      urgency: entry.urgency, 
      confidence: Math.min(1.0, bestMatch.matchCount / 3)
    });
    
    const response = 'I see you\'re dealing with ' + entry.symptoms.toLowerCase() + '. ';
    const diagnosticPart = entry.diagnosticQuestions && entry.diagnosticQuestions.length
      ? 'To better understand your situation, can you tell me: ' + entry.diagnosticQuestions[0] + '\n\n'
      : '';
    const stepsText = entry.initialSteps && entry.initialSteps.length
      ? 'In the meantime, you can try: ' + entry.initialSteps[0] + '\n\n'
      : '';
    const businessPart = entry.businessTip ? entry.businessTip + '\n\n' : '';
    const closePart = 'When you\'re ready, call ' + primaryPhone + ' or submit a service request.';
    
    return {
      reply: response + diagnosticPart + stepsText + businessPart + closePart,
      suggestedPrompt: entry.relatedServices && entry.relatedServices[0] 
        ? entry.relatedServices[0] 
        : 'Service request',
      policyDecision,
      confidence: bestMatch.matchCount / 3,
      category: entry.category
    };
  }

  // Fallback for non-HVAC/plumbing questions
  if (/hour|open|close|weekend|today/.test(lower)) {
    const policyDecision = decide({ issueType: 'hours', urgency: 'standard', confidence: 0.93 });
    const hours = 'Mon-Fri 7am-5pm, emergency dispatch 24/7';
    
    return {
      reply: 'Our regular hours are ' + hours + '. For emergency service anytime, call ' + primaryPhone + '.',
      suggestedPrompt: 'Need same-day availability',
      policyDecision,
      confidence: 0.9
    };
  }

  if (/phone|call|number|contact/.test(lower)) {
    const policyDecision = decide({ issueType: 'contact', urgency: 'standard', confidence: 0.98 });
    return {
      reply: 'You can reach Potter-Perrone at ' + primaryPhone + ' or submit a service request online. For emergencies, call immediately.',
      suggestedPrompt: 'Emergency dispatch',
      policyDecision,
      confidence: 0.98
    };
  }

  if (/zip|service area|city|coverage|serve|location/.test(lower)) {
    const policyDecision = decide({ issueType: 'service-area', urgency: 'standard', confidence: 0.96 });
    if (serviceArea && serviceArea.eligible === true) {
      return {
        reply: 'Great news! Your location appears to be in our service area. Call ' + primaryPhone + ' or submit the request form now for quick dispatch.',
        suggestedPrompt: 'Schedule service',
        policyDecision,
        confidence: 0.96
      };
    }

    if (serviceArea && serviceArea.eligible === false) {
      return {
        reply: 'Your location may be outside our normal service area. Call ' + primaryPhone + ' to confirm - we may still be able to help or refer you to a partner.',
        suggestedPrompt: 'Check coverage',
        policyDecision,
        confidence: 0.96
      };
    }

    return {
      reply: 'I can check service-area fit for you! What\'s your ZIP code?',
      suggestedPrompt: 'Check my area',
      policyDecision,
      confidence: 0.85
    };
  }

  if (/about|company|history|who|experience/.test(lower)) {
    const policyDecision = decide({ issueType: 'company-info', urgency: 'standard', confidence: 0.92 });
    return {
      reply: 'Potter-Perrone has been serving the Syracuse area since 1944 - that\'s over 80 years of trusted HVAC and plumbing service. We handle everything from emergency repairs to new installations with financing options available.',
      suggestedPrompt: 'Our services',
      policyDecision,
      confidence: 0.92
    };
  }

  // Default helpful response
  const policyDecision = decide({ issueType: 'general', urgency: 'standard', confidence: 0.7 });
  return {
    reply: 'I\'m here to help with heating, cooling, plumbing, or emergency issues. Tell me what\'s happening and I\'ll guide your next best step. Or call ' + primaryPhone + ' to speak with a dispatcher.',
    suggestedPrompt: 'Tell me about your issue',
    policyDecision,
    confidence: 0.7
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

  const serviceArea = checkServiceArea(zip, city);
  const knowledge = await getBusinessKnowledge(req);
  const base = pickReply(message, template, knowledge, serviceArea);
  const modelReply = await generateModelReply(message, template, serviceArea, knowledge);
  const finalReply = modelReply || base.reply;

  res.status(200).json({
    reply: finalReply,
    suggestedPrompt: base.suggestedPrompt,
    policyDecision: base.policyDecision,
    serviceArea,
    knowledge: {
      updatedAt: knowledge && knowledge.generatedAt,
      sources: (knowledge && knowledge.sourceUrls) || [],
      sourceCount: (knowledge && knowledge.pages && knowledge.pages.length) || 0,
    },
    timestamp: new Date().toISOString(),
  });
};
