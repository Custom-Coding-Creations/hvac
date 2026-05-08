'use strict';

/**
 * Business knowledge module - provides facts about Potter-Perrone HVAC & Plumbing
 * and comprehensive HVAC/plumbing domain knowledge.
 */

const POTTER_PERRONE_FACTS = {
  businessName: 'Potter-Perrone',
  yearsInBusiness: 1944,
  yearFounded: 1944,
  location: 'Syracuse, NY',
  region: 'Central New York',
  phone: '(315) 472-3557',
  phones: ['(315) 472-3557'],
  email: 'contact@potterperrone.com',
  website: 'www.potterperrone.com',
  services: [
    'Heating system repair and replacement',
    'Cooling system repair and replacement',
    'Plumbing repair and maintenance',
    'Emergency 24/7 dispatch',
    'Preventive maintenance plans',
    'Financing options available',
    'Commercial and residential service',
  ],
  serviceArea: {
    primary: 'Syracuse and surrounding areas',
    counties: 'Onondaga County',
    coverage: 'Central New York (call for details)',
  },
  operatingHours: {
    monday: '7:00 AM - 5:00 PM',
    tuesday: '7:00 AM - 5:00 PM',
    wednesday: '7:00 AM - 5:00 PM',
    thursday: '7:00 AM - 5:00 PM',
    friday: '7:00 AM - 5:00 PM',
    saturday: 'Emergency dispatch only',
    sunday: 'Emergency dispatch only',
    emergency: '24/7 emergency dispatch available',
  },
  financing: true,
  acceptedPayments: ['Cash', 'Check', 'Credit Card', 'Financing'],
  guarantees: [
    'Professional, licensed technicians',
    'Satisfaction guaranteed',
    'Transparent pricing',
    'Emergency response available',
  ],
  experience: 'Over 80 years of trusted service',
  tagline: 'Your comfort is our priority',
};

