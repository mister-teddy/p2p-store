# WASM Deployment Guide for Vercel Functions

This document explains the WASM-based Anthropic API integration setup for Vercel Functions deployment.

## Overview

The Rust Axum server has been converted to WebAssembly (WASM) for deployment on Vercel Functions using the Edge Runtime. This provides better performance and smaller cold start times compared to traditional serverless functions.

## Architecture

### Components

1. **WASM Module** (`wasm-server/`)
   - Rust code compiled to WebAssembly
   - Contains `generate_code` and `generate_todo_app` functions
   - Uses web-sys for HTTP requests to Anthropic API

2. **Vercel API Routes** (`api/`)
   - `api/generate.ts` - General code generation endpoint
   - `api/generate-todo.ts` - React specialist todo app generation
   - Both use Edge Runtime for optimal WASM performance

3. **TypeScript Definitions** (`anthropic_wasm.d.ts`)
   - Type definitions for WASM exports
   - Interface definitions for request/response objects

## File Structure

```
├── wasm-server/           # Rust WASM source
│   ├── Cargo.toml        # WASM-optimized dependencies
│   └── src/lib.rs        # WASM-compatible Rust code
├── api/                  # Vercel API routes
│   ├── generate.ts       # General generation endpoint
│   └── generate-todo.ts  # Todo app generation endpoint
├── anthropic_wasm.wasm   # Compiled WASM binary
├── anthropic_wasm.d.ts   # TypeScript definitions
└── vercel.json          # Vercel deployment configuration
```

## Build Process

### Prerequisites

1. Rust toolchain with WASM target:
   ```bash
   rustup target add wasm32-unknown-unknown
   ```

2. Node.js and pnpm for frontend build

### Building

The build process is automated in package.json:

```bash
# Full build (includes WASM compilation)
pnpm build

# WASM only
npm run build:wasm
```

The build process:
1. Compiles Rust code to WASM (`wasm32-unknown-unknown` target)
2. Copies the WASM binary to project root
3. Builds the TypeScript frontend

## API Endpoints

### POST /api/generate

General code generation with configurable parameters.

**Request:**
```typescript
interface GenerateRequest {
  prompt: string;
  model?: string;           // Default: "claude-3-haiku-20240307"
  max_tokens?: number;      // Default: 4096
  temperature?: number;     // Default: 1.0
  system?: string;         // Optional system prompt
}
```

**Response:**
```typescript
interface AnthropicContent {
  text: string;
}
```

### POST /api/generate-todo

React specialist todo app generation with hardcoded system prompt.

**Request:**
```typescript
interface TodoGenerateRequest {
  prompt: string;
}
```

**Response:**
```typescript
interface AnthropicContent {
  text: string;
}
```

## Environment Variables

Set in Vercel dashboard or `.env.local`:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## Deployment

### Vercel Configuration

The `vercel.json` file configures:
- Edge Runtime for API functions
- WASM content type headers  
- URL rewrites for SPA routing
- Custom build command

### Deploy to Vercel

```bash
# Using Vercel CLI
vercel deploy

# Or connect GitHub repository for automatic deployments
```

## Performance Optimizations

### WASM Optimizations

- **Size optimization**: `opt-level = "s"` and `lto = true` in Cargo.toml
- **Module caching**: WASM module is cached after first load
- **Edge Runtime**: Provides better WASM performance than Node.js runtime

### API Optimizations

- **Single HTTP request**: Direct Anthropic API calls from WASM
- **JSON streaming**: Efficient request/response handling
- **Error handling**: Comprehensive error catching and reporting

## Error Handling

### Common Issues

1. **WASM Loading Failures**
   - Ensure `anthropic_wasm.wasm` is in project root
   - Check Vercel build logs for compilation errors

2. **API Key Issues**
   - Verify `ANTHROPIC_API_KEY` environment variable
   - Check Vercel function logs for authentication errors

3. **CORS Issues**
   - WASM runs in Edge Runtime, should not have CORS issues
   - Verify API endpoints are accessible

### Debugging

1. **Local Testing**
   ```bash
   pnpm dev
   # Test endpoints at http://localhost:5173/api/generate
   ```

2. **Vercel Function Logs**
   ```bash
   vercel logs
   ```

## Migration from Axum Server

The WASM version maintains API compatibility with the original Axum server:

| Original | WASM Equivalent |
|----------|-----------------|
| `POST /generate` | `POST /api/generate` |
| `POST /generate-todo` | `POST /api/generate-todo` |
| Environment variables | Same (Vercel environment) |
| Request/response format | Identical |

## Limitations

1. **Runtime Environment**: Only works in Vercel Edge Runtime
2. **File System**: No local file system access (not needed for this use case)
3. **Network**: Limited to HTTP/HTTPS requests (sufficient for Anthropic API)

## Monitoring

- Use Vercel Analytics for function performance
- Monitor function execution time and cold starts
- Track API usage and error rates through Vercel dashboard

## Security

- API keys stored as Vercel environment variables
- WASM runs in sandboxed environment
- No direct database or file system access from WASM
- All external requests go through Anthropic's secure API