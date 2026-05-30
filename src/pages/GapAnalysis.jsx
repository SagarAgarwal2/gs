import { useState } from "react";

const gapData = [
  {
    category: "Data Ingestion Layer",
    icon: "📡",
    presented: "Apache Kafka + Apache Flink — real-time stream processing at 10M+ txns/day",
    actual: "HTTP POST endpoint (/api/analyze) on a Node.js server. No Kafka, no Flink, no stream processing.",
    severity: "critical",
    slideRef: "Slides 4, 5, 9",
    impact: "The entire scalability narrative on Slide 9 (Kafka async queuing, stateful streaming, sub-graph inference at 10M+ txns) collapses. The actual system is a request-response HTTP API, not a streaming system.",
    fix: "Replace Kafka/Flink in Slide 5 with 'Node.js REST API (prototype); Kafka/Flink targeted for production'. Add a clear 'Prototype vs. Production' distinction row to the tech stack table."
  },
  {
    category: "Graph Database",
    icon: "🗄️",
    presented: "Neo4j / TigerGraph — property graph with Cypher queries",
    actual: "Supabase PostgreSQL — a standard relational database. No graph DB is used anywhere in the codebase.",
    severity: "critical",
    slideRef: "Slides 4, 5",
    impact: "The graph query capabilities claimed (Cypher, property graph traversals, multi-hop path queries) do not exist in the prototype. Adjacency matrices are constructed in Python from SQL queries. A judge who asks for a Neo4j demo will find nothing.",
    fix: "Slide 5 must read: 'Graph DB (prototype): PostgreSQL via Supabase + adjacency matrix construction in Python. Production target: Neo4j / TigerGraph.' This is honest and still credible."
  },
  {
    category: "Graph ML Framework",
    icon: "🧠",
    presented: "PyTorch Geometric — EvolveGCN, GAT, GraphSAGE (three architectures)",
    actual: "TensorFlow — EvolveGCN only. GAT and GraphSAGE are not implemented. PyTorch Geometric is not used anywhere.",
    severity: "critical",
    slideRef: "Slide 5",
    impact: "Three GNN architectures were presented as an ensemble. Only one is implemented, in a different framework entirely. The multi-architecture ensemble claim is unsubstantiated.",
    fix: "Update to 'TensorFlow — EvolveGCN (implemented). GAT and GraphSAGE: roadmap.' Remove PyTorch Geometric from the stack."
  },
  {
    category: "Backend API",
    icon: "⚙️",
    presented: "FastAPI (Python) + Redis cache + PostgreSQL",
    actual: "Node.js (server.mjs) + Supabase PostgreSQL. No FastAPI, no Redis anywhere in the README or architecture diagram.",
    severity: "high",
    slideRef: "Slide 5",
    impact: "The entire backend is a different language and framework from what's presented. Redis caching (a key component of the scalability slide) is absent.",
    fix: "Update to: 'Node.js API Server (Express) + Python ML microservice (TensorFlow). Supabase PostgreSQL. Redis: production roadmap.'"
  },
  {
    category: "Explainability (SHAP)",
    icon: "🔍",
    presented: "SHAP — generates plain-English causal narratives for every alert",
    actual: "'SHAP-inspired narratives' — custom quantitative risk factor breakdowns. Actual SHAP library is not used; the XAI module mimics SHAP output without the mathematical guarantees SHAP provides.",
    severity: "high",
    slideRef: "Slides 3, 4, 5, 7",
    impact: "SHAP is a specific, mathematically grounded attribution method (Shapley values). 'SHAP-inspired' is custom logic. Claiming SHAP when not using it is technically inaccurate and will be challenged by ML-literate judges.",
    fix: "Replace 'SHAP' with 'XAI narrative engine (SHAP-inspired, risk factor decomposition)'. This is accurate and still compelling."
  },
  {
    category: "Federated Learning",
    icon: "🌐",
    presented: "PySyft / Flower — gradient-only privacy-preserving GNN, differential privacy noise, fully implemented across PSB nodes",
    actual: "'Architecture prepared for distributed intelligence sharing across federated nodes.' — Not implemented. No PySyft, no Flower, no differential privacy in the codebase.",
    severity: "critical",
    slideRef: "Slides 3, 5, 6, 8",
    impact: "Federated GNN is the KEY INNOVATION claim on Slide 3. The entire competitive moat, the business model's cross-PSB network effect, and the privacy argument rest on this. It is architecturally planned but not built.",
    fix: "Federated learning must be clearly labelled as 'Phase 5 Roadmap — not in prototype'. The KEY INNOVATION banner should be reworded: 'Designed for federated GNN — privacy-preserving architecture with gradient-only sharing [roadmap]'."
  },
  {
    category: "Deployment Infrastructure",
    icon: "☁️",
    presented: "Docker + Kubernetes — RBI data localisation compliant",
    actual: "npm run build → Vercel/Netlify (frontend). Render/Heroku (Node.js backend). Basic PaaS deployment. No Docker Compose file mentioned, no Kubernetes config, no RBI compliance validation.",
    severity: "high",
    slideRef: "Slides 5, 9",
    impact: "Kubernetes and Docker are the basis for the entire Scalability slide's horizontal scaling, elastic autoscaling, and load balancing claims. The actual deployment is a standard PaaS stack.",
    fix: "Update Slide 5 to 'Deployment (prototype): Vercel + Render PaaS. Production: Docker + Kubernetes.' Add a Dockerfile to the codebase before presentation day."
  },
  {
    category: "Behavioral ML (LSTM)",
    icon: "📊",
    presented: "TensorFlow LSTM Autoencoder — 12-month transaction sequences, customer behavioral profiling",
    actual: "LSTM network (NOT an autoencoder). Sequence length is configurable, not specified as 12 months. No mention of 12-month history requirement in README or architecture.",
    severity: "medium",
    slideRef: "Slides 4, 5",
    impact: "Autoencoder has a specific architectural meaning (encoder-decoder, reconstruction loss). A plain LSTM classifier/regressor is different. The '12-month' specificity also overstates what the prototype establishes.",
    fix: "Change to 'LSTM sequence model (configurable window)'. Mention 12-month as the production target, not current prototype spec."
  },
  {
    category: "Cycle Detection Method",
    icon: "🔄",
    presented: "DFS-based cycle detection on sliding 6-hour windows (Layer 2)",
    actual: "Rule-based heuristics engine: 'Circular Round-Trips (≥ 75% recovery)'. The detection is threshold-based, not a graph traversal DFS algorithm.",
    severity: "medium",
    slideRef: "Slide 4",
    impact: "DFS cycle detection on a live graph is a real algorithmic claim that implies graph traversal infrastructure. The actual implementation is a ratio threshold rule. These are different things.",
    fix: "Slide 4 Layer 2: Distinguish 'Rule engine: ratio-threshold round-trip detection (≥75% recovery)' from 'ML: EvolveGCN temporal pattern scoring'."
  },
  {
    category: "Real-Time Processing Latency",
    icon: "⚡",
    presented: "< 2500ms graph update (Slide 4), < 800ms alert latency (Slide 6), 90-second SLA (Slide 5), sub-second (Slide 7)",
    actual: "HTTP POST /api/analyze is a synchronous request with no stated latency benchmark in README. No performance testing results documented.",
    severity: "high",
    slideRef: "Slides 4, 5, 6, 7",
    impact: "Four different latency figures across four slides, none of them measured against the actual prototype. If a judge asks 'what was your measured inference time?', there is no answer.",
    fix: "Run a simple benchmark: time the /api/analyze endpoint with the synthetic dataset. Report the actual measured figure (even if it's 3 seconds — prototype latency is acceptable). Add 'Prototype measured / Production target' distinction."
  },
  {
    category: "goAML Integration",
    icon: "📋",
    presented: "goAML API — auto STR/CTR XML package generation with FIU-IND live integration",
    actual: "goAML XML format generation (curl -X POST /api/reports/generate). This is local XML file generation in the correct schema — NOT a live FIU-IND API connection.",
    severity: "medium",
    slideRef: "Slides 3, 5, 8",
    impact: "Slide 3 claims '4 hours → 10 minutes' via the FIU report pipeline. The report generation IS implemented (this is a genuine strength) but it's XML file output, not a live FIU API call. Distinction matters for compliance.",
    fix: "Reword to 'Auto-generates FIU-IND compliant STR/CTR packages in goAML XML format, ready for manual or API submission.' This is accurate and still impressive."
  },
  {
    category: "What IS genuinely built ✅",
    icon: "✅",
    presented: "–",
    actual: "React 18 + TypeScript frontend with D3.js fund-flow graph. Node.js REST API with Supabase integration. Python TensorFlow ML service with EvolveGCN + LSTM. Rule-based heuristics for all 5 fraud types with precise thresholds. SHAP-inspired XAI narrative generation. goAML XML report generation. Investigator feedback → retraining loop. Supabase schema + seed migrations for demo. Multi-service orchestration (npm run start:all).",
    severity: "positive",
    slideRef: "All slides",
    impact: "The prototype is genuinely functional and covers the full detection → explain → report pipeline. This is a strong hackathon deliverable. The problem is the presentation claims production-grade infrastructure around a working prototype.",
    fix: "Lead with what's built. Add a 'Prototype Status' slide showing which components are live vs. roadmap. Honesty about prototype scope is respected by technical judges."
  }
];