const HVAC_PLUMBING_KB = {
  'no-heat': {
    category: 'heating',
    patterns: [
      'no heat', 'not heating', 'furnace down', 'heating broke',
      'cold house', 'thermostat not working', 'pilot light',
      'won\'t turn on', 'boiler down', 'heat won\'t turn on',
      'furnace not working', 'furnace stopped', 'heating system down',
      'weak heat', 'heat is weak', 'not enough heat', 'furnace issue',
      'short-cycling heat', 'heating intermittent', 'blower not working'
    ],
    urgency: 'urgent',
    symptoms: 'No heat or heating system not responding',
    diagnosticQuestions: [
      'When did you notice the heat stopped working?',
      'Is the thermostat showing the current temperature?',
      'Do you hear any sounds from the furnace (clicking, humming)?',
      'Have you checked if the breaker is on?'
    ],
    initialSteps: [
      'Check that thermostat is set to HEAT and temperature is above current temp',
      'Verify circuit breaker for furnace is in ON position',
      'Look for a reset button on the furnace (red or black button)',
      'Check that gas valve is turned on (if applicable)'
    ],
    whenToCallDispatch: 'Immediately if you have no heat - this is urgent',
    businessTip: 'Potter-Perrone offers emergency dispatch 24/7. We can have a technician respond quickly.',
    relatedServices: ['Furnace repair', 'Furnace replacement', 'Thermostat programming']
  },
  'no-cooling': {
    category: 'cooling',
    patterns: [
      'no cooling', 'ac not working', 'air conditioner broken', 'ac down',
      'not cooling', 'thermostat cooling not working', 'compressor off',
      'no air conditioning', 'room too hot', 'ac won\'t cool',
      'weak cooling', 'cooling not working', 'ac stopped',
      'air conditioner not working', 'short-cycling cooling',
      'ac is warm', 'air is warm', 'ac blowing warm',
      'unit running but not cooling', 'ac issue', 'cooling system down'
    ],
    urgency: 'urgent',
    symptoms: 'Air conditioning system not cooling',
    diagnosticQuestions: [
      'When did the cooling stop working?',
      'Is the thermostat set to COOL mode?',
      'Do you hear the outdoor unit running?',
      'Are there any strange noises or smells?'
    ],
    initialSteps: [
      'Set thermostat to COOL mode and set temperature below current temp',
      'Check outdoor unit to see if condenser fan is running',
      'Look for tripped circuit breaker',
      'Check air filter - a clogged filter can reduce cooling'
    ],
    whenToCallDispatch: 'Same-day service recommended - especially during hot weather',
    businessTip: 'Potter-Perrone can diagnose AC issues quickly and provide same-day repair or replacement.',
    relatedServices: ['AC repair', 'AC replacement', 'Refrigerant recharge', 'Compressor replacement']
  },
  'water-leak': {
    category: 'plumbing',
    patterns: [
      'water leak', 'leak', 'dripping', 'water dripping', 'puddle',
      'wet floor', 'active leak', 'under sink', 'basement wet'
    ],
    urgency: 'urgent',
    symptoms: 'Water leaking inside the home',
    diagnosticQuestions: [
      'Where exactly is the leak coming from?',
      'How much water is leaking (slow drip or steady stream)?',
      'Do you see water on the floor or just feel dampness?',
      'Have you noticed any water stains on ceiling or walls?'
    ],
    initialSteps: [
      'Locate and turn off the water main if possible',
      'Use towels or buckets to contain water and prevent damage',
      'Photo-document the leak for the technician',
      'If leak is from fitting under sink, try tightening the nut (if accessible)'
    ],
    whenToCallDispatch: 'Immediately - water damage gets worse the longer it continues',
    businessTip: 'Potter-Perrone provides emergency plumbing response. We can stop leaks fast and minimize water damage.',
    relatedServices: ['Pipe repair', 'Fixture replacement', 'Water damage assessment', 'Mold prevention']
  },
  'gas-smell': {
    category: 'plumbing/safety',
    patterns: [
      'gas smell', 'smell gas', 'rotten egg smell', 'sulfur smell',
      'gas leak', 'smell like gas', 'odor'
    ],
    urgency: 'critical',
    symptoms: 'Gas odor detected in home',
    diagnosticQuestions: [],
    initialSteps: [
      '🚨 DO NOT USE ELECTRICITY OR OPEN FLAMES',
      'Evacuate the building immediately',
      'Call your gas utility from outside the home (not from inside)',
      'Wait for utility company to inspect before re-entering'
    ],
    whenToCallDispatch: 'Call gas utility first, then contact us after utility clears the system',
    businessTip: 'After gas utility clears your home, Potter-Perrone can inspect your heating system.',
    relatedServices: ['Gas line inspection', 'Furnace safety check']
  },
  'pipe-freeze': {
    category: 'plumbing',
    patterns: [
      'frozen pipe', 'pipe freeze', 'no water', 'water off',
      'winter', 'cold', 'burst pipe', 'water pressure low'
    ],
    urgency: 'urgent',
    symptoms: 'Pipes frozen or no water pressure during cold weather',
    diagnosticQuestions: [
      'Are there areas of your home that are especially cold?',
      'Is the no-water issue throughout the house or just one area?',
      'Can you see or access the affected pipes?'
    ],
    initialSteps: [
      'Apply heat to frozen pipe area using heat lamp or hot towels (NOT direct flame)',
      'Open faucets near frozen section to relieve pressure',
      'Insulate exposed pipes to prevent future freeze',
      'Keep cabinet doors open under sinks to allow warm air circulation'
    ],
    whenToCallDispatch: 'Call us if pipes burst or DIY thawing doesn\'t restore water',
    businessTip: 'Potter-Perrone offers pipe insulation and winterization services to prevent freezes.',
    relatedServices: ['Pipe thawing', 'Burst pipe repair', 'Winterization', 'Insulation']
  },
  'drain-backup': {
    category: 'plumbing',
    patterns: [
      'drain backup', 'clogged drain', 'backed up', 'slow drain',
      'water won\'t drain', 'backed up toilet', 'drain slow',
      'clog', 'basement backup'
    ],
    urgency: 'standard',
    symptoms: 'Drain is slow, clogged, or water is backing up',
    diagnosticQuestions: [
      'Is it one drain or multiple drains affected?',
      'When did you first notice the backup?',
      'Have you tried plunging or using drain cleaner?',
      'Any recent renovations or tree work done?'
    ],
    initialSteps: [
      'Try plunging the affected drain firmly (10-15 times)',
      'Use a plumbing snake to remove accessible clogs',
      'Do NOT use chemical drain cleaners followed by professional service',
      'Check for signs of tree roots (multiple drains affected, slow drainage)'
    ],
    whenToCallDispatch: 'If plunging doesn\'t clear it or multiple drains are backed up',
    businessTip: 'We use video inspection to locate clogs and provide targeted solutions.',
    relatedServices: ['Drain cleaning', 'Clog removal', 'Sewer inspection', 'Drain camera service']
  },
  'thermostat-issue': {
    category: 'heating/cooling',
    patterns: [
      'thermostat', 'temp', 'temperature', 'won\'t change',
      'doesn\'t respond', 'reading wrong'
    ],
    urgency: 'standard',
    symptoms: 'Thermostat not responding or showing incorrect temperature',
    diagnosticQuestions: [
      'Is the display blank or does it show numbers?',
      'When you adjust it, does the system respond?',
      'Are the batteries (if applicable) new?'
    ],
    initialSteps: [
      'Replace batteries if thermostat is wireless',
      'Check that breaker for thermostat circuit is ON',
      'Clean dust from thermostat sensor with a soft brush',
      'Verify thermostat is not in an unusual mode (vacation, hold, etc.)'
    ],
    whenToCallDispatch: 'If replacement batteries don\'t fix it',
    businessTip: 'Upgrading to a smart thermostat can improve comfort and save energy.',
    relatedServices: ['Thermostat repair', 'Thermostat replacement', 'Smart thermostat installation']
  },
  'maintenance': {
    category: 'maintenance',
    patterns: [
      'maintenance', 'service plan', 'preventive', 'tune up',
      'seasonal', 'inspection', 'checkup'
    ],
    urgency: 'standard',
    symptoms: 'Want to maintain heating/cooling system',
    diagnosticQuestions: [
      'When was your system last serviced?',
      'What type of heating system do you have (furnace, heat pump, boiler)?'
    ],
    initialSteps: [
      'Schedule a maintenance visit before heating or cooling season',
      'Have furnace filter replaced annually',
      'Have AC refrigerant levels checked annually'
    ],
    whenToCallDispatch: 'For professional maintenance visit',
    businessTip: 'Regular maintenance extends system life 5-10 years and improves efficiency.',
    relatedServices: ['Furnace maintenance', 'AC maintenance', 'Service plans', 'Filter replacement']
  },
  'estimate': {
    category: 'sales',
    patterns: [
      'estimate', 'quote', 'price', 'cost', 'how much',
      'replacement', 'install', 'finance'
    ],
    urgency: 'standard',
    symptoms: 'Seeking estimate for repair, replacement, or new installation',
    diagnosticQuestions: [
      'What type of system (furnace, AC, water heater)?',
      'How old is your current system?',
      'Is this for repair, replacement, or new installation?'
    ],
    initialSteps: [],
    whenToCallDispatch: 'Contact us to schedule an in-home estimate',
    businessTip: 'Potter-Perrone offers free estimates and flexible financing options.',
    relatedServices: ['System replacement', 'New installation', 'Financing']
  }
};

