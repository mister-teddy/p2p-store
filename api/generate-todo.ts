export const config = {
  runtime: 'edge',
};

interface TodoGenerateRequest {
  prompt: string;
}

interface AnthropicContent {
  text: string;
}

interface ErrorResponse {
  error: string;
}

let wasmModule: WebAssembly.WebAssemblyInstantiatedSource | null = null;

async function loadWasm(): Promise<any> {
  if (wasmModule) {
    return wasmModule.instance.exports;
  }

  try {
    // Import the WASM file using the ?module suffix for Vercel Edge Runtime
    const wasmModule = await import('../anthropic_wasm.wasm?module');
    const wasmInstance = await WebAssembly.instantiate(wasmModule.default);
    return wasmInstance.instance.exports;
  } catch (error) {
    console.error('Failed to load WASM module:', error);
    throw new Error('Failed to load WASM module');
  }
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const requestData: TodoGenerateRequest = await request.json();
    if (!requestData.prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Load WASM module
    const wasm = await loadWasm();
    
    // Call WASM function
    const requestJson = JSON.stringify(requestData);
    const result = await wasm.generate_todo_app(requestJson, apiKey);
    
    // Parse result
    if (result && typeof result === 'object' && 'error' in result) {
      const errorResponse = result as ErrorResponse;
      console.error('WASM function error:', errorResponse.error);
      return new Response(JSON.stringify({ error: errorResponse.error }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const content = result as AnthropicContent;
    console.log('Successfully generated todo app response');
    return new Response(JSON.stringify(content), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-todo endpoint:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}