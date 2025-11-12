import express from 'express';
import fetch from 'node-fetch';
import { createParser } from 'eventsource-parser';

const router = express.Router();

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const ENABLE_DEV_FALLBACK = (process.env.ENABLE_DEV_FALLBACK || '').toLowerCase() === 'true';

function sanitizeText(input) {
  try {
    const text = String(input || '');
    return text.slice(0, 8000);
  } catch {
    return '';
  }
}

function buildMessages(body) {
  // Accept either {message, history} or {messages}
  const systemPrompt = 'You are CORTEXIFY, a helpful, concise assistant.';
  if (Array.isArray(body?.messages)) {
    return [{ role: 'system', content: systemPrompt }, ...body.messages];
  }
  const history = Array.isArray(body?.history) ? body.history : [];
  const messages = history.map((m) => ({ role: m.role, content: sanitizeText(m.content) }));
  const userMsg = sanitizeText(body?.message);
  if (userMsg) messages.push({ role: 'user', content: userMsg });
  return [{ role: 'system', content: systemPrompt }, ...messages];
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function streamFallback(res, messages) {
  try {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    const reply = lastUser
      ? `Mock response (fallback): You said: "${sanitizeText(lastUser)}"`
      : 'Mock response (fallback): Hello from Cortexify. This is a dev fallback stream.';
    const tokens = reply.split(/(\s+)/);
    for (const tok of tokens) {
      if (!tok) continue;
      res.write(`data: ${JSON.stringify({ token: tok })}\n\n`);
      await delay(10);
    }
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (e) {
    try {
      res.write(`event: error\n`);
      res.write(`data: ${JSON.stringify({ message: 'Fallback stream error', detail: String(e) })}\n\n`);
    } catch {}
    res.end();
  }
}

router.post('/chat', async (req, res) => {
  try {
    const AI_API_KEY = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
    if (!AI_API_KEY) {
      if (ENABLE_DEV_FALLBACK) {
        // Stream fallback when no API key available in dev mode
        const messages = buildMessages(req.body);
        // Prepare streaming headers if not set
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders?.();
        await streamFallback(res, messages);
        return;
      }
      res.status(500).json({ error: 'Missing OpenAI API key' });
      return;
    }

    const messages = buildMessages(req.body);

    // Prepare streaming response headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        messages,
        temperature: 0.7,
      }),
    });

    if (!response.ok || !response.body) {
      const text = await response.text();
      if (ENABLE_DEV_FALLBACK) {
        await streamFallback(res, messages);
        return;
      }
      res.write(`event: error\n`);
      res.write(`data: ${JSON.stringify({ message: 'Upstream error', detail: text })}\n\n`);
      res.end();
      return;
    }

    let fallbackTrigger = false;
    let errorPayload = '';
    const parser = createParser((event) => {
      if (event.type === 'event') {
        const data = event.data;
        if (data === '[DONE]') {
          res.write(`data: [DONE]\n\n`);
          res.end();
          return;
        }
        try {
          const json = JSON.parse(data);
          if (json?.error) {
            fallbackTrigger = true;
            errorPayload = JSON.stringify(json.error);
            return;
          }
          const delta = json?.choices?.[0]?.delta?.content;
          if (delta) {
            // Stream plain text tokens to the client as SSE data
            res.write(`data: ${JSON.stringify({ token: delta })}\n\n`);
          }
        } catch (e) {
          // Non-JSON keepalive lines can be ignored
        }
      }
    });

    for await (const chunk of response.body) {
      const str = Buffer.from(chunk).toString('utf8');
      parser.feed(str);
      if (fallbackTrigger) {
        if (ENABLE_DEV_FALLBACK) {
          await streamFallback(res, messages);
        } else {
          res.write(`event: error\n`);
          res.write(`data: ${JSON.stringify({ message: 'Upstream error (stream)', detail: errorPayload || 'unknown' })}\n\n`);
          res.end();
        }
        return;
      }
    }
  } catch (err) {
    console.error('Chat stream error:', err);
    try {
      res.write(`event: error\n`);
      res.write(`data: ${JSON.stringify({ message: 'Server error', detail: String(err) })}\n\n`);
    } catch {}
    res.end();
  }
});

export default router;