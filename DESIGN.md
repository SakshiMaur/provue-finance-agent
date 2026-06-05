# DESIGN DOCUMENT - FINANCE RESEARCH AGENT SPECIFICATION

## 1. Postgres Schema Architecture
The underlying database engine stores personal portfolio data dynamically over highly unified relational database layouts:
- **Tables:** `funds`, `holdings`, `transactions`.
- **Indexes:** Applied strategic B-Tree indexing parameters over `user_id` clusters and critical foreign key constraints to reduce search times during structural multi-table joins.
- **Foreign Keys:** Mapped meticulously across time-series transaction histories to preserve cascading referential integrity rules.

## 2. Tool Design & Functional Splitting Strategy
The agent’s mathematical pipeline segregates logical workflows into individual standalone functions following single-responsibility engineering standards:

- **`portfolioValueTool`:** Coordinates aggregations, calculations, net balances, and valuation checks across holdings.
- **`transactionHistoryTool`:** Handles direct chronological queries, credit/debit tracking, and metadata scanning on transaction streams.

**Why this split?** This atomic grouping isolates complex SQL calculations within individual native subroutines. By preventing large, unstructured tables from overwhelming the processing logic, it reduces context bloat and lowers execution times.

## 3. Data Grounding & Anti-Hallucination Guardrails
To enforce deterministic analytical outputs and absolute precision, the engine binds the Google Gemini model strictly to the data context returns generated natively via PostgreSQL. 

If database connections drop or tables contain zero matching arrays, a top-level TypeScript try-catch routing logic intercepts the controller. Instead of allowing the generative AI model to hallucinate false financial metrics, it explicitly outputs a localized fallback message status payload (`{"answer":"सर्वर में समस्या है"}`) to preserve structural system contract integrity.

## 4. Applied Financial Calculations & Formulas

### A. Spend / Net Spend Metrics
Calculated as the total value of debit transactions minus any validated refunds or incoming credits:
$$\text{Net Spend} = \sum(\text{Debit Transactions}) - \sum(\text{Refunds \& Credits})$$

### B. Merchant Matching Systems
Processed via standard regex pattern matching and canonical text conversion on raw statement text fields to group disparate transaction rows into clear merchant buckets.

### C. Recurring Transaction Detection
Monitored by tracking time-interval deltas and variance patterns across transaction logs over sequential 30-day or monthly periods.

### D. Fund Period Return Calculation
Provides historical percentage shifts normalized across user entry windows:
$$\text{Period Return} = \frac{\text{Current NAV Value} - \text{Initial Capital Investment}}{\text{Initial Capital Investment}} \times 100\%$$

### E. Holding Realised Return
Calculated as standard realized profit or loss outputs normalized against total capital structure costs.

## 5. Observability, Trade-offs & Limitations

### Observability Evidence & Integrity
System anomalies, pipeline breaks, and tool execution tracks are monitored via contextual try-catch loops. If an internal database driver drops, the controller routes execution safely to error logging arrays, preventing server thread crashes.

### Architectural Trade-offs
The codebase prioritizes low-latency local execution, robust error containment, and direct high-speed SQL data flows over heavy abstract frameworks that cause dependency blocking at deployment runtimes. While this choice limits edge container scaling, it guarantees runtime stability and predictable execution results on Port 10000 (Production) / 3000 (Local).

### Future System Enhancements
Given additional development timelines:
- Implement a Redis processing cache layer to optimize redundant analytical calculations.
- Introduce background worker threads to handle bulk data parsing routines for large financial files without locking the event loop.

## 6. Observability & Diagnostics Section
**Observability Framework:**
The agent is built with granular logging and observability to ensure transparency during the development lifecycle.

- **Execution Tracking:** Every request is logged via standard stdout/stderr, allowing operators to monitor the exact ingestion sequence and tool invocation flows.
- **Data Access Transparency:** Logs explicitly capture which database tables are being targeted, providing a clear audit trail of data access patterns.
- **Failure Analysis:** Using robust error boundaries, the system provides immediate diagnostic feedback for failed requests. As demonstrated in `handled_failure.png`, operators can identify the root cause (e.g., schema constraint mismatch or runtime connectivity errors) by inspecting terminal logs.