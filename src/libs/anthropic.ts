// src/libs/anthropic.ts
// Utility for interacting with Anthropic API (Claude)

export async function generateAppCode(prompt: string): Promise<string> {
  const response = await fetch("/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) throw new Error("Proxy server error");
  const data = await response.json();
  return data.text || "";
}