const severityConfig = {
  critical: { color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", label: "CRITICAL GAP", icon: "🚨" },
  high: { color: "#d97706", bg: "#fffbeb", border: "#fcd34d", label: "SIGNIFICANT GAP", icon: "⚠️" },
  medium: { color: "#2563eb", bg: "#eff6ff", border: "#93c5fd", label: "NOTABLE GAP", icon: "📌" },
  positive: { color: "#16a34a", bg: "#f0fdf4", border: "#86efac", label: "GENUINE STRENGTH", icon: "✅" }
};

const summaryStats = {
  critical: gapData.filter(g => g.severity === "critical").length,
  high: gapData.filter(g => g.severity === "high").length,
  medium: gapData.filter(g => g.severity === "medium").length,
};

function GapCard({ item, expanded, onToggle }) {
  const sev = severityConfig[item.severity];
  return (
    <div style={{
      border: `1.5px solid ${sev.border}`,
      borderLeft: `5px solid ${sev.color}`,
      borderRadius: 12,
      background: sev.bg,
      marginBottom: 14,
      overflow: "hidden",
      transition: "box-shadow 0.2s"
    }}>
      <div
        onClick={onToggle}
        style={{ padding: "16px 20px", cursor: "pointer", display: "flex", gap: 14, alignItems: "flex-start" }}
      >
        <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{item.category}</h3>
            <span style={{
              background: sev.color, color: "#fff",
              fontSize: 9, fontWeight: 800, padding: "2px 9px",
              borderRadius: 4, letterSpacing: "0.1em"
            }}>{sev.label}</span>
            <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: "auto" }}>{item.slideRef}</span>
          </div>
          {!expanded && (
            <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "#475569", lineHeight: 1.5 }}>
              {item.actual.substring(0, 110)}…
            </p>
          )}
        </div>
        <span style={{ fontSize: 18, color: sev.color, flexShrink: 0 }}>{expanded ? "▲" : "▼"}</span>
      </div>

      {expanded && (
        <div style={{ padding: "0 20px 20px 20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div style={{ background: "#fff3f3", border: "1px solid #fca5a5", borderRadius: 8, padding: "12px 16px" }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#dc2626", letterSpacing: "0.12em", marginBottom: 6 }}>
                📊 PRESENTED TO JUDGES
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "#1e293b", lineHeight: 1.6 }}>{item.presented}</p>
            </div>
            <div style={{ background: "#f0f9ff", border: "1px solid #7dd3fc", borderRadius: 8, padding: "12px 16px" }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#0369a1", letterSpacing: "0.12em", marginBottom: 6 }}>
                💻 ACTUAL IN README / CODEBASE
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "#1e293b", lineHeight: 1.6 }}>{item.actual}</p>
            </div>
          </div>

          <div style={{ background: "#1e293b", borderRadius: 8, padding: "12px 16px", marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#f59e0b", letterSpacing: "0.12em", marginBottom: 6 }}>
              ⚡ JUDGE IMPACT
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#e2e8f0", lineHeight: 1.6 }}>{item.impact}</p>
          </div>

          <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "12px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#16a34a", letterSpacing: "0.12em", marginBottom: 6 }}>
              🛠️ RECOMMENDED FIX
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "#1e293b", lineHeight: 1.6 }}>{item.fix}</p>
          </div>
        </div>
      )}
    </div>
  );
}

