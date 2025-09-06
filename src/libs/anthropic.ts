export interface AnthropicResponse {
  text: string;
}

export async function generateAppCode(prompt: string): Promise<string> {
  const response = await fetch("/api/generate", {
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
