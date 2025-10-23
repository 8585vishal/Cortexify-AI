import express from 'express';
import fetch from 'node-fetch';
import { createParser } from 'eventsource-parser';

const router = express.Router();

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

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

router.post('/chat', async (req, res) => {
  try {
    const AI_API_KEY = process.env.AI_API_KEY;
    if (!AI_API_KEY) {
      res.status(500).json({ error: 'Missing AI_API_KEY' });
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
      res.write(`event: error\n`);
      res.write(`data: ${JSON.stringify({ message: 'Upstream error', detail: text })}\n\n`);
      res.end();
      return;
    }

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