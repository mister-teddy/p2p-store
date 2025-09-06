// Using direct API calls instead of WASM for now
// WASM integration can be added later once Vercel deployment is working

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, model, max_tokens, temperature, system } = req.body;
    
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'ANTHROPIC_API_KEY environment variable is required' });
    }

    // Build the request body
    const requestBody = {
      model: model || 'claude-3-haiku-20240307',
      max_tokens: max_tokens || 4096,
      temperature: temperature || 1.0,
      messages: [{
        role: 'user',
        content: [{
          type: 'text',
          text: prompt
        }]
      }]
    };

    if (system) {
      requestBody.system = system;
    }

    // Make request to Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Anthropic API error: ${response.status} - ${errorText}`);
      return res.status(response.status).json({ error: `API error: ${response.status}` });
    }

    const data = await response.json();
    
    if (data.content && data.content.length > 0) {
      const content = data.content[0];
      return res.status(200).json(content);
    } else {
      return res.status(500).json({ error: 'No content returned from API' });
    }
  } catch (error) {
    console.error('Error in generate endpoint:', error);
    return res.status(500).json({ error: error.message || 'Unknown error' });
  }
}