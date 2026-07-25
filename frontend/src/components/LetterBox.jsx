import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelopeOpenText, FaCopy, FaDownload, FaSpinner, FaExternalLinkAlt, FaCheckCircle } from "react-icons/fa";

// ── Department → complaint portal link mapping ─────────────────────────────
const DEPARTMENT_LINKS = {
  // Road / Infrastructure
  "road":        { name: "Road Maintenance Department",    url: "https://www.pass.gov.pk/",           hint: "Punjab Citizen Portal" },
  "pothole":     { name: "Road Maintenance Department",    url: "https://www.pass.gov.pk/",           hint: "Punjab Citizen Portal" },
  "highway":     { name: "Road Maintenance Department",    url: "https://www.pass.gov.pk/",           hint: "Punjab Citizen Portal" },
  "infrastructure": { name: "Public Works Department",    url: "https://www.pass.gov.pk/",             hint: "Punjab Citizen Portal" },

  // Water & Drainage
  "water":       { name: "Water & Sanitation Authority",  url: "https://www.wasa.punjab.gov.pk/", hint: "WASA Punjab" },
  "drainage":    { name: "Water & Sanitation Authority",  url: "https://www.wasa.punjab.gov.pk/", hint: "WASA Punjab" },
  "sewage":      { name: "Water & Sanitation Authority",  url: "https://www.wasa.punjab.gov.pk/", hint: "WASA Punjab" },
  "pipe":        { name: "Water & Sanitation Authority",  url: "https://www.wasa.punjab.gov.pk/", hint: "WASA Punjab" },

  // Electricity
  "electricity": { name: "LESCO / KESC Electricity Board",url: "https://www.lesco.gov.pk/",        hint: "Lahore Electric Supply Company" },
  "streetlight": { name: "LESCO / KESC Electricity Board",url: "https://www.lesco.gov.pk/",        hint: "Lahore Electric Supply Company" },
  "power":       { name: "LESCO / KESC Electricity Board",url: "https://www.lesco.gov.pk/",        hint: "Lahore Electric Supply Company" },

  // Sanitation / Waste
  "garbage":     { name: "Municipal Sanitation Department",url: "https://www.pass.gov.pk/",  hint: "Punjab Citizen Portal" },
  "sanitation":  { name: "Municipal Sanitation Department",url: "https://www.pass.gov.pk/",  hint: "Punjab Citizen Portal" },
  "waste":       { name: "Municipal Sanitation Department",url: "https://www.pass.gov.pk/",  hint: "Punjab Citizen Portal" },
  "trash":       { name: "Municipal Sanitation Department",url: "https://www.pass.gov.pk/",  hint: "Punjab Citizen Portal" },

  // Public Property
  "park":        { name: "Parks & Horticulture Authority", url: "https://www.pha.punjab.gov.pk/",                hint: "Parks & Horticulture Authority" },
  "footpath":    { name: "Public Works Department",        url: "https://www.pass.gov.pk/",                  hint: "Punjab Citizen Portal" },
  "sidewalk":    { name: "Public Works Department",        url: "https://www.pass.gov.pk/",                  hint: "Punjab Citizen Portal" },

  // Fallback
  "default":     { name: "Pakistan Citizen Portal",        url: "https://www.pass.gov.pk/",                  hint: "Punjab Citizen Portal" },
};

/** Match department/category keywords from AI report to a portal link */
function getDepartmentLink(analysisText) {
  const lower = (analysisText || "").toLowerCase();
  for (const [keyword, info] of Object.entries(DEPARTMENT_LINKS)) {
    if (keyword !== "default" && lower.includes(keyword)) return info;
  }
  return DEPARTMENT_LINKS["default"];
}

/** Extract department name from AI analysis text */
function extractDepartment(analysisText) {
  const match = analysisText.match(/responsible department[:\s]+([^\n]+)/i);
  return match ? match[1].trim() : "Municipal Authority";
}

