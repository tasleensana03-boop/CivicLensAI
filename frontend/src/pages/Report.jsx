import { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa";

import Navbar from "../components/Navbar";
import UploadBox from "../components/UploadBox";
import DescriptionBox from "../components/DescriptionBox";
import LocationBox from "../components/LocationBox";
import AnalyzeButton from "../components/AnalyzeButton";
import LetterBox from "../components/LetterBox";

const card = {
  borderRadius: "20px",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(34,211,238,0.15)",
  backdropFilter: "blur(20px)",
  boxShadow: "0 4px 40px rgba(0,0,0,0.4)",
};

// Parse duplicate payload from the special marker
function parseDuplicate(report) {
  if (!report.startsWith("__DUPLICATE__")) return null;
  try { return JSON.parse(report.replace("__DUPLICATE__", "")); }
  catch { return null; }
}

function Report() {
  const [image,              setImage]              = useState(null);
  const [description,        setDescription]        = useState("");
  const [location,           setLocation]           = useState("");
  const [email,              setEmail]              = useState("");
  const [phone,              setPhone]              = useState("");
  const [submissionMessage,  setSubmissionMessage]  = useState("");
  const [report,             setReport]             = useState("");
  const [reportId,           setReportId]           = useState(null);
  const [loading,            setLoading]            = useState(false);

  const isDuplicate = report.startsWith("__DUPLICATE__");
  const duplicate   = parseDuplicate(report);

  const resetAll = () => {
    setReport(""); setImage(null); setDescription(""); setLocation(""); setEmail(""); setPhone(""); setReportId(null); setSubmissionMessage("");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#020617", color: "white", width: "100%" }}>
      <Navbar />

      <main style={{
        paddingTop: "100px",
        paddingBottom: "120px",
        paddingLeft: "clamp(16px, 4vw, 48px)",
        paddingRight: "clamp(16px, 4vw, 48px)",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            style={{ textAlign: "center", marginBottom: "64px" }}
          >
            <p style={{ color: "#22d3ee", textTransform: "uppercase", letterSpacing: "0.25em", fontSize: "11px", fontWeight: 700, marginBottom: "16px" }}>
              AI-Powered Analysis
            </p>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: "18px" }}>
              Report a <span style={{ color: "#22d3ee" }}>Civic Issue</span>
            </h1>
            <p style={{ color: "#94a3b8", maxWidth: "500px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.75, fontSize: "15px" }}>
              Upload a photo, describe the problem, share your location —
              and let Gemini AI generate a complete civic report instantly.
            </p>
          </motion.div>

          {/* ── Two Column Grid ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "stretch" }}>

            {/* LEFT — Upload */}
            <motion.div
              initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ ...card, padding: "28px 28px 20px 28px", display: "flex", flexDirection: "column" }}
            >
              <h2 style={{ fontSize: "15px", fontWeight: 600, color: "white", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                📸 Upload Image
                <span style={{ fontSize: "12px", color: "#475569", fontWeight: 400 }}>(optional but recommended)</span>
              </h2>
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <UploadBox image={image} setImage={setImage} />
              </div>
            </motion.div>

            {/* RIGHT — Description + Location + Button */}
            <motion.div
              initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              <div style={{ ...card, padding: "28px" }}>
                <DescriptionBox description={description} setDescription={setDescription} />
              </div>
              <div style={{ ...card, padding: "24px" }}>
                <LocationBox location={location} setLocation={setLocation} />
              </div>
              <div style={{ ...card, padding: "24px" }}>
                <div style={{ display: "grid", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", fontWeight: 500, marginBottom: "8px" }}>Email (optional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      style={{
                        width: "100%", padding: "14px 16px", borderRadius: "12px",
                        background: "rgba(2,6,23,0.7)", border: "1px solid rgba(34,211,238,0.2)",
                        color: "white", fontSize: "15px", outline: "none",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", color: "#94a3b8", fontSize: "13px", fontWeight: 500, marginBottom: "8px" }}>Phone (optional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1234567890"
                      style={{
                        width: "100%", padding: "14px 16px", borderRadius: "12px",
                        background: "rgba(2,6,23,0.7)", border: "1px solid rgba(34,211,238,0.2)",
                        color: "white", fontSize: "15px", outline: "none",
                      }}
                    />
                  </div>
                </div>
              </div>
              <AnalyzeButton
                image={image} description={description} location={location}
                email={email} phone={phone}
                setReport={setReport} setReportId={setReportId}
                setSubmissionMessage={setSubmissionMessage}
                loading={loading} setLoading={setLoading}
              />
              {submissionMessage && (
                <div style={{ marginTop: "20px", padding: "18px 22px", borderRadius: "16px", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.15)", color: "#c1d9ff", fontSize: "14px" }}>
                  {submissionMessage}
                </div>
              )}
            </motion.div>
          </div>

          {/* ── Results Section ── */}
          {report && (
            <>
              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "60px 0 40px" }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(34,211,238,0.1)" }} />
                <span style={{ color: "#22d3ee", fontSize: "12px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  {isDuplicate ? "⚠ Duplicate Detected" : "AI Analysis Results"}
                </span>
                <div style={{ flex: 1, height: "1px", background: "rgba(34,211,238,0.1)" }} />
              </div>

              {/* ── Duplicate Warning Card ── */}
              {isDuplicate && duplicate && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    borderRadius: "20px",
                    background: "rgba(251,191,36,0.05)",
                    border: "1px solid rgba(251,191,36,0.25)",
                    padding: "32px",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
                    <div style={{ height: "48px", width: "48px", borderRadius: "14px", background: "rgba(251,191,36,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                      ⚠️
                    </div>
                    <div>
                      <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#fbbf24" }}>Duplicate Complaint Detected</h2>
                      <p style={{ fontSize: "13px", color: "#78350f", marginTop: "4px" }}>
                        A very similar issue was already reported in this area within the last 24 hours.
                      </p>
                    </div>
                  </div>

                  {/* Existing report info grid */}
                  <div style={{ borderRadius: "14px", background: "rgba(2,6,23,0.6)", border: "1px solid rgba(251,191,36,0.15)", padding: "24px", marginBottom: "24px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                      {[
                        ["Report ID",  `#${duplicate.id}`],
                        ["Status",     duplicate.status],
                        ["Category",   duplicate.category || "—"],
                        ["Severity",   duplicate.severity || "—"],
                        ["Location",   duplicate.location || "—"],
                        ["Submitted",  duplicate.created_at ? new Date(duplicate.created_at + "Z").toLocaleString() : "—"],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p style={{ color: "#475569", fontSize: "11px", marginBottom: "4px" }}>{label}</p>
                          <p style={{ color: "#e2e8f0", fontSize: "13px", fontWeight: 500 }}>{value}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <p style={{ color: "#475569", fontSize: "11px", marginBottom: "6px" }}>Original Description</p>
                      <p style={{ color: "#cbd5e1", fontSize: "13px", lineHeight: 1.6 }}>{duplicate.description}</p>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <button
                      onClick={() => setReport(duplicate.analysis || "")}
                      style={{ padding: "10px 20px", borderRadius: "10px", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", color: "#fbbf24", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
                    >
                      👁 View Existing Report
                    </button>
                    <button
                      onClick={resetAll}
                      style={{ padding: "10px 20px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
                    >
                      🔄 Start Over
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Normal AI Report Card ── */}
              {!isDuplicate && (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ ...card, padding: "36px" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
                      <div style={{ height: "48px", width: "48px", borderRadius: "14px", background: "rgba(34,211,238,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
                        🤖
                      </div>
                      <div>
                        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#22d3ee" }}>AI Generated Report</h2>
                        <p style={{ fontSize: "12px", color: "#475569", marginTop: "3px" }}>Powered by Google Gemini 2.5 Flash</p>
                      </div>
                    </div>

                    {/* ── Responsible Department Highlight ── */}
                    {(() => {
                      const deptMatch = report.match(/🏢\s*RESPONSIBLE DEPARTMENT[:\s]+([^\n]+)/i);
                      const department = deptMatch ? deptMatch[1].trim() : null;
                      return department ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          style={{
                            marginBottom: "24px", padding: "20px 24px", borderRadius: "14px",
                            background: "linear-gradient(135deg, rgba(251,146,60,0.15), rgba(249,115,22,0.1))",
                            border: "2px solid rgba(251,146,60,0.4)",
                            boxShadow: "0 0 20px rgba(251,146,60,0.1)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ fontSize: "28px" }}>🏢</div>
                            <div>
                              <p style={{ color: "#f97316", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
                                Responsible Department
                              </p>
                              <p style={{ color: "#fed7aa", fontSize: "16px", fontWeight: 700, margin: "6px 0 0 0" }}>
                                {department}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ) : null;
                    })()}

                    <div style={{ borderRadius: "14px", background: "rgba(2,6,23,0.7)", border: "1px solid rgba(34,211,238,0.1)", padding: "28px 32px" }}>
                      <pre style={{ whiteSpace: "pre-wrap", fontSize: "14px", color: "#e2e8f0", lineHeight: "2", fontFamily: "inherit", margin: 0 }}>
                        {report}
                      </pre>
                    </div>

                    <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => { navigator.clipboard.writeText(report); alert("Copied!"); }}
                        style={{ padding: "10px 22px", borderRadius: "10px", background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.25)", color: "#22d3ee", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
                      >
                        📋 Copy Report
                      </button>
                      <button
                        onClick={resetAll}
                        style={{ padding: "10px 22px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}
                      >
                        🔄 New Report
                      </button>
                    </div>
                  </motion.div>

                  <div style={{ marginTop: "32px" }}>
                    <LetterBox report={report} description={description} location={location} />
                  </div>
                </>
              )}
            </>
          )}

        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ width: "100%", backgroundColor: "#020617", borderTop: "1px solid #0f172a", padding: "56px 24px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "10px" }}>
          <h2 style={{ fontSize: "26px", fontWeight: 700, color: "white" }}>
            CivicLens <span style={{ color: "#22d3ee" }}>AI</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>AI-Powered Civic Issue Reporting System</p>
          <div style={{ display: "flex", gap: "20px", fontSize: "20px", margin: "8px 0" }}>
            <a href="https://github.com/tasleensana03-boop" target="_blank" rel="noreferrer" style={{ color: "#475569", textDecoration: "none" }}><FaGithub /></a>
            <a href="https://www.linkedin.com/in/tasleen-sana-8ab01a301" target="_blank" rel="noreferrer" style={{ color: "#475569", textDecoration: "none" }}><FaLinkedin /></a>
          </div>
          <p style={{ color: "#334155", fontSize: "13px" }}>© 2026 CivicLens AI. All rights reserved.</p>
          <p style={{ color: "#22d3ee", fontSize: "13px", fontWeight: 500 }}>Built with React • Flask • Gemini AI</p>
          <p style={{ color: "#64748b", fontSize: "13px" }}>
            Designed & Developed by <span style={{ color: "#e2e8f0", fontWeight: 600 }}>Tasleen Sana</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Report;