const techStackCorrection = [
  { component: "Data Ingestion", presented: "Apache Kafka + Flink", actual: "Node.js HTTP POST /api/analyze", status: "overstate" },
  { component: "Graph Database", presented: "Neo4j / TigerGraph", actual: "Supabase PostgreSQL", status: "overstate" },
  { component: "Graph ML", presented: "PyTorch Geometric (EvolveGCN + GAT + GraphSAGE)", actual: "TensorFlow (EvolveGCN only)", status: "overstate" },
  { component: "Behavioral ML", presented: "LSTM Autoencoder", actual: "LSTM network (not autoencoder)", status: "minor" },
  { component: "Explainability", presented: "SHAP", actual: "SHAP-inspired custom engine", status: "minor" },
  { component: "Federated Learning", presented: "PySyft / Flower (implemented)", actual: "Architecture planned — not built", status: "overstate" },
  { component: "Backend API", presented: "FastAPI (Python)", actual: "Node.js (server.mjs)", status: "overstate" },
  { component: "Cache", presented: "Redis", actual: "Not present", status: "overstate" },
  { component: "Deployment", presented: "Docker + Kubernetes", actual: "Vercel + Render PaaS", status: "overstate" },
  { component: "FIU Integration", presented: "goAML API (live)", actual: "goAML XML file generation ✓", status: "accurate" },
  { component: "Frontend", presented: "React.js + D3.js", actual: "React 18 + TypeScript + D3.js ✓", status: "accurate" },
  { component: "Rule Engine", presented: "5 fraud heuristics", actual: "5 heuristics with precise thresholds ✓", status: "accurate" },
];