/**
 * Find the best knowledge base entry for a user message
 * Returns an array of matching entries sorted by relevance
 */
function findMatchingKnowledge(userMessage) {
  const lower = String(userMessage || '').toLowerCase();
  const matches = [];

  Object.entries(HVAC_PLUMBING_KB).forEach(function ([key, entry]) {
    const matchedPatterns = entry.patterns.filter(function (pattern) {
      return lower.includes(pattern);
    });

    if (matchedPatterns.length > 0) {
      matches.push({
        key,
        entry,
        matchCount: matchedPatterns.length,
        matchedPatterns
      });
    }
  });

  // Sort by number of pattern matches (most specific first)
  return matches.sort(function (a, b) {
    return b.matchCount - a.matchCount;
  });
}

/**
 * Build a response based on matched knowledge
 */
function buildKnowledgeResponse(matches) {
  if (!matches || matches.length === 0) {
    return null;
  }

  const best = matches[0];
  const entry = best.entry;

  return {
    category: entry.category,
    urgency: entry.urgency,
    symptoms: entry.symptoms,
    diagnosticQuestions: entry.diagnosticQuestions,
    initialSteps: entry.initialSteps,
    whenToCallDispatch: entry.whenToCallDispatch,
    businessTip: entry.businessTip,
    relatedServices: entry.relatedServices,
    confidence: Math.min(1.0, best.matchCount / 3) // Normalize confidence
  };
}

/**
 * Get business knowledge for the chat endpoint
 * This is called by the Vercel serverless function
 */
async function getBusinessKnowledge(req) {
  return {
    facts: POTTER_PERRONE_FACTS,
    text: formatBusinessText(),
    generatedAt: new Date().toISOString(),
    sourceUrls: [],
    pages: [],
  };
}

function formatBusinessText() {
  const lines = [
    'Potter-Perrone is a full-service HVAC and plumbing company based in Syracuse, NY.',
    'We have been serving the Central New York region since ' + POTTER_PERRONE_FACTS.yearFounded + '.',
    'We offer 24/7 emergency dispatch service for urgent heating, cooling, and plumbing issues.',
    'Our services include heating repair and replacement, cooling repair and replacement, plumbing repair and maintenance.',
    'We serve both residential and commercial customers.',
    'Financing options are available for system replacements.',
    'Call us at ' + POTTER_PERRONE_FACTS.phone + ' for service.',
    'For emergencies during non-business hours, emergency dispatch is available.',
    'We provide free estimates and consultations.',
  ];
  return lines.join(' ');
}

module.exports = {
  getBusinessKnowledge: getBusinessKnowledge,
  POTTER_PERRONE_FACTS: POTTER_PERRONE_FACTS,
  HVAC_PLUMBING_KB: HVAC_PLUMBING_KB,
  findMatchingKnowledge: findMatchingKnowledge,
  buildKnowledgeResponse: buildKnowledgeResponse,
};
