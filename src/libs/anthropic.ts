// src/libs/anthropic.ts
// Utility for interacting with Anthropic API (Claude)

export interface GenerateCodeRequest {
  prompt: string;
  model?: string;
  max_tokens?: number;
  temperature?: number;
  system?: string;
}

export interface AnthropicResponse {
  text: string;
}

export async function generateAppCode(prompt: string): Promise<string> {
  const response = await fetch("/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Proxy server error: ${response.status} - ${errorText}`);
  }
  const data: AnthropicResponse = await response.json();
  return data.text || "";
}

export async function generateCodeAdvanced(request: GenerateCodeRequest): Promise<string> {
  const response = await fetch("/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Proxy server error: ${response.status} - ${errorText}`);
  }
  const data: AnthropicResponse = await response.json();
  return data.text || "";
}

export async function generateTodoApp(prompt: string): Promise<string> {
  const response = await fetch("/generate-todo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Todo generation error: ${response.status} - ${errorText}`);
  }
  const data: AnthropicResponse = await response.json();
  return data.text || "";
}
