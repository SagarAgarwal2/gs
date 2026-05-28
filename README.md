# GraphSentinel

## 1. 🚀 Problem Statement

Traditional Anti-Money Laundering (AML) systems heavily rely on static, rule-based heuristics that are increasingly inadequate against modern, sophisticated financial crimes. Illicit actors use complex obfuscation techniques such as **multi-hop layering**, **circular round trips**, and **structuring (smurfing)** to evade detection. These legacy systems suffer from notoriously high false-positive rates, overwhelming investigators and allowing subtle, temporally distributed fraud patterns to slip through undetected. The challenge lies in accurately capturing both the structural complexity of transaction networks and the temporal sequence of account behaviors simultaneously.

## 2. 💡 Solution (GraphSentinel)

**GraphSentinel** is a comprehensive financial fraud detection and AML platform designed to overcome the limitations of traditional systems. It leverages cutting-edge deep learning, specifically combining Temporal Graph Networks with Long Short-Term Memory (LSTM) sequence models, to detect multi-hop illicit financial activities in real-time. 

What makes GraphSentinel unique is its **hybrid approach**: it doesn't just look at an account's transaction history in isolation, nor does it solely look at the static network topology. Instead, it continuously evolves its understanding of the graph structure over time while maintaining temporal awareness of individual account sequences, paired with an **Explainable AI (XAI)** module to generate human-readable narratives for investigators.

## 3. 🧠 How It Works

GraphSentinel employs a sophisticated dual-pipeline machine learning architecture:

- **Graph Modeling**: Utilizes an `EvolveGCN` (Evolving Graph Convolutional Network) to capture the dynamic network topology of money flows. It processes graph snapshots over distinct time steps, learning structural embeddings that highlight hidden relationships, layering networks, and circular money trails.
- **Sequence Modeling**: Uses an `LSTM` network to analyze the temporal sequence of transactions for individual accounts, capturing behavioral anomalies, frequency surges, and volume irregularities over a defined sequence length.
- **Hybrid Detection**: The learned graph embeddings are concatenated with the LSTM sequence features. This combined feature vector is passed through dense layers to output an anomaly score, allowing the system to detect complex fraud patterns like dormant account reactivation or KYC mismatches contextualized within the broader transaction network.

## 4. ⚙️ Architecture Diagram (VERY IMPORTANT)

```mermaid
graph TD
    subgraph Frontend
        UI[React 18 + TypeScript]
        GraphVis[D3.js Fund Flow Graph]
    end

    subgraph Backend Services
        API[Node.js API Server<br/>server.mjs]
        ML[Python ML Service<br/>TensorFlow - ml_service.py]
    end

    subgraph Storage
        DB[(Supabase PostgreSQL)]
    end

    UI -->|REST / JSON| API
    GraphVis -->|Fetch Nodes/Edges| API
    API -->|SQL/PostgREST| DB
    API -->|HTTP POST /api/analyze| ML
    ML -->|Fetch Training Data| DB
    ML -->|Return Predictions & XAI| API
```

## 5. 🔍 Features

- **Advanced ML Detection**: Hybrid EvolveGCN + LSTM model to detect multi-hop layering, smurfing, and round trips.
- **Explainable AI (XAI)**: Generates SHAP-inspired narratives and quantitative risk factor breakdowns (e.g., volume surges, network density changes) for every alert.
- **Interactive Fund Flow Graph**: D3.js powered visualization of complex transaction networks and entity relationships.
- **Investigation Dashboard**: Priority queue for investigators to review alerts, complete with an automated feedback loop.
- **Automated Compliance Reporting**: Generates ready-to-file STR and CTR reports in standard **goAML XML** format.
- **Federated Network Support**: Architecture prepared for distributed intelligence sharing across federated nodes.

## 6. ✅ Quickstart (Local)

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- A Supabase project (Postgres)

### 1) Create the Supabase schema + demo seed
Run these migrations in your Supabase project (SQL editor), in order:
- [supabase/migrations/20260504215226_create_graphsentinel_schema.sql](supabase/migrations/20260504215226_create_graphsentinel_schema.sql)
- [supabase/migrations/20260504215539_seed_graphsentinel_data.sql](supabase/migrations/20260504215539_seed_graphsentinel_data.sql)

### 2) Configure environment variables
Create a root `.env` (the backend also reads this file):

```env
# Used by the React app
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Used by the Node backend (optional if you reuse the VITE_ vars)
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional service wiring
ML_SERVICE_URL=http://127.0.0.1:8790
PORT=8787
CORS_ORIGIN=*
```

### 3) Install dependencies
```bash
npm install

# ML service deps
python3 -m pip install --upgrade pip
python3 -m pip install tensorflow numpy
```

### 4) Run everything
```bash
npm run start:all
```

### Ports
- Frontend (Vite): http://localhost:5173
- Backend: http://localhost:8787
- ML service: http://127.0.0.1:8790

## 7. 🔌 API Examples

The Node.js server exposes RESTful endpoints for integration:

**Health checks:**
```bash
curl http://localhost:8787/health
curl http://127.0.0.1:8790/health
```

**Trigger ML analysis & persist new alerts:**
```bash
curl -X POST http://localhost:8787/api/analyze
```

**Generate goAML XML report:**
```bash
curl -X POST http://localhost:8787/api/reports/generate \
  -H "Content-Type: application/json" \
  -d '{"reportType":"STR","narrative":"Generated from open alerts"}'
```

**Submit investigator feedback (stored for retraining):**
```bash
curl -X POST http://localhost:8787/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"alert_id":"ALRT_XXXXXXXX","status":"confirmed","investigator_action":"confirmed","investigator_name":"Investigations Desk","notes":"Clear layering pattern."}'
```

## 8. 🧪 ML Details

- **Model Pipeline**: 
  - *Data Prep*: Parses historical transactions to build sequence features (amount, channel, time deltas) and graph snapshots (adjacency matrices).
  - *Inference*: `build_model()` constructs the `EvolveGCNBlock` and `LSTM` branches. `infer_alerts()` generates confidence scores and risk factors.
- **Training Loop**: Exposed via the `/retrain` endpoint. The `train_model()` function builds a fresh training dataset from historical alerts and investigator feedback, normalizes matrices, fits the model, and saves updated weights and normalization metadata.
- **Feedback Retraining**: The system creates a continuous learning loop. When investigators confirm or dismiss alerts via the dashboard, this feedback is saved to Supabase. The `retrain` process incorporates this feedback to adjust class weights and minimize false positives dynamically.

## 9. 🚀 Deployment

The architecture is highly decoupled, allowing independent scaling:
- **Frontend**: Can be built via `npm run build` and deployed to Vercel, Netlify, or any static CDN.
- **Node.js API**: Deployable as a Docker container or via PaaS (Render, Heroku). Needs standard HTTP port access and connection strings for Supabase and the ML service.
- **Python ML Service**: Requires a compute environment with TensorFlow. Best deployed as an independent container with sufficient memory/CPU resources for inference and periodic retraining.

## 10. 🛠️ Setup

For local development, prefer the Quickstart section above.

If you want to run services separately:
```bash
# ML service
npm run backend:ml

# Node backend
npm run backend

# React frontend
npm run dev
```