// ── Component ──────────────────────────────────────────────────────────────
function LetterBox({ report, description, location }) {
  const [letter, setLetter]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [copied, setCopied]       = useState(false);
  const [open, setOpen]           = useState(false);

  const deptInfo   = getDepartmentLink(report);
  const department = extractDepartment(report);
  const portalUrl  = deptInfo?.url || "https://www.pass.gov.pk/";

  const generateLetter = async () => {
    setLoading(true);
    setOpen(true);
    setLetter("");

    try {
      const res = await fetch("http://127.0.0.1:5000/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, location, analysis: report, department }),
      });
      const data = await res.json();
      if (data.status === "error") {
        setLetter(`❌ Error: ${data.message}`);
      } else {
        setLetter(data.letter);
      }
    } catch {
      setLetter("❌ Could not connect to backend. Make sure Flask is running.");
    }

    setLoading(false);
  };

  const submitComplaint = async () => {
    if (!submitEmail && !submitPhone) {
      alert("Please provide at least an email or phone number");
      return;
    }

    setSubmitLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/submit-complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          location,
          analysis: report,
          department,
          email: submitEmail,
          phone: submitPhone,
          letter,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        alert(`✅ Complaint submitted successfully!\nReport ID: #${data.report_id}\n\nWe will contact you at ${submitEmail || submitPhone}`);
        setShowSubmit(false);
        setSubmitEmail("");
        setSubmitPhone("");
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      alert("❌ Could not submit complaint. Make sure backend is running.");
    }
    setSubmitLoading(false);
  };

  const openComplaintPortal = () => {
    setShowSubmit(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ marginTop: "28px" }}
    >
      {/* ── Action Bar ── */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "14px",
        alignItems: "stretch",
      }}>

        {/* Generate Letter Button */}
        <button
          onClick={generateLetter}
          disabled={loading}
          style={{
            flex: 1, minWidth: "220px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            padding: "16px 24px", borderRadius: "14px",
            background: "linear-gradient(135deg, #0e7490, #1d4ed8)",
            border: "1px solid rgba(34,211,238,0.3)",
            color: "white", fontSize: "15px", fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            boxShadow: "0 8px 24px rgba(14,116,144,0.3)",
            transition: "all 0.2s",
          }}
        >
          {loading
            ? <><FaSpinner style={{ animation: "spin 1s linear infinite" }} /> Generating Letter...</>
            : <><FaEnvelopeOpenText style={{ fontSize: "18px" }} /> ✍️ Generate Complaint Letter</>
          }
        </button>

        {/* File Complaint Link */}
        <a
          href={portalUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            flex: 1, minWidth: "220px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            padding: "16px 24px", borderRadius: "14px",
            background: "rgba(34,211,238,0.08)",
            border: "1px solid rgba(34,211,238,0.3)",
            color: "#22d3ee", fontSize: "15px", fontWeight: 600,
            textDecoration: "none",
            transition: "all 0.2s",
          }}
        >
          <FaExternalLinkAlt />
          🏢 File Complaint to {deptInfo?.name || "Authorities"}
        </a>
      </div>

      {/* Department hint */}
      <p style={{ color: "#475569", fontSize: "12px", marginTop: "8px", paddingLeft: "4px" }}>
        🔗 Complaint portal: <span style={{ color: "#64748b" }}>{deptInfo?.hint}</span> — opens in a new tab.
      </p>
      <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "4px", paddingLeft: "4px" }}>
        🔍 Target URL: <span style={{ color: "#38bdf8" }}>{portalUrl}</span>
      </p>

      {/* ── Letter Output ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            style={{
              marginTop: "24px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(34,211,238,0.2)",
              backdropFilter: "blur(16px)",
              overflow: "hidden",
            }}
          >
            {/* Letter Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 24px",
              borderBottom: "1px solid rgba(34,211,238,0.1)",
              background: "rgba(14,116,144,0.08)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  height: "36px", width: "36px", borderRadius: "10px",
                  background: "rgba(34,211,238,0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "16px",
                }}>
                  ✉️
                </div>
                <div>
                  <p style={{ color: "white", fontWeight: 600, fontSize: "15px" }}>
                    Formal Complaint Letter
                  </p>
                  <p style={{ color: "#64748b", fontSize: "12px", marginTop: "2px" }}>
                    AI-generated · Ready to submit
                  </p>
                </div>
              </div>

              {/* Copy + Download buttons — only show when letter is ready */}
              {letter && !loading && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={copyLetter}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "7px 14px", borderRadius: "8px",
                      background: copied ? "rgba(74,222,128,0.1)" : "rgba(34,211,238,0.1)",
                      border: `1px solid ${copied ? "rgba(74,222,128,0.3)" : "rgba(34,211,238,0.3)"}`,
                      color: copied ? "#4ade80" : "#22d3ee",
                      fontSize: "12px", fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    {copied ? <FaCheckCircle /> : <FaCopy />}
                    {copied ? "Copied!" : "Copy"}
                  </button>

                  <button
                    onClick={downloadLetter}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "7px 14px", borderRadius: "8px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#cbd5e1", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    <FaDownload /> Download
                  </button>
                </div>
              )}
            </div>

            {/* Letter Body */}
            <div style={{ padding: "24px" }}>
              {loading ? (
                <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#64748b", padding: "20px 0" }}>
                  <FaSpinner style={{ animation: "spin 1s linear infinite", color: "#22d3ee" }} />
                  <span>Writing your formal complaint letter...</span>
                </div>
              ) : (
                <pre style={{
                  whiteSpace: "pre-wrap",
                  fontFamily: "'Georgia', 'Times New Roman', serif",
                  fontSize: "14px",
                  color: "#e2e8f0",
                  lineHeight: "1.9",
                  margin: 0,
                }}>
                  {letter}
                </pre>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for spinner */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
}

export default LetterBox;
