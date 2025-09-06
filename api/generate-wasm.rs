// api/generate.rs
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::env;
use vercel_runtime::{run, Body, Error, Request, Response, StatusCode};

#[derive(Deserialize)]
struct GenerateRequest {
    prompt: String,
    model: Option<String>,
    max_tokens: Option<u32>,
    temperature: Option<f32>,
    system: Option<String>,
}

#[derive(Serialize, Deserialize)]
struct AnthropicResponse {
    content: Option<Vec<AnthropicContent>>,
}

#[derive(Serialize, Deserialize)]
struct AnthropicContent {
    text: String,
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    run(handler).await
}

pub async fn handler(req: Request) -> Result<Response<Body>, Error> {
    // Handle CORS preflight requests
    if req.method() == "OPTIONS" {
        return Response::builder()
            .status(StatusCode::OK)
            .header("Access-Control-Allow-Origin", "*")
            .header("Access-Control-Allow-Methods", "POST, OPTIONS")
            .header("Access-Control-Allow-Headers", "Content-Type")
            .body("".into())
            .map_err(|e| Error::from(format!("Failed to build CORS response: {}", e)));
    }

    // Only allow POST requests
    if req.method() != "POST" {
        return Response::builder()
            .status(405)
            .header("Allow", "POST, OPTIONS")
            .body("Method Not Allowed".into())
            .map_err(|e| Error::from(format!("Failed to build response: {}", e)));
    }

    // Parse request body
    let body = req.body();
    let payload: GenerateRequest = serde_json::from_slice(body)
        .map_err(|e| Error::from(format!("Failed to parse request body: {}", e)))?;
    
    let client = Client::new();
    
    // Get API key from environment
    let api_key = env::var("ANTHROPIC_API_KEY")
        .map_err(|_| Error::from("ANTHROPIC_API_KEY environment variable is required"))?;
    
    // Build the request body with configurable parameters
    let mut request_body = serde_json::json!({
        "model": payload.model.unwrap_or_else(|| "claude-3-haiku-20240307".to_string()),
        "max_tokens": payload.max_tokens.unwrap_or(4096),
        "temperature": payload.temperature.unwrap_or(1.0),
        "messages": [{ 
            "role": "user", 
            "content": [{ 
                "type": "text", 
                "text": payload.prompt 
            }] 
        }],
    });

    // Add system message if provided
    if let Some(system_msg) = payload.system {
        request_body["system"] = serde_json::json!(system_msg);
    }

    // Make request to Anthropic API
    let resp = client
        .post("https://api.anthropic.com/v1/messages")
        .header("Content-Type", "application/json")
        .header("x-api-key", api_key)
        .header("anthropic-version", "2023-06-01")
        .json(&request_body)
        .send()
        .await
        .map_err(|e| Error::from(format!("Request failed: {}", e)))?;

    // Check if the response status indicates an error
    if !resp.status().is_success() {
        let status = resp.status();
        let error_text = resp.text().await.unwrap_or_else(|_| "Unknown error".to_string());
        return Err(Error::from(format!("Anthropic API error: {} - {}", status, error_text)));
    }

    let data: AnthropicResponse = resp
        .json()
        .await
        .map_err(|e| Error::from(format!("Failed to parse response: {}", e)))?;

    if let Some(content) = data.content.and_then(|mut c| c.pop()) {
        let json_body = serde_json::to_string(&content)
            .map_err(|e| Error::from(format!("Failed to serialize response: {}", e)))?;
        
        Response::builder()
            .status(StatusCode::OK)
            .header("Content-Type", "application/json")
            .header("Access-Control-Allow-Origin", "*")
            .header("Access-Control-Allow-Methods", "POST, OPTIONS")
            .header("Access-Control-Allow-Headers", "Content-Type")
            .body(json_body.into())
            .map_err(|e| Error::from(format!("Failed to build response: {}", e)))
    } else {
        Err(Error::from("No content returned from API"))
    }
}