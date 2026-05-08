/** @jest-environment node */
'use strict';

const chatHandler = require('./chat');

function createMockResponse() {
  return {
    headers: {},
    statusCode: 200,
    body: null,
    ended: false,
    setHeader: function (key, value) {
      this.headers[key] = value;
    },
    status: function (code) {
      this.statusCode = code;
      return this;
    },
    json: function (payload) {
      this.body = payload;
      return this;
    },
    end: function () {
      this.ended = true;
      return this;
    },
  };
}

describe('POST /api/chat', function () {
  const originalOpenAIKey = process.env.OPENAI_API_KEY;
  const originalProviderKey = process.env.AI_PROVIDER_KEY;
  const originalApiKey = process.env.AI_API_KEY;
  const originalFetch = global.fetch;

  beforeEach(function () {
    process.env.OPENAI_API_KEY = '';
    process.env.AI_PROVIDER_KEY = '';
    process.env.AI_API_KEY = '';
    process.env.OPENAI_TIMEOUT_MS = '2000';
    process.env.OPENAI_MAX_TOKENS = '220';
    process.env.OPENAI_HISTORY_MAX_TURNS = '6';
    global.fetch = originalFetch;
  });

  afterAll(function () {
    process.env.OPENAI_API_KEY = originalOpenAIKey;
    process.env.AI_PROVIDER_KEY = originalProviderKey;
    process.env.AI_API_KEY = originalApiKey;
    global.fetch = originalFetch;
  });

  test('returns 400 when message is missing', async function () {
    const req = {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.10.0.1' },
      socket: { remoteAddress: '10.10.0.1' },
      body: {},
    };
    const res = createMockResponse();

    await chatHandler(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'message is required' });
  });

  test('returns structured fallback response with emergency action hints', async function () {
    const req = {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.10.0.2' },
      socket: { remoteAddress: '10.10.0.2' },
      body: {
        sessionId: 'session-1',
        message: 'There is a gas smell in my basement and I need help now',
        template: 'service',
        history: [
          { role: 'assistant', content: 'How can I help?' },
          { role: 'user', content: 'I smell gas' },
        ],
      },
    };
    const res = createMockResponse();

    await chatHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.sessionId).toBe('session-1');
    expect(res.body.mode).toBe('fallback');
    expect(res.body.safety && res.body.safety.isEmergency).toBe(true);
    expect(res.body.actions && res.body.actions.shouldHandoff).toBe(true);
    expect(res.body.actions && res.body.actions.handoffReason).toBe('emergency-symptoms');
    expect(res.body.reply).toMatch(/dispatch|gas utility|emergency/i);
  });

  test('uses model mode when provider response is available', async function () {
    process.env.OPENAI_API_KEY = 'test-key';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: function () {
        return Promise.resolve({
          choices: [
            {
              message: {
                content: 'Model guidance: call dispatch at (315) 472-3557 for urgent no-heat.',
              },
            },
          ],
        });
      },
    });

    const req = {
      method: 'POST',
      headers: { 'x-forwarded-for': '10.10.0.3' },
      socket: { remoteAddress: '10.10.0.3' },
      body: {
        message: 'I need a maintenance estimate in ZIP 13202',
        template: 'service',
        context: { zip: '13202' },
        history: [{ role: 'assistant', content: 'Please share your ZIP.' }],
      },
    };
    const res = createMockResponse();

    await chatHandler(req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.mode).toBe('model');
    expect(res.body.reply).toMatch(/Model guidance/i);
    expect(res.body.extracted && res.body.extracted.zip).toBe('13202');
    expect(res.body.serviceArea && res.body.serviceArea.zip).toBe('13202');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
