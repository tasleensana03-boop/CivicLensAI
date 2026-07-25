import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaCheckCircle, FaSpinner, FaClock, FaExclamationTriangle,
  FaGithub, FaLinkedin, FaSync,
} from "react-icons/fa";
import Navbar from "../components/Navbar";

// ── Helpers ────────────────────────────────────────────────
const severityColor = {
  Critical: "#f87171", High: "#fb923c", Medium: "#facc15", Low: "#4ade80",
};

const statusStyle = {
  Resolved:     { color: "#4ade80", bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.3)",  icon: <FaCheckCircle /> },
  "In Progress":{ color: "#facc15", bg: "rgba(250,204,21,0.1)",  border: "rgba(250,204,21,0.3)",  icon: <FaSpinner />    },
  Pending:      { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", icon: <FaClock />      },
};

const card = {
  borderRadius: "16px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(34,211,238,0.15)",
  backdropFilter: "blur(16px)",
  padding: "24px",
  boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
};

// Category color palette
const CAT_COLORS = [
  "#22d3ee", "#f97316", "#3b82f6", "#facc15",
  "#22c55e", "#a855f7", "#f87171", "#fb923c",
];

function Dashboard() {
  const [stats,      setStats]      = useState({ total: 0, resolved: 0, in_progress: 0, pending: 0 });
  const [categories, setCategories] = useState({});
  const [reports,    setReports]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("http://127.0.0.1:5000/reports");
      const data = await res.json();
      if (data.status === "success") {
        setStats(data.stats);
        setCategories(data.categories);
        setReports(data.reports);
      }
    } catch {
      setError("Cannot connect to backend. Make sure Flask is running on port 5000.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // ── Category bar data ──────────────────────────────────
  const catEntries = Object.entries(categories).sort((a, b) => b[1] - a[1]);
  const maxCat     = catEntries[0]?.[1] || 1;

  // ── Donut percentages ──────────────────────────────────
  const total      = stats.total || 1;
  const resolvedPct   = Math.round((stats.resolved    / total) * 100);
  const inProgPct     = Math.round((stats.in_progress / total) * 100);
  const pendingPct    = Math.round(((stats.pending || (total - stats.resolved - stats.in_progress)) / total) * 100);

  return (
    <div style={{ minHeight: "100vh", width: "100%", backgroundColor: "#020617", color: "white" }}>
      <Navbar />

      <main style={{ paddingTop: "120px", paddingBottom: "80px", paddingLeft: "24px", paddingRight: "24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

          {/* ── Header ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ marginBottom: "36px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ color: "#22d3ee", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "11px", fontWeight: 600, marginBottom: "8px" }}>
                Analytics Overview
              </p>
              <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 800, marginBottom: "6px" }}>
                Civic Issue <span style={{ color: "#22d3ee" }}>Dashboard</span>
              </h1>
              <p style={{ color: "#64748b", fontSize: "14px" }}>
                {loading ? "Loading..." : error ? "⚠ Connection error" : `${stats.total} total reports submitted`}
              </p>
            </div>

            {/* Refresh + Report buttons */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={fetchData} style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "10px 16px", borderRadius: "10px",
                background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.2)",
                color: "#22d3ee", fontSize: "13px", fontWeight: 500, cursor: "pointer",
              }}>
                <FaSync style={{ fontSize: "11px" }} /> Refresh
              </button>
              <Link to="/report" style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "10px 16px", borderRadius: "10px",
                background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                color: "white", fontSize: "13px", fontWeight: 600, textDecoration: "none",
              }}>
                + New Report
              </Link>
            </div>
          </motion.div>

          {/* ── Error state ── */}
          {error && (
            <div style={{
              ...card, marginBottom: "24px",
              background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.3)",
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              <FaExclamationTriangle style={{ color: "#f87171", flexShrink: 0 }} />
              <p style={{ color: "#fca5a5", fontSize: "14px" }}>{error}</p>
            </div>
          )}

          {/* ── Empty state ── */}
          {!loading && !error && stats.total === 0 && (
            <div style={{ ...card, textAlign: "center", padding: "60px 24px", marginBottom: "24px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
              <h3 style={{ color: "white", fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>No Reports Yet</h3>
              <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>
                Submit your first civic issue report to see data here.
              </p>
              <Link to="/report" style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "12px 24px", borderRadius: "10px",
                background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                color: "white", fontWeight: 600, textDecoration: "none", fontSize: "14px",
              }}>
                🚀 Report an Issue
              </Link>
            </div>
          )}

          {/* ── Stats Cards ── */}
          {!error && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
                {[
                  { label: "Total Reports", value: stats.total,       icon: "📋", color: "#22d3ee",  bg: "rgba(34,211,238,0.1)"  },
                  { label: "Resolved",      value: stats.resolved,    icon: "✅", color: "#4ade80",  bg: "rgba(74,222,128,0.1)"  },
                  { label: "In Progress",   value: stats.in_progress, icon: "🔧", color: "#facc15",  bg: "rgba(250,204,21,0.1)"  },
                  { label: "Pending",       value: stats.pending || (stats.total - stats.resolved - stats.in_progress),
                    icon: "⏳", color: "#f87171", bg: "rgba(248,113,113,0.1)" },
                ].map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 + i * 0.08 }} style={card}>
                    <div style={{ height: "44px", width: "44px", borderRadius: "12px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", marginBottom: "12px" }}>
                      {s.icon}
                    </div>
                    <p style={{ fontSize: "28px", fontWeight: 800, color: s.color }}>
                      {loading ? "—" : s.value}
                    </p>
                    <p style={{ color: "#64748b", fontSize: "13px", marginTop: "4px" }}>{s.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* ── Category bars + Donut ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>

                {/* Category bars */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }} style={card}>
                  <h2 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "20px" }}>📊 Issues by Category</h2>

                  {catEntries.length === 0 ? (
                    <p style={{ color: "#475569", fontSize: "13px" }}>No data yet — submit a report to see categories.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      {catEntries.map(([cat, count], i) => (
                        <div key={cat}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={{ fontSize: "13px", color: "#e2e8f0" }}>{cat || "Other"}</span>
                            <span style={{ fontSize: "12px", color: "#64748b" }}>{count} reports</span>
                          </div>
                          <div style={{ height: "8px", width: "100%", borderRadius: "99px", background: "#1e293b", overflow: "hidden" }}>
                            <motion.div initial={{ width: 0 }}
                              animate={{ width: `${Math.round((count / maxCat) * 100)}%` }}
                              transition={{ duration: 0.8, delay: 0.3 }}
                              style={{ height: "100%", borderRadius: "99px", background: CAT_COLORS[i % CAT_COLORS.length] }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Donut */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                  style={{ ...card, display: "flex", flexDirection: "column" }}>
                  <h2 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "20px" }}>🎯 Resolution Summary</h2>

                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{
                        width: "176px", height: "176px", borderRadius: "50%",
                        background: `conic-gradient(
                          #22d3ee 0% ${resolvedPct}%,
                          #facc15 ${resolvedPct}% ${resolvedPct + inProgPct}%,
                          #f87171 ${resolvedPct + inProgPct}% 100%
                        )`,
                      }} />
                      <div style={{
                        position: "absolute", width: "112px", height: "112px", borderRadius: "50%",
                        background: "#0f172a", display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                      }}>
                        <p style={{ fontSize: "22px", fontWeight: 800, color: "#22d3ee" }}>
                          {stats.total === 0 ? "0%" : `${resolvedPct}%`}
                        </p>
                        <p style={{ fontSize: "11px", color: "#64748b" }}>Resolved</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "20px", flexWrap: "wrap" }}>
                    {[
                      ["#22d3ee", `Resolved (${resolvedPct}%)`],
                      ["#facc15", `In Progress (${inProgPct}%)`],
                      ["#f87171", `Pending (${pendingPct}%)`],
                    ].map(([color, label]) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
                        <span style={{ height: "10px", width: "10px", borderRadius: "50%", background: color, display: "inline-block" }} />
                        <span style={{ color: "#94a3b8" }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* ── Recent Reports Table ── */}
              {reports.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }} style={{ ...card, marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "15px", fontWeight: 700 }}>🗂️ Recent Reports</h2>
                    <span style={{ fontSize: "11px", color: "#475569" }}>
                      Showing latest {reports.length} of {stats.total}
                    </span>
                  </div>

                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #1e293b" }}>
                          {["ID", "Issue", "Category", "Location", "Severity", "Status", "Date"].map(h => (
                            <th key={h} style={{ textAlign: "left", paddingBottom: "12px", paddingRight: "16px", color: "#475569", fontWeight: 500 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((r, i) => (
                          <motion.tr key={r.id}
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.35 + i * 0.04 }}
                            style={{ borderBottom: "1px solid rgba(30,41,59,0.6)" }}>
                            <td style={{ padding: "14px 16px 14px 0", color: "#22d3ee", fontFamily: "monospace", fontWeight: 600 }}>
                              #{r.id}
                            </td>
                            <td style={{ padding: "14px 16px 14px 0", color: "#e2e8f0", maxWidth: "180px" }}>
                              <span title={r.description} style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {r.description}
                              </span>
                            </td>
                            <td style={{ padding: "14px 16px 14px 0", color: "#94a3b8" }}>{r.category || "—"}</td>
                            <td style={{ padding: "14px 16px 14px 0", color: "#64748b", maxWidth: "140px" }}>
                              <span title={r.location} style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {r.location || "—"}
                              </span>
                            </td>
                            <td style={{ padding: "14px 16px 14px 0" }}>
                              {r.severity ? (
                                <span style={{ padding: "3px 10px", borderRadius: "8px", background: `${severityColor[r.severity] || "#94a3b8"}20`, color: severityColor[r.severity] || "#94a3b8", fontSize: "12px", fontWeight: 600 }}>
                                  {r.severity}
                                </span>
                              ) : "—"}
                            </td>
                            <td style={{ padding: "14px 16px 14px 0" }}>
                              {statusStyle[r.status] ? (
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 10px", borderRadius: "8px", border: `1px solid ${statusStyle[r.status].border}`, background: statusStyle[r.status].bg, color: statusStyle[r.status].color, fontSize: "12px", fontWeight: 600 }}>
                                  {statusStyle[r.status].icon} {r.status}
                                </span>
                              ) : r.status}
                            </td>
                            <td style={{ padding: "14px 0 14px 0", color: "#475569", fontSize: "12px" }}>
                              {r.created_at ? new Date(r.created_at + "Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </>
          )}

        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ width: "100%", borderTop: "1px solid #0f172a", padding: "48px 24px", backgroundColor: "#020617" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "10px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 700, color: "white" }}>
            CivicLens <span style={{ color: "#22d3ee" }}>AI</span>
          </h2>
          <p style={{ color: "#64748b", fontSize: "13px" }}>AI-Powered Civic Issue Reporting System</p>
          <div style={{ display: "flex", gap: "20px", fontSize: "20px", margin: "6px 0" }}>
            <a href="https://github.com/tasleensana03-boop" target="_blank" rel="noreferrer" style={{ color: "#475569", textDecoration: "none" }}><FaGithub /></a>
            <a href="https://www.linkedin.com/in/tasleen-sana-8ab01a301" target="_blank" rel="noreferrer" style={{ color: "#475569", textDecoration: "none" }}><FaLinkedin /></a>
          </div>
          <p style={{ color: "#334155", fontSize: "12px" }}>© 2026 CivicLens AI. All rights reserved.</p>
          <p style={{ color: "#22d3ee", fontSize: "12px", fontWeight: 500 }}>Built with React • Flask • Gemini AI</p>
          <p style={{ color: "#475569", fontSize: "12px" }}>
            Designed & Developed by <span style={{ color: "#e2e8f0", fontWeight: 600 }}>Tasleen Sana</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
