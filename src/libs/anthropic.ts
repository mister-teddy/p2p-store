export interface AnthropicResponse {
  text: string;
}

export async function generateAppCode(prompt: string): Promise<string> {
  const response = await fetch(
    new URL(
      "/api/generate",
      import.meta.env.DEV ? "http://localhost:3000" : window.location.href
    ),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Proxy server error: ${response.status} - ${errorText}`);
  }
  const data: AnthropicResponse = await response.json();
  return data.text || "";
}
