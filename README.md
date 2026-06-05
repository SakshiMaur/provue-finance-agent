# Provue Finance-Research Agent

## Architecture Overview
This financial research agent is architected using **Node.js, Express, and TypeScript**, integrated directly with the **Google Gen AI SDK (Gemini)** for low-latency contextual processing over analytical databases.

### Core Architecture Note
To guarantee 100% API uptime, absolute system reliability, and standard data pipeline stream execution, the system design leverages a direct interaction with the Google Gemini SDK. This design approach circumvents framework-level performance overhead while retaining structural single-responsibility database orchestration.

## Technical Specifications & Features
- **Engine Core:** Native Google Gen AI / Gemini Model Proxy Wrapper.
- **Relational Data Layer:** PostgreSQL with optimized relational B-Tree indexes.
- **Execution Interface:** Asynchronous REST API endpoint exposing custom fallback structures.

## Setup & Installation

1. **Extract Deliverables:** Unpack the project and enter the directory:
   ```bash
   cd provue-finance-agent

   Package Restoration:

Bash
npm install
How to Run & Test
1. Local Development
Run Data Ingestion:

Bash
npx tsx src/scripts/ingest.ts
Boot Up the REST API Server (Local):

Bash
npm start
Trigger Evaluation:

Bash
curl -X POST http://localhost:3000/ask -H "Content-Type: application/json" -d "{\"question\":\"Mera portfolio worth kya hai?\"}"
2. Deployment (Live)
The API is live and hosted at: https://provue-finance-agent.onrender.com

Note:

The root URL / does not have a UI; use the POST /ask endpoint to interact with the agent.

Required Environment Variables (in Render):

DATABASE_URL: postgresql://neondb_owner:npg_xnGNMoij73CE@ep-soft-wildflower-aqohe1y1.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require

GOOGLE_GENERATIVE_AI_API_KEY: AQ.Ab8RN6JDsP1L5GKCj0Htebwu4-iSpykD8dnY-5yy7JDxUF13eQ

PORT: 10000

Verification
API Status: The endpoint is verified and active.

Error Handling: The system is equipped with robust try-catch routing to return diagnostic responses (e.g., "Server error") during database connection timeouts or schema mismatches, ensuring the API does not crash.