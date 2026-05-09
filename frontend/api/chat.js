'use strict';

const { randomUUID } = require('crypto');
const { checkLimit } = require('../lib/rateLimit');
const { decide } = require('../lib/policy');
const { checkServiceArea } = require('../lib/tools/serviceArea');
const { getBusinessKnowledge, findMatchingKnowledge, POTTER_PERRONE_FACTS } = require('../lib/tools/businessKnowledge');
const { sanitizeString } = require('../lib/validate');

const MAX_HISTORY_TURNS = Math.max(1, parseInt(process.env.OPENAI_HISTORY_MAX_TURNS || '8', 10));
const MODEL_TIMEOUT_MS = Math.max(1500, parseInt(process.env.OPENAI_TIMEOUT_MS || '7000', 10));
const MAX_MODEL_TOKENS = Math.max(100, parseInt(process.env.OPENAI_MAX_TOKENS || '320', 10));

function normalizeIssue(raw) {
  return String(raw || '')
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function sanitizeHistory(rawHistory) {
  const history = Array.isArray(rawHistory) ? rawHistory : [];
  return history
    .slice(-MAX_HISTORY_TURNS)
    .map(function (turn) {
      const role = String((turn && turn.role) || 'user').toLowerCase() === 'assistant' ? 'assistant' : 'user';
      const content = sanitizeString(String((turn && turn.content) || ''), 500);
      return { role: role, content: content };
    })
    .filter(function (turn) {
      return !!turn.content;
    });
}

function extractEntities(message, history, context) {
  const latest = String(message || '');
  const corpus = (history || [])
    .map(function (turn) {
      return String(turn.content || '');
    })
    .concat([latest])
    .join(' ')
    .slice(-4000);

  const lower = corpus.toLowerCase();
  const zipMatch = corpus.match(/\b(\d{5})(?:-\d{4})?\b/);
  const phoneMatch = corpus.match(/(?:\+?1[\s.-]?)?\(?([2-9]\d{2})\)?[\s.-]?([2-9]\d{2})[\s.-]?(\d{4})\b/);
  const nameMatch = corpus.match(/\b(?:my name is|i am|this is)\s+([a-z]+(?:\s+[a-z]+){0,2})\b/i);
  const cityMatch = corpus.match(/\b(?:in|near|around|from)\s+([a-z]+(?:\s+[a-z]+){0,2})\b/i);

  const matchedKnowledge = findMatchingKnowledge(corpus);
  const topMatch = matchedKnowledge && matchedKnowledge[0];
  const topIssue = topMatch ? topMatch.key : '';

  const safetySignals = {
    gas: /\bgas smell|smell gas|gas leak|rotten egg|sulfur smell\b/.test(lower),
    leak: /\bactive leak|water leak|flood|burst pipe\b/.test(lower),
    noHeat: /\bno heat|not heating|furnace down\b/.test(lower),
    noCooling: /\bno cooling|ac not working|air conditioner broken\b/.test(lower),
    emergencyWord: /\bemergency|urgent|asap|immediately|right now\b/.test(lower),
  };

  const isEmergency =
    safetySignals.gas ||
    safetySignals.leak ||
    safetySignals.noHeat ||
    safetySignals.noCooling ||
    safetySignals.emergencyWord;

  let inferredIssue = topIssue;
  if (!inferredIssue) {
    if (safetySignals.gas) inferredIssue = 'gas-odor';
    else if (safetySignals.leak) inferredIssue = 'active-leak';
    else if (safetySignals.noHeat) inferredIssue = 'no-heat';
    else if (safetySignals.noCooling) inferredIssue = 'no-cooling';
    else if (/\bfinanc|quote|estimate|price|cost\b/.test(lower)) inferredIssue = 'estimate';
    else if (/\bmainten|tune up|inspection\b/.test(lower)) inferredIssue = 'maintenance';
  }

  const wantsHuman = /\bhuman|person|agent|representative|someone\b/.test(lower);
  const wantsCallback = /\bcall me|callback|call back|book|schedule|appointment\b/.test(lower);
  const financingIntent = /\bfinanc|payment plan|monthly\b/.test(lower);

  return {
    inferredIssue: normalizeIssue(inferredIssue),
    confidence: topMatch ? Math.min(1, topMatch.matchCount / 3) : 0.65,
    urgency: isEmergency ? 'urgent' : 'standard',
    zip: sanitizeString(String((context && context.zip) || (zipMatch && zipMatch[1]) || ''), 10),
    city: sanitizeString(String((context && context.city) || (cityMatch && cityMatch[1]) || ''), 100),
    phone: phoneMatch ? phoneMatch.slice(1, 4).join('') : '',
    name: sanitizeString(String((nameMatch && nameMatch[1]) || ''), 100),
    wantsHuman: wantsHuman,
    wantsCallback: wantsCallback,
    financingIntent: financingIntent,
    isEmergency: isEmergency,
    safetySignals: safetySignals,
  };
}

function issueToPromptLabel(issue) {
  const normalized = normalizeIssue(issue);
  if (normalized === 'no-heat') return 'No heat';
  if (normalized === 'no-cooling') return 'No cooling';
  if (normalized === 'maintenance') return 'Routine maintenance';
  if (normalized === 'estimate') return 'Replacement estimate';
  if (normalized === 'gas-odor' || normalized === 'active-leak') return 'Emergency dispatch';
  return '';
}

function buildActionHints(extracted, policyDecision, serviceArea) {
  const prefillFields = {};
  if (extracted.zip) prefillFields.zip = extracted.zip;
  if (extracted.city) prefillFields.neighborhood = extracted.city;
  if (extracted.phone) prefillFields.phone = extracted.phone;
  if (extracted.name) prefillFields.name = extracted.name;

  const shouldHandoff =
    extracted.isEmergency ||
    extracted.wantsHuman ||
    (policyDecision && policyDecision.mode === 'handoff');

  const shouldCreateLead =
    extracted.wantsCallback ||
    (extracted.financingIntent && !!(extracted.zip || extracted.city)) ||
    (!!extracted.name && !!extracted.phone);

  return {
    prefillPromptLabel: issueToPromptLabel(extracted.inferredIssue),
    prefillFields: prefillFields,
    shouldCreateLead: shouldCreateLead,
    shouldHandoff: shouldHandoff,
    handoffReason: shouldHandoff ? (extracted.isEmergency ? 'emergency-symptoms' : 'human-requested') : '',
    recommendedAction: (policyDecision && policyDecision.recommendedAction) || 'form',
    serviceAreaEligible: serviceArea ? serviceArea.eligible : null,
  };
}

function buildEmergencyReply(phone, extracted) {
  if (extracted.safetySignals.gas) {
    return (
      'This sounds like a gas emergency. Leave the building now, avoid switches or flames, and call your gas utility from outside. ' +
      'After utility clearance, call Potter-Perrone dispatch at ' + phone + ' for immediate HVAC follow-up.'
    );
  }

  if (extracted.safetySignals.leak) {
    return (
      'This sounds urgent. If safe, shut off the water source to limit damage, then call Potter-Perrone dispatch now at ' +
      phone +
      ' for emergency plumbing support.'
    );
  }

  return (
    'This sounds urgent. Please call Potter-Perrone dispatch now at ' +
    phone +
    '. I can keep gathering details while you prepare for immediate service.'
  );
}

async function generateModelReply(message, template, serviceArea, knowledge, history, policyDecision, extracted) {
  const apiKey = String(
    process.env.OPENAI_API_KEY ||
      process.env.AI_PROVIDER_KEY ||
      process.env.AI_API_KEY ||
      ''
  ).trim();
  if (!apiKey) {
    return null;
  }

  const endpoint = String(
    process.env.OPENAI_API_BASE ||
      process.env.AI_PROVIDER_URL ||
      'https://api.openai.com/v1/chat/completions'
  ).trim();
  const model = String(process.env.OPENAI_MODEL || process.env.AI_PROVIDER_MODEL || 'gpt-4o-mini').trim();

  const phone = (knowledge && knowledge.facts && knowledge.facts.phones && knowledge.facts.phones[0]) || '(315) 472-3557';
  const knowledgeText = String((knowledge && knowledge.text) || '').slice(0, 9000);

  const controller = new AbortController();
  const timer = setTimeout(function () {
    controller.abort();
  }, MODEL_TIMEOUT_MS);

  const historyMessages = sanitizeHistory(history).map(function (turn) {
    return { role: turn.role, content: turn.content };
  });

  try {
    const systemPrompt = 'You are an intelligent HVAC and plumbing customer service assistant for Potter-Perrone. ' +
      'Your primary goal is to understand customer needs and provide helpful, practical guidance tailored to their specific situation. ' +
      'You exercise independent judgment and reasoning to provide dynamic, personalized responses - NOT generic preset answers. ' +
      'Follow these principles:\n' +
      '1. SAFETY FIRST: If you detect gas odor, active leaks, severe temperature issues, or emergency keywords, prioritize immediate dispatch escalation to ' + phone + '\n' +
      '2. LISTENING: Acknowledge the customer\'s specific situation before providing guidance\n' +
      '3. DIAGNOSTIC HELP: Ask clarifying questions when needed to better understand the problem\n' +
      '4. PRACTICAL STEPS: Suggest safe, actionable steps the customer can try immediately\n' +
      '5. CONVERSION: Naturally guide toward scheduling service or connecting with a dispatcher\n' +
      '6. HONESTY: Only use business facts from provided context. Do not fabricate pricing, warranties, or availability.\n' +
      '\nBusiness context:\n' +
      'Potter-Perrone dispatch: ' + phone + '\n' +
      'Hours: Mon-Fri 7am-5pm, Emergency 24/7\n' +
      'Service area: Syracuse and surrounding Central New York areas\n\n' +
      'Business knowledge:\n' + knowledgeText;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 0.7,
        max_tokens: MAX_MODEL_TOKENS,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
        ]
          .concat(historyMessages)
          .concat([
          {
            role: 'user',
            content:
              'Customer message: ' +
              String(message || '') +
              '\n\nContext: Service template is ' + template + ', ' +
              'detected issue category is ' + extracted.inferredIssue + 
              ', urgency level is ' + extracted.urgency +
              ', service area eligible: ' + (serviceArea && serviceArea.eligible) +
              '\n\nProvide a helpful, natural response that directly addresses their situation. Be conversational and genuine.',
          },
        ]),
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

function pickReply(message, template, knowledge, serviceArea, extracted) {
  const lower = String(message || '').toLowerCase();
  const facts = (knowledge && knowledge.facts) || POTTER_PERRONE_FACTS;
  const primaryPhone = (facts.phones && facts.phones[0]) || '(315) 472-3557';

  if (extracted && extracted.isEmergency) {
    const policyDecision = decide({ issueType: extracted.inferredIssue || 'emergency', urgency: 'urgent', confidence: 1.0 });
    return {
      reply: buildEmergencyReply(primaryPhone, extracted),
      suggestedPrompt: issueToPromptLabel(extracted.inferredIssue) || 'Emergency dispatch',
      policyDecision: policyDecision,
      confidence: 0.99,
      category: 'emergency',
    };
  }

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
        ? '\n\nImmediate steps:\n' + entry.initialSteps.slice(0, 3).map(function(s) { return '- ' + s; }).join('\n')
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
  const sessionId = sanitizeString(String(body.sessionId || randomUUID()), 120) || randomUUID();
  const message = sanitizeString(String(body.message || ''), 500);
  const template = sanitizeString(String(body.template || 'homepage'), 32) || 'homepage';
  const context = (body.context && typeof body.context === 'object') ? body.context : {};
  const history = sanitizeHistory(body.history);

  if (!message) {
    res.status(400).json({ error: 'message is required' });
    return;
  }

  const extracted = extractEntities(message, history, context);
  const zip = sanitizeString(String(extracted.zip || ''), 10);
  const city = sanitizeString(String(extracted.city || ''), 100);

  const serviceArea = checkServiceArea(zip, city);
  const knowledge = await getBusinessKnowledge(req);
  const base = pickReply(message, template, knowledge, serviceArea, extracted);
  const policyDecision = base.policyDecision || decide({
    issueType: extracted.inferredIssue || 'general',
    urgency: extracted.urgency,
    confidence: extracted.confidence,
  });

  // Try AI model first for dynamic responses, fall back to preset only if model unavailable
  let modelReply = null;
  let responseMode = 'fallback';
  
  if (!extracted.isEmergency) {
    modelReply = await generateModelReply(message, template, serviceArea, knowledge, history, policyDecision, extracted);
    if (modelReply) {
      responseMode = 'model';
    }
  }
  
  const finalReply = modelReply || base.reply;
  const actionHints = buildActionHints(extracted, policyDecision, serviceArea);

  res.status(200).json({
    sessionId: sessionId,
    reply: finalReply,
    suggestedPrompt: base.suggestedPrompt,
    policyDecision: policyDecision,
    mode: responseMode,
    safety: {
      isEmergency: !!extracted.isEmergency,
      signals: extracted.safetySignals,
    },
    extracted: {
      issue: extracted.inferredIssue,
      urgency: extracted.urgency,
      zip: extracted.zip || null,
      city: extracted.city || null,
      confidence: extracted.confidence,
      wantsHuman: extracted.wantsHuman,
      wantsCallback: extracted.wantsCallback,
      financingIntent: extracted.financingIntent,
    },
    actions: actionHints,
    serviceArea,
    knowledge: {
      updatedAt: knowledge && knowledge.generatedAt,
      sources: (knowledge && knowledge.sourceUrls) || [],
      sourceCount: (knowledge && knowledge.pages && knowledge.pages.length) || 0,
    },
    timestamp: new Date().toISOString(),
  });
};
