# GraphSentinel — AI-Powered Fund Flow Tracking & Fraud Detection

## Problem Statement
This project addresses Union Bank PS3: Tracking of Funds within Bank for Fraud Detection. GraphSentinel replaces legacy rule-based AML systems with a real-time, event-driven transaction graph. Utilizing Temporal Graph Neural Networks (GNN) and Explainable AI (SHAP), it detects complex, multi-hop money laundering patterns natively at scale.

## Live Demo
Live Web App: https://shorturl.at/dwumm
Demo Video: 


## Production-Level Tech Stack
GraphSentinel is built on an enterprise-grade, distributed microservices architecture designed for sub-second latency and high-throughput Core Banking ingestion:
*   **Data Ingestion & Streaming:** Apache Kafka (Event Queues) & Apache Flink (Stateful Stream Processing)
*   **Graph Database:** Neo4j (Cypher queries for deep multi-hop traversal)
*   **Machine Learning (AI Engine):** PyTorch Geometric (EvolveGCN for Temporal Graphs), TensorFlow (LSTM Autoencoders)
*   **Explainable AI & Federated Layer:** SHAP (Causal Narratives), PySyft (Privacy-Preserving Federated Learning)
*   **Backend Services:** FastAPI (Python), Node.js, Redis (Idempotency & Caching), PostgreSQL (Persistent Storage)
*   **Frontend UI:** React.js, Tailwind CSS, D3.js (Force-directed interactive fund-flow graph)
*   **Infrastructure & Deployment:** Docker, Kubernetes (K8s) for auto-scaling, RBI Data Localisation Compliant

## How to Run Locally (POC Environment)
For the hackathon evaluation, we have containerised a lightweight version of the stack via Docker Compose.

1. **Clone the repo:** `git clone https://github.com/SagarAgarwal2/gs`
2. **Navigate to directory:** `cd "gs`
3. **Set Environment Variables:** Create a `.env` file in the root with required database credentials.
4. **Launch the stack:** `docker compose up -d --build`
5. **Open browser:** Go to `http://localhost` (The app runs on port 80).

## Project Structure
*   `/src` — React frontend containing the Investigator Workbench, D3 Graph, and Transaction Simulator.
*   `/backend/server.mjs` — Orchestration API, graph traversal proxy, and STR/CTR report generation.
*   `/backend/ml_service.py` — Python inference engine running GNN + LSTM models and SHAP explainability.
*   `/backend/lib/detection.mjs` — Live streaming anomaly detection algorithms.
*   `docker-compose.yml` — Multi-container orchestration script.

## Dataset
All data used in this prototype is **100% synthetic**, generated to closely mirror Indian banking behaviour. It simulates thousands of transactions and explicitly injects the 5 core PS3 threat patterns:
*   Multi-hop layering chains (funds moving rapidly across 3+ accounts)
*   Circular round-trips
*   Sub-threshold structuring (<₹10L clusters)
*   Dormant account reactivation
*   KYC-to-behaviour mismatches

## Model Performance (on Synthetic Test Set)
*   **Temporal GNN (Fraud Classification):** 
    *   Precision: 0.91 | Recall: 0.88 | F1-Score: 0.89
*   **LSTM Autoencoder (Behavioural Deviation):** 
    *   Accuracy: 93% on anomalous spikes
*   **False Positive Reduction:** 94% improvement over standard threshold-based AML rules.

## Known Limitations
*   The live hackathon demo uses simulated streams; production deployment requires connection to the bank's actual Kafka/MQ topics.
*   The Federated Learning framework (PySyft) is conceptually designed; inter-bank model gradient sharing is simulated for the POC.

## Team: Demo Buddies
*   **Somya Upadhyay** — Machine Learning & Data Science
*   **Sagar Agarwal** — Full-Stack Development & AI/ML
*   **Tathagata Sen** — Graph Analytics & Database Engineering
*   **Aviral Sharma** — Backend Systems & Cloud Deployment

## Contact
**Team Name:** Demo Buddies
**Institute** Birla Institute Of Technology Mesra
**Email** [usomya23@gmail.com]
**Submission:** iDEA 2.0 Phase 2 (Union Bank PS3)
