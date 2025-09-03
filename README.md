# P2P Store

A peer-to-peer web store application. This project allows users to buy and sell items directly through a decentralized web interface.

## The Prototype

- The store is a **standalone `store.html` file**. Double-click to open in your default browser.
- The app list is loaded from a **dummy SQLite database** and rendered using **React**.
- Each app listing includes a **Pay button** powered by **LDK** (Lightning Development Kit).

## Architecture

```mermaid
---
config:
  layout: elk
  theme: neo
  look: classic
---
flowchart TD
 subgraph Gossip["P2P Network"]
        G1["Broadcast: app metadata (name, desc, price, version, hash)"]
  end

 subgraph Node["User Node"]
        RS["Rust Mini Server<br>(HTTP server on :443)"]
        N1["Node Dashboard PWA<br>(served by Rust server)"]
        N2["Host APIs:<br>(DB, payments, messaging, storage)<br>(implemented in Rust)"]

        subgraph MyApps["My Created Apps (for sale)"]
            MA1["Notepad App Source"]
            MA2["Todo App Source"]
            MA3["...other created apps"]
        end

        subgraph Downloaded["Downloaded Apps (purchased)"]
            DA1["Calculator Mini-App"]
            DA2["Calendar Mini-App"]
            DA3["...other purchased apps"]
        end
 end

 subgraph Device["User Device"]
        B1@{ label: "Browser visits node.local:443 or IPv6" }
        B2@{ label: "Installs Node Dashboard as PWA" }
        B3@{ label: "Accesses mini-apps through dashboard menu" }
 end

 subgraph External["External Services"]
        Claude["Claude API<br>(for code generation)"]
 end

    G1 <-- "Gossip sync<br>(discover & download apps)" --> RS
    RS --> N1
    RS --> MyApps
    RS --> Downloaded
    VC["Vibe Code Tool"]
    VC -- "Generate app code" --> MyApps
    N1 -- "Access tool" --> VC
    MyApps -- "List for sale" --> G1
    B1 --> RS
    B1 -- "Install PWA" --> B2
    B2 --> B3
    B3 -- "Menu selection" --> N1
    N1 -- "Launch mini-app" --> Downloaded
    B3 <-- "Host API calls" --> N2
    VC -- "uses" --> Claude

    B1@{ shape: rect}
    B2@{ shape: rect}
    B3@{ shape: rect}
```

- Each app is a self-contained "mini-app" served by the user's personal **Rust Mini Server**.
- Apps interact with a set of stable **Host APIs** (also implemented in Rust) for functionalities like database, payments, and storage, instead of receiving them as component props.
- The main "Node Dashboard" is a PWA that launches these mini-apps, potentially using a microfrontend-style architecture.

### Prerequisites

- Node.js (recommended v18+)
- pnpm

### Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/p2p-store.git
cd p2p-store
```

Install dependencies:

```bash
pnpm install
```

### Development

This will start the server on `http://localhost:5173`.

#### Debugging in VS Code

1.  Go to the "Run and Debug" view in VS Code (Shift+Cmd+D or Shift+Ctrl+D).
2.  Select "Launch Chrome against localhost" from the dropdown and click the green play button.
3.  This will automatically start the development server and open a new Chrome window connected to the debugger. You can now set breakpoints in your `.tsx` files within VS Code.

### Build

To build the project:

```bash
pnpm build
```

The P2P Store will be compiled into static resources in the `output` folder, which can then be hosted on a web server. The web server must support `COOP` and `COEP` headers. The simplest way to check this is to use the following command:

```bash
pnpm preview
```

### Usage

Open `store.html` in your browser to use the P2P Store. The app list will be displayed, and you can use the Pay button for each app.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

MIT