const statusConfig = {
  overstate: { color: "#dc2626", bg: "#fef2f2", label: "⚠ Overstated" },
  minor: { color: "#d97706", bg: "#fffbeb", label: "~ Inaccurate" },
  accurate: { color: "#16a34a", bg: "#f0fdf4", label: "✓ Accurate" },
};

export default function App() {
  const [expanded, setExpanded] = useState(null);
  const [activeTab, setActiveTab] = useState("gaps");

  return (
    <div style={{
      fontFamily: "'Georgia', serif",
      background: "#f8fafc",
      minHeight: "100vh",
      color: "#1a1a2e"
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        padding: "24px 32px",
        borderBottom: "3px solid #dc2626"
      }}>
        <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: "0.15em", fontFamily: "monospace", marginBottom: 6 }}>
          GRAPHSENTINEL · README ↔ PRESENTATION · CROSS-REFERENCE AUDIT
        </div>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: "#fff" }}>
          Implementation Reality Check
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 13, color: "#94a3b8", maxWidth: 600 }}>
          The README reveals significant gaps between what the slides claim and what's actually built.
          This audit maps every discrepancy so they can be corrected before judging.
        </p>

        <div style={{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
          {[
            { label: "Critical Gaps", val: summaryStats.critical, color: "#dc2626" },
            { label: "Significant Gaps", val: summaryStats.high, color: "#d97706" },
            { label: "Notable Gaps", val: summaryStats.medium, color: "#2563eb" },
            { label: "Overstated Tech Claims", val: techStackCorrection.filter(t => t.status === "overstate").length, color: "#7c3aed" },
            { label: "Accurate Claims", val: techStackCorrection.filter(t => t.status === "accurate").length, color: "#16a34a" },
          ].map(stat => (
            <div key={stat.label} style={{
              background: "rgba(255,255,255,0.08)", borderRadius: 10,
              padding: "10px 20px", textAlign: "center",
              border: `1px solid ${stat.color}55`
            }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: stat.color }}>{stat.val}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", letterSpacing: "0.08em" }}>{stat.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Banner */}
      <div style={{
        background: "#fef2f2", borderBottom: "2px solid #fca5a5",
        padding: "14px 32px", display: "flex", gap: 12, alignItems: "center"
      }}>
        <span style={{ fontSize: 20 }}>🚨</span>
        <div>
          <strong style={{ color: "#dc2626", fontSize: 13 }}>Primary Risk: </strong>
          <span style={{ fontSize: 13, color: "#7f1d1d" }}>
            The presentation describes a production-grade distributed system (Kafka, Neo4j, PyTorch Geometric, PySyft, Kubernetes).
            The README describes a working prototype (Node.js, PostgreSQL, TensorFlow, PaaS deployment).
            Both are good — but presenting the prototype as the full system is a credibility risk when judges request a live demo.
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #e5e7eb", background: "#fff", padding: "0 32px" }}>
        {[
          { id: "gaps", label: "📋 Gap-by-Gap Analysis" },
          { id: "stack", label: "🔧 Tech Stack Correction Table" },
          { id: "action", label: "⚡ Priority Action Plan" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: "14px 22px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700,
            background: "transparent",
            color: activeTab === tab.id ? "#1d4ed8" : "#64748b",
            borderBottom: activeTab === tab.id ? "3px solid #1d4ed8" : "3px solid transparent",
            transition: "all 0.15s"
          }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>
        {/* Gap Analysis Tab */}
        {activeTab === "gaps" && (
          <div>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
              Click any card to expand full details: what was presented, what the README shows, judge impact, and the recommended fix.
            </p>
            {gapData.map((item, i) => (
              <GapCard
                key={i} item={item}
                expanded={expanded === i}
                onToggle={() => setExpanded(expanded === i ? null : i)}
              />
            ))}
          </div>
        )}

        {/* Tech Stack Table */}
        {activeTab === "stack" && (
          <div>
            <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
              Side-by-side comparison of every technology mentioned in the presentation vs. what the README and architecture diagram actually shows.
            </p>
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>
              <div style={{
                display: "grid", gridTemplateColumns: "180px 1fr 1fr 130px",
                background: "#0f172a", padding: "12px 20px", gap: 16
              }}>
                {["Component", "Presented on Slides", "Actual (README)", "Status"].map(h => (
                  <div key={h} style={{ fontSize: 11, fontWeight: 800, color: "#94a3b8", letterSpacing: "0.1em" }}>{h.toUpperCase()}</div>
                ))}
              </div>
              {techStackCorrection.map((row, i) => {
                const st = statusConfig[row.status];
                return (
                  <div key={i} style={{
                    display: "grid", gridTemplateColumns: "180px 1fr 1fr 130px",
                    padding: "13px 20px", gap: 16,
                    background: i % 2 === 0 ? "#fff" : "#f8fafc",
                    borderBottom: "1px solid #f1f5f9",
                    alignItems: "center"
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{row.component}</div>
                    <div style={{ fontSize: 12.5, color: "#374151" }}>{row.presented}</div>
                    <div style={{ fontSize: 12.5, color: "#374151" }}>{row.actual}</div>
                    <div style={{
                      fontSize: 11, fontWeight: 700, color: st.color, background: st.bg,
                      borderRadius: 6, padding: "4px 10px", textAlign: "center"
                    }}>{st.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Plan Tab */}
        {activeTab === "action" && (
          <div>
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "24px 28px", marginBottom: 20 }}>
              <h2 style={{ margin: "0 0 16px", fontSize: 17, fontWeight: 900, color: "#0f172a" }}>
                🎯 The Single Biggest Fix
              </h2>
              <div style={{ background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 10, padding: "16px 20px" }}>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#1c1917" }}>
                  Add a <strong>"Prototype vs. Production Architecture"</strong> two-column slide immediately after the Tech Stack slide.
                  Left column: <em>what is built and demoed today</em> (Node.js, PostgreSQL, TensorFlow, Vercel).
                  Right column: <em>production target</em> (Kafka, Neo4j, PyTorch Geometric, Kubernetes, PySyft).
                  This single slide eliminates ALL credibility risk from the stack discrepancies and actually demonstrates maturity in thinking.
                </p>
              </div>
            </div>

            {[
              {
                priority: "Before Demo Day (Non-negotiable)",
                color: "#dc2626",
                items: [
                  "Add 'Prototype vs Production' slide to Technical Approach — resolves 6 of the 7 critical gaps in one move.",
                  "Remove 'PySyft / Flower' from Slide 5 tech stack. Replace with 'Federated Learning: roadmap (PySyft/Flower target)'.",
                  "Change 'Apache Kafka, Apache Flink' to 'REST API (prototype) → Kafka/Flink (production target)'.",
                  "Change 'Neo4j / TigerGraph' to 'PostgreSQL (prototype) → Neo4j (production target)'.",
                  "Change 'SHAP' to 'SHAP-inspired XAI narrative engine' — prevents technically literate judges from calling it out.",
                  "Fix the ₹36,014 Cr (RBI FY25) vs ₹1.28L Cr (EY 2023) figure contradiction — these are on consecutive slides.",
                  "Run and record a latency benchmark on /api/analyze with your synthetic dataset. Use the real number.",
                ]
              },
              {
                priority: "Before Final Submission (Strongly Recommended)",
                color: "#d97706",
                items: [
                  "Replace Slide 11 (screenshots) with a prototype results slide: precision, recall, F1 per fraud type on synthetic test set.",
                  "Add 'FastAPI (Python)' to the README as a production API target, or remove it from Slide 5.",
                  "Add a Dockerfile to the repo — even a basic one legitimizes the Docker claim.",
                  "Label all quantitative impact claims (94% FP reduction, 3× productivity) as 'projected' with a source note.",
                  "Remove GAT and GraphSAGE from Slide 5 or explicitly mark them as 'model candidates for v2'.",
                ]
              },
              {
                priority: "Nice-to-Have Improvements",
                color: "#2563eb",
                items: [
                  "Replace Chen et al. (SimCLR) in references with a financial contrastive learning paper.",
                  "Add arXiv DOI links to all academic references.",
                  "Rebuild Slide 9 (Scalability) as an architecture diagram rather than 7 text blocks.",
                  "Add actual measured inference time to the latency claims footnote.",
                  "Define 'validated catch' in the RaI business model pricing section.",
                ]
              }
            ].map((section, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 12,
                border: `1px solid ${section.color}44`,
                borderLeft: `4px solid ${section.color}`,
                padding: "20px 24px", marginBottom: 16
              }}>
                <h3 style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 800, color: section.color }}>
                  {section.priority}
                </h3>
                {section.items.map((item, j) => (
                  <div key={j} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
                    <span style={{
                      background: section.color, color: "#fff", borderRadius: "50%",
                      width: 22, height: 22, display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0
                    }}>{j + 1}</span>
                    <p style={{ margin: 0, fontSize: 13.5, color: "#1e293b", lineHeight: 1.6 }}>{item}</p>
                  </div>
                ))}
              </div>
            ))}

            <div style={{
              background: "#0f172a", borderRadius: 12, padding: "20px 24px", marginTop: 8
            }}>
              <h3 style={{ margin: "0 0 10px", color: "#f0fdf4", fontSize: 14, fontWeight: 800 }}>
                💚 What You Should Be Proud Of
              </h3>
              <p style={{ margin: 0, fontSize: 13.5, color: "#94a3b8", lineHeight: 1.8 }}>
                The prototype is <strong style={{ color: "#86efac" }}>genuinely impressive for a hackathon</strong>: a full-stack system with React + D3.js visualization, a working Node.js + Python microservice architecture, a TensorFlow EvolveGCN+LSTM model, rule-based heuristics covering all 5 fraud types with precise thresholds, goAML XML generation, and an investigator feedback→retrain loop.
                That is a real, working, end-to-end prototype. <strong style={{ color: "#86efac" }}>Presenting it honestly</strong> — as a prototype with a clearly articulated production roadmap — is far more credible to technical judges than overclaiming a distributed system that doesn't exist yet.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
