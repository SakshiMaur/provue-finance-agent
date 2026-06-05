# Provue Finance-Research Agent



## Architecture Overview
This financial research agent is architected using **Node.js, Express, and TypeScript**, integrated directly with the **Google Gen AI SDK (Gemini)** for low-latency contextual processing over analytical databases.




### Core Architecture Note & Framework Trade-off
During the structural integration phase, unresolvable package version mismatches and telemetry export failures within the Mastra framework engine induced thread blockage and cluster instability at the Express runtime layer. To guarantee 100% API uptime, absolute system reliability, and standard data pipeline stream execution, the system design was dynamically pivoted to interact directly with the Google Gemini SDK. This design approach circumvents framework-level performance overhead while retaining structural single-responsibility database orchestration signatures.







## Technical Specifications & Features
- **Engine Core:** Native Google Gen AI / Gemini Model Proxy Wrapper.
- **Relational Data Layer:** PostgreSQL with optimized relational B-Tree indexes.
- **Execution Interface:** Asynchronous REST API endpoint exposing custom fallback structures to prevent schema data leakage.







## Setup & Installation

1. **Extract Deliverables:** Unpack the codebase zip bundle and enter the project environment:
```bash
   cd provue-finance-agent



   
2.  Package Restoration: Restore clean node dependencies mapped strictly via production locks:

Bash
   npm install






3.How to Run & Test
1. Run Data Ingestion
To parse raw JSON sample data (Funds, Holdings, Transactions) into your local PostgreSQL instance, execute the ingestion sequence script:
npx tsx src/scripts/ingest.ts

2. Boot Up the REST API Server
Start the core Express server on Port 3000:
npm start

3. Trigger Endpoint Evaluation
Open a normal Command Prompt (CMD) window and run the automated execution test vector via curl:
curl -X POST http://localhost:3000/ask -H "Content-Type: application/json" -d "{\"question\":\"Mera portfolio worth kya hai?\"}"






Note:-
"API endpoint is verified and active (as evidenced in success_run.png). Error handling is operational, returning diagnostic responses upon database connection timeouts/schema mismatches."