// server/src/main.rs
use axum::extract::State;
use axum::{routing::post, Json, Router};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::env;
use tracing_subscriber;

#[derive(Deserialize)]
struct GenerateRequest {
    prompt: String,
}

#[derive(Serialize, Deserialize)]
struct AnthropicResponse {
    content: Option<Vec<AnthropicContent>>,
}

#[derive(Serialize, Deserialize)]
struct AnthropicContent {
    text: String,
}

async fn generate_code(
    State(client): State<Client>,
    Json(payload): Json<GenerateRequest>,
) -> Result<Json<AnthropicContent>, (axum::http::StatusCode, String)> {
    let api_key = env::var("ANTHROPIC_API_KEY").map_err(|_| {
        (
            axum::http::StatusCode::INTERNAL_SERVER_ERROR,
            "API key missing".to_string(),
        )
    })?;

    let body = serde_json::json!({
        "model": "claude-2.1",
        "max_tokens": 2048,
        "messages": [{ "role": "user", "content": payload.prompt }],
    });

    let resp = client
        .post("https://api.anthropic.com/v1/messages")
        .header("Content-Type", "application/json")
        .header("x-api-key", api_key)
        .header("anthropic-version", "2023-06-01")
        .json(&body)
        .send()
        .await
        .map_err(|e| (axum::http::StatusCode::BAD_GATEWAY, e.to_string()))?;

    let data: AnthropicResponse = resp
        .json()
        .await
        .map_err(|e| (axum::http::StatusCode::BAD_GATEWAY, e.to_string()))?;

    if let Some(content) = data.content.and_then(|mut c| c.pop()) {
        Ok(Json(content))
    } else {
        Err((
            axum::http::StatusCode::BAD_GATEWAY,
            "No content returned".to_string(),
        ))
    }
}

#[tokio::main]
async fn main() {
    dotenv::dotenv().ok();
    tracing_subscriber::fmt::init();
    let client = Client::new();
    let app = Router::new()
        .route("/generate", post(generate_code))
        .with_state(client);
    let addr = "127.0.0.1:8080";
    tracing::info!("Listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
