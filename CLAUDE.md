# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend Development

- `pnpm dev` - Start the development server on http://localhost:5173
- `pnpm build` - Build the project (builds both main app and apps from node_modules/p2p_apps)
- `pnpm preview` - Preview the built application
- `pnpm lint` - Run ESLint to check code quality

### Rust Server Development

Navigate to the `server/` directory first:

- `cargo run` - Start the Rust mini server on http://127.0.0.1:8080
- Requires `.env` file with `ANTHROPIC_API_KEY` for code generation features

## Architecture Overview

This is a **P2P App Ecosystem** project implementing a decentralized web store where users can create, distribute, and purchase applications directly through a peer-to-peer network.

### Core Components

**Frontend (TypeScript + React + Vite)**

- Main store interface for browsing and installing apps
- Dashboard for managing installed apps
- Code generation interface for creating new apps
- Built as a PWA that can be installed locally

**Rust Mini Server** (`server/`)

- HTTP server that securely proxies Anthropic API requests
- Handles code generation for new app creation
- Implements Host APIs for app functionality (database, payments, storage)

**P2P Architecture**

- Apps are distributed via gossip protocol for metadata synchronization
- Each app is self-contained with local SQLite storage
- Lightning Network integration for payments
- No central server dependencies once installed

### Key Technologies

- **State Management**: Jotai for atomic state management
- **Database**: SQLite (via sqlocal) for local data persistence
- **Styling**: Tailwind CSS v4
- **Payments**: Lightning Development Kit (LDK) integration
- **P2P**: Custom gossip protocol for app metadata distribution

### File Structure

- `src/` - Main React application source
  - `pages/` - Route components (dashboard, store, create-app)
  - `components/` - Reusable UI components
  - `libs/` - Core libraries (db, anthropic API, UI utilities)
  - `state.ts` - Global state management with Jotai
  - `router.tsx` - React Router configuration
- `server/` - Rust mini server for API proxy and host services
- `public/` - Static assets
- `output/` - Build output directory
- `.claude/agents/` - Specialized agent configurations

### Build Configuration

- **Main Build**: Vite configuration builds the store interface
- **Apps Build**: Secondary build process compiles individual apps
- **COOP/COEP Headers**: Required for SQLite WASM functionality
- **Single File Build**: Uses vite-plugin-singlefile for distribution

### Development Patterns

**Database Operations**

- Use the `db` library from `src/libs/db.ts`
- Subscribe to database changes via `subscribeDB` for reactive updates
- SQLite runs in browser via WebAssembly

**State Management**

- Use Jotai atoms for reactive state
- `appsAtom` for all applications data
- `installedAppsAtom` and `storeAppsAtom` for filtered views
- `appByIdAtom` family for individual app access

**API Integration**

- Anthropic API calls must route through the Rust server
- Never expose API keys in frontend code
- Use the anthropic client from `src/libs/anthropic.ts`

**File Naming Convention**

Always use **kebab-case** for all file names in this project (e.g., `my-component.tsx`, `user-profile.md`). This applies to source files, configuration files, and documentation.

### Specialized Agents

The project includes three specialized Claude Code agents in `.claude/agents/`:

1. **p2p-app-builder** - For building P2P applications following ecosystem principles
2. **anthropic-api-integrator** - For secure API integration with proper authentication
3. **threejs-3d-ui-developer** - For 3D UI components (future Node OS integration)

Use these agents for specialized tasks within their domains.

### Security Considerations

- API keys stored in server environment variables only
- All external API calls proxied through Rust server
- Local-first data storage with user-controlled synchronization
- App signing and verification for distribution integrity

### Testing

- No specific test framework configured - check for existing test patterns before implementing
- Focus on P2P functionality testing including network partitions
- Verify offline-first behavior and Lightning payment flows

## Tech Stack Rationale

Our architecture reflects core principles: decentralization, privacy, and financial sovereignty.

### Bitcoin + Lightning Network
Bitcoin is the only truly decentralized blockchain at scale. Lightning enables millions of transactions per second while preserving Bitcoin's decentralization—the only credible path to global peer-to-peer digital cash.

### IPv6 + No Domains
True sovereignty means no gatekeepers. Domains require centralized registration and can be revoked. IPv6 over HTTP bypasses these systems, creating uncensorable infrastructure. IPv6 ensures scalability with virtually unlimited addresses.

### PWA (Progressive Web App)
Mobile app stores are gatekeepers with 30% taxes and censorship risk. PWAs deliver native app experience (offline, notifications, home screen) with web freedom—no permission required.

### L402 Protocol
HTTP 402 "Payment Required" was reserved 20+ years ago but unused. With Bitcoin/Lightning, L402 brings native micropayments to web protocols. Industry leaders like Coinbase and Anthropic are adopting this standard.

### Front-End Loaded Architecture
Optimized for <1GB RAM devices. Browser handles processing while server focuses on data/CRUD operations. Rust backend for performance/safety, cached frontend for speed.

### 3D UI
3D interface using Three.js feels more intuitive than 2D layouts. WebXR-compatible for VR/AR devices without vendor lock-in. Desktop/tablet default with 2D phone mode.
