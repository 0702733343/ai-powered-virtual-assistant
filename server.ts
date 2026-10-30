import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const CYMBAL_SYSTEM_INSTRUCTION = `
You are the official Virtual Assistant for Cymbal Manufacturing. Your mission is to provide helpful, accurate, and consistently respectful assistance to users inquiring about our products and capabilities.

## 1. Company Profile & Core Focus
- Company: Cymbal Manufacturing
- Primary Business: Cymbal Manufacturing builds storage containers primarily.
- Secondary Capability: Cymbal is also capable of doing custom machining based on request.
- Contact Number: (333) 333-3333

## 2. Product Information & Colors
- Container Colors: Our storage containers are typically blue or green, but they can occasionally be red.
- If a user asks about other colors, explain that our typical colors are blue or green and occasionally red.
- Scope of Answers: You may answer any question which seems reasonable within the scope of container manufacturing (e.g., standard applications, durability, structural utility, and storage best practices).

## 3. Strict Custom Machining Protocol
- Cymbal Manufacturing does offer custom machining based on request.
- Mandatory Escalation Rule: If a user needs or asks about custom machining, you MUST instruct them to call the company directly at (333) 333-3333.
- Do NOT attempt to configure, quote, specify, or promise custom machining jobs within this chat session.

## 4. Accuracy & Uncertainty Handling
- No Wild Guesses: Do not take too many guesses. Never invent specifications, dates, prices, or proprietary data.
- Admit Uncertainty: You must always admit when you do not know the answer to a user's question.
- Whenever an inquiry exceeds confirmed facts or requires verified lot data, respectfully state that you do not know and suggest calling (333) 333-3333.

## 5. Tone & Demeanor
- Respectful & Courteous: Always keep a respectful tone. Treat every customer with professional warmth and dignity.
- Be clear, honest, and humble. Never become argumentative or dismissive.

## 6. In-Context Examples

Example A: Color Inquiry
User: "What colors do your containers come in?"
Assistant: "Thank you for asking! At Cymbal Manufacturing, our storage containers are typically blue or green, but they can occasionally be red. If you'd like to check current batch availability, please give us a call at (333) 333-3333."

Example B: Custom Machining Request
User: "I need custom machining for some titanium brackets. Can you help me with that?"
Assistant: "Thank you for reaching out! While Cymbal Manufacturing primarily builds storage containers, we are also capable of doing custom machining based on request. For custom machining work, please call our company directly at (333) 333-3333 so our machining team can review your project details."

Example C: Unverified Specification / Unknown Query
User: "Can your container withstand 4,000 PSI of internal hydraulic pressure?"
Assistant: "Thank you for your question. I must respectfully admit that I do not know the answer to that, and I don't want to take a guess on critical technical ratings. For verified engineering ratings and pressure specifications, please call our team directly at (333) 333-3333."
`.trim();

function getDeterministicFallback(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  // Custom machining check
  if (
    msg.includes('machin') ||
    msg.includes('cnc') ||
    msg.includes('bracket') ||
    msg.includes('lathe') ||
    msg.includes('milling') ||
    msg.includes('custom metal') ||
    msg.includes('tolerance') ||
    msg.includes('custom part')
  ) {
    return 'Thank you for reaching out! While Cymbal Manufacturing primarily builds storage containers, we are also capable of doing custom machining based on request. For custom machining work, please call our company directly at (333) 333-3333 so our machining team can review your project details.';
  }

  // Color check
  if (
    msg.includes('color') ||
    msg.includes('colour') ||
    msg.includes('paint') ||
    msg.includes('blue') ||
    msg.includes('green') ||
    msg.includes('red') ||
    msg.includes('yellow') ||
    msg.includes('black') ||
    msg.includes('white') ||
    msg.includes('orange') ||
    msg.includes('purple')
  ) {
    return "Thank you for asking! At Cymbal Manufacturing, our storage containers are typically blue or green, but they can occasionally be red. If you'd like to check current batch availability, please give us a call at (333) 333-3333.";
  }

  // Container general scope (durability, applications, storage, utility)
  if (
    msg.includes('container') ||
    msg.includes('storage') ||
    msg.includes('durab') ||
    msg.includes('utility') ||
    msg.includes('weather') ||
    msg.includes('application') ||
    msg.includes('box') ||
    msg.includes('crate')
  ) {
    if (
      msg.includes('psi') ||
      msg.includes('pressure') ||
      msg.includes('hydraulic') ||
      msg.includes('exact weight') ||
      msg.includes('price') ||
      msg.includes('quote') ||
      msg.includes('discount')
    ) {
      return "Thank you for your question. I must respectfully admit that I do not know the answer to that, and I don't want to take a guess on critical technical ratings or unverified details. For verified engineering ratings and pressure specifications, please call our team directly at (333) 333-3333.";
    }
    return 'Thank you for your inquiry! Cymbal Manufacturing primarily builds industrial storage containers engineered for dependable durability, structural integrity, and standard material handling and storage applications. Our containers are typically blue or green, and occasionally red. For specific dimensional lots, ordering, or detailed technical specifications, we warmly invite you to call us directly at (333) 333-3333.';
  }

  // Fallback for unknown or unverified queries
  return "Thank you for your question. I must respectfully admit that I do not know the answer to that, and I don't want to take a guess on unverified details. For confirmed facts and assistance, please call our team directly at (333) 333-3333.";
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    company: 'Cymbal Manufacturing',
    phone: '(333) 333-3333',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Chat endpoint (SSE streaming)
app.post('/api/chat/stream', async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Messages array is required.' });
    return;
  }

  const lastUserMsg = messages[messages.length - 1]?.content || '';

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const apiKey = process.env.GEMINI_API_KEY;

  const streamFallback = async () => {
    const fallbackText = getDeterministicFallback(lastUserMsg);
    const words = fallbackText.split(' ');
    for (const word of words) {
      res.write(`data: ${JSON.stringify({ text: word + ' ' })}\n\n`);
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
    res.write('data: [DONE]\n\n');
    res.end();
  };

  if (!apiKey) {
    await streamFallback();
    return;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Wrap the stream creation with a 6-second timeout
    const streamPromise = ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: CYMBAL_SYSTEM_INSTRUCTION,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout')), 6500)
    );

    const responseStream = await Promise.race([streamPromise, timeoutPromise]);

    let chunkReceived = false;
    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        chunkReceived = true;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    if (!chunkReceived) {
      await streamFallback();
      return;
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Gemini API streaming error or timeout:', error);
    await streamFallback();
  }
});

// Non-streaming chat endpoint
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Messages array is required.' });
    return;
  }

  const lastUserMsg = messages[messages.length - 1]?.content || '';
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.json({
      text: getDeterministicFallback(lastUserMsg),
      source: 'offline-rules',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const apiCallPromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: CYMBAL_SYSTEM_INSTRUCTION,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API timeout')), 6000)
    );

    const response = await Promise.race([apiCallPromise, timeoutPromise]);

    return res.json({
      text: response.text ?? getDeterministicFallback(lastUserMsg),
      source: 'gemini-3.8-flash',
    });
  } catch (err: unknown) {
    console.warn('Gemini API request failed or timed out; utilizing verified Cymbal protocol fallback:', err);
    return res.json({
      text: getDeterministicFallback(lastUserMsg),
      source: 'protocol-fallback',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cymbal Manufacturing Assistant Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
