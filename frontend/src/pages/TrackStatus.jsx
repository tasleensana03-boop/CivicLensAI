import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaCheckCircle, FaSpinner, FaClock, FaExclamationTriangle } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useLanguage } from "../LanguageProvider";
import { translate } from "../i18n";
import Footer from "../components/Footer";

/* ── Status config ── */
const STATUS_STEPS = ["Pending", "In Progress", "Resolved"];

const statusStyle = {
  Pending:      { color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.3)", icon: <FaClock />         },
  "In Progress":{ color: "#facc15", bg: "rgba(250,204,21,0.1)",  border: "rgba(250,204,21,0.3)",  icon: <FaSpinner />       },
  Resolved:     { color: "#4ade80", bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.3)",  icon: <FaCheckCircle />   },
};

const severityColor = {
  Critical: "#f87171", High: "#fb923c", Medium: "#facc15", Low: "#4ade80",
};

const card = {
  borderRadius: "20px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(34,211,238,0.15)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
};

function TrackStatus() {
  const [inputId,  setInputId]  = useState("");
  const [report,   setReport]   = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const id = inputId.replace("#", "").trim();
    if (!id) return;

    setLoading(true);
    setError("");
    setReport(null);

    try {
      const res  = await fetch(`http://127.0.0.1:5000/reports/${id}`);
      const data = await res.json();
      if (data.status === "success") {
        setReport(data.report);
        setSelectedStatus(data.report.status || "Pending");
      } else {
        setError(data.message || "Report not found.");
      }
    } catch {
      setError(translate(language, "track.errorBackend"));
    }
    setLoading(false);
  };

  const updateStatus = async (id) => {
    if (!id) return;
    setUpdating(true);
    setError("");
    try {
      const res = await fetch(`http://127.0.0.1:5000/reports/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setReport((prev) => ({ ...prev, status: selectedStatus }));
      } else {
        setError(data.message || translate(language, "track.statusChangeError"));
      }
    } catch {
      setError("Cannot connect to backend. Make sure Flask is running on port 5000.");
    }
    setUpdating(false);
  };

  const currentStep = report ? STATUS_STEPS.indexOf(report.status) : -1;
  const { language } = useLanguage();

  return (
    <div style={{ minHeight: "100vh", width: "100%", backgroundColor: "#020617", color: "white" }}>
      <Navbar />

      <main style={{
        paddingTop: "120px", paddingBottom: "120px",
        paddingLeft: "clamp(16px, 4vw, 48px)",
        paddingRight: "clamp(16px, 4vw, 48px)",
      }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            style={{ textAlign: "center", marginBottom: "52px" }}
          >
            <p style={{ color: "#22d3ee", textTransform: "uppercase", letterSpacing: "0.25em", fontSize: "11px", fontWeight: 700, marginBottom: "16px" }}>
              {translate(language, "track.badge")}
            </p>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: "16px" }}>
              {translate(language, "track.title")}
            </h1>
            <p style={{ color: "#64748b", fontSize: "15px", lineHeight: 1.7, maxWidth: "440px", margin: "0 auto" }}>
              {translate(language, "track.subtitle")}
            </p>
          </motion.div>

          {/* ── Search Box ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ ...card, padding: "32px", marginBottom: "32px" }}
          >
            <form onSubmit={handleSearch}>
              <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", fontWeight: 500, marginBottom: "12px" }}>
                {translate(language, "track.reportId")}
              </label>
              <div style={{ display: "flex", gap: "12px" }}>
                <input
                  type="text"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  placeholder={translate(language, "track.placeholder")}
                  style={{
                    flex: 1, padding: "14px 18px", borderRadius: "12px",
                    background: "rgba(2,6,23,0.7)",
                    border: "1px solid rgba(34,211,238,0.2)",
                    color: "white", fontSize: "15px", outline: "none",
                    fontFamily: "monospace",
                  }}
                />
                <button
                  type="submit"
                  disabled={loading || !inputId.trim()}
                  style={{
                    padding: "14px 28px", borderRadius: "12px",
                    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                    border: "none", color: "white", fontWeight: 700,
                    fontSize: "15px", cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    display: "flex", alignItems: "center", gap: "8px",
                    transition: "opacity 0.2s",
                  }}
                >
                  {loading
                    ? <><FaSpinner style={{ animation: "spin 1s linear infinite" }} /> {translate(language, "track.searching")}</>
                    : <><FaSearch /> {translate(language, "track.trackButton")}</>
                  }
                </button>
              </div>
            </form>
          </motion.div>

          {/* ── Error ── */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              style={{
                ...card, padding: "20px 24px", marginBottom: "24px",
                background: "rgba(248,113,113,0.06)",
                border: "1px solid rgba(248,113,113,0.25)",
                display: "flex", alignItems: "center", gap: "12px",
              }}
            >
              <FaExclamationTriangle style={{ color: "#f87171", flexShrink: 0 }} />
              <p style={{ color: "#fca5a5", fontSize: "14px" }}>{error}</p>
            </motion.div>
          )}

          {/* ── Report Card ── */}
          <AnimatePresence>
            {report && (
              <motion.div
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
              >
                {/* Status Banner */}
                <div style={{
                  ...card,
                  padding: "24px 28px",
                  marginBottom: "20px",
                  background: statusStyle[report.status]?.bg || "rgba(255,255,255,0.03)",
                  border: `1px solid ${statusStyle[report.status]?.border || "rgba(34,211,238,0.15)"}`,
                  display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      height: "48px", width: "48px", borderRadius: "14px",
                      background: "rgba(2,6,23,0.5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "20px", color: statusStyle[report.status]?.color,
                    }}>
                      {statusStyle[report.status]?.icon}
                    </div>
                    <div>
                      <p style={{ color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>Current Status</p>
                      <p style={{ color: statusStyle[report.status]?.color, fontSize: "20px", fontWeight: 800 }}>
                        {report.status}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#64748b", fontSize: "12px", marginBottom: "4px" }}>Report ID</p>
                    <p style={{ color: "#22d3ee", fontSize: "20px", fontWeight: 800, fontFamily: "monospace" }}>
                      #{report.id}
                    </p>
                  </div>
                </div>

                {/* ── Progress Timeline ── */}
                <div style={{ ...card, padding: "28px", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#94a3b8", marginBottom: "24px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Progress Timeline
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                    {STATUS_STEPS.map((step, i) => {
                      const done    = i <= currentStep;
                      const active  = i === currentStep;
                      const isLast  = i === STATUS_STEPS.length - 1;
                      return (
                        <div key={step} style={{ display: "flex", alignItems: "center", flex: isLast ? 0 : 1 }}>
                          {/* Circle */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                            <div style={{
                              height: "40px", width: "40px", borderRadius: "50%",
                              background: done ? (active ? "linear-gradient(135deg,#06b6d4,#3b82f6)" : "rgba(34,211,238,0.15)") : "rgba(255,255,255,0.05)",
                              border: done ? "2px solid #22d3ee" : "2px solid rgba(255,255,255,0.1)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "16px",
                              boxShadow: active ? "0 0 16px rgba(34,211,238,0.4)" : "none",
                              transition: "all 0.3s",
                            }}>
                              {i === 0 ? "⏳" : i === 1 ? "🔧" : "✅"}
                            </div>
                            <p style={{
                              fontSize: "12px", fontWeight: active ? 700 : 400,
                              color: done ? "#22d3ee" : "#475569",
                              whiteSpace: "nowrap",
                            }}>
                              {step}
                            </p>
                          </div>
                          {/* Connector */}
                          {!isLast && (
                            <div style={{
                              flex: 1, height: "2px", margin: "0 8px", marginBottom: "22px",
                              background: i < currentStep
                                ? "linear-gradient(90deg,#22d3ee,#3b82f6)"
                                : "rgba(255,255,255,0.08)",
                              transition: "background 0.3s",
                            }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Report Details ── */}
                <div style={{ ...card, padding: "28px", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "20px" }}>📋 Report Details</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                    {[
                      ["Category",   report.category   || "—"],
                      ["Severity",   report.severity   || "—"],
                      ["Department", report.department || "—"],
                      ["Location",   report.location   || "—"],
                      ["Submitted",  report.created_at
                        ? new Date(report.created_at + "Z").toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
                        : "—"],
                    ].map(([label, value]) => (
                      <div key={label} style={{ background: "rgba(2,6,23,0.5)", borderRadius: "12px", padding: "14px 16px" }}>
                        <p style={{ color: "#475569", fontSize: "11px", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
                        <p style={{
                          color: label === "Severity" ? (severityColor[value] || "#e2e8f0") : "#e2e8f0",
                          fontSize: "13px", fontWeight: 600,
                        }}>
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <div style={{ background: "rgba(2,6,23,0.5)", borderRadius: "12px", padding: "16px" }}>
                    <p style={{ color: "#475569", fontSize: "11px", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Description</p>
                    <p style={{ color: "#cbd5e1", fontSize: "14px", lineHeight: 1.7 }}>{report.description}</p>
                  </div>
                </div>

                {/* ── Status Update ── */}
                <div style={{ ...card, padding: "20px 28px", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "12px" }}>{translate(language, "track.statusUpdate")}</h3>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "10px",
                        background: "rgba(2,6,23,0.7)",
                        border: "1px solid rgba(34,211,238,0.12)",
                        color: "white",
                        fontSize: "14px",
                      }}
                    >
                      {STATUS_STEPS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => updateStatus(report.id)}
                      disabled={updating || selectedStatus === report.status}
                      style={{
                        padding: "10px 16px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                        border: "none",
                        color: "white",
                        fontWeight: 700,
                        cursor: updating ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {updating ? <><FaSpinner style={{ animation: "spin 1s linear infinite" }} /> {translate(language, "track.updating")}</> : translate(language, "track.updateButton")}
                    </button>
                  </div>
                </div>

                {/* ── AI Analysis ── */}
                {report.analysis && (
                  <div style={{ ...card, padding: "28px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "20px", color: "#22d3ee" }}>
                      🤖 AI Analysis
                    </h3>
                    <div style={{ borderRadius: "12px", background: "rgba(2,6,23,0.7)", border: "1px solid rgba(34,211,238,0.1)", padding: "24px" }}>
                      <pre style={{ whiteSpace: "pre-wrap", fontSize: "13px", color: "#e2e8f0", lineHeight: "1.9", fontFamily: "inherit", margin: 0 }}>
                        {report.analysis}
                      </pre>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      <Footer />
    </div>
  );
}

export default TrackStatus;
