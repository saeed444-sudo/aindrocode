import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();

// Generate code using Claude
router.post('/generate', async (req, res) => {
  const { prompt, apiKey, model = 'claude-3-5-sonnet-20241022', context = '' } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (!apiKey) {
    return res.status(400).json({ error: 'API key is required' });
  }

  try {
    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are an expert coding assistant. Generate clean, efficient, and well-commented code based on user requests. 
${context ? `\n\nCurrent project context:\n${context}` : ''}`;

    const message = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const code = message.content[0].text;

    res.json({
      success: true,
      code,
      usage: message.usage
    });

  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.toString()
    });
  }
});

// Fix code using AI debugging loop
router.post('/fix', async (req, res) => {
  const { 
    code, 
    error, 
    language, 
    apiKey, 
    model = 'claude-3-5-sonnet-20241022',
    maxIterations = 3 
  } = req.body;

  if (!code || !error || !apiKey) {
    return res.status(400).json({ error: 'Code, error, and API key are required' });
  }

  try {
    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are an expert debugging assistant. Analyze the error and fix the code. 
Return ONLY the corrected code without explanations or markdown formatting.`;

    const prompt = `Language: ${language}

Code:
\`\`\`${language}
${code}
\`\`\`

Error:
${error}

Please fix the code to resolve this error.`;

    const message = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const fixedCode = message.content[0].text;

    res.json({
      success: true,
      fixedCode,
      usage: message.usage
    });

  } catch (error) {
    console.error('AI fix error:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.toString()
    });
  }
});

// Chat with AI about code
router.post('/chat', async (req, res) => {
  const { 
    message, 
    history = [], 
    apiKey, 
    model = 'claude-3-5-sonnet-20241022',
    context = ''
  } = req.body;

  if (!message || !apiKey) {
    return res.status(400).json({ error: 'Message and API key are required' });
  }

  try {
    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are an expert programming assistant helping users with code development, debugging, and explanations.
${context ? `\n\nCurrent project context:\n${context}` : ''}`;

    const messages = [
      ...history,
      { role: 'user', content: message }
    ];

    const response = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages
    });

    const reply = response.content[0].text;

    res.json({
      success: true,
      reply,
      usage: response.usage
    });

  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.toString()
    });
  }
});

export default router;
