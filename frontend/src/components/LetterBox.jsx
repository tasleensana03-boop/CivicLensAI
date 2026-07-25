import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelopeOpenText, FaCopy, FaDownload, FaSpinner, FaExternalLinkAlt, FaCheckCircle } from "react-icons/fa";

// ── Department → complaint portal link mapping ─────────────────────────────
const PORTAL_ROUTES = [
  {
    keywords: ["wasa", "water & sanitation", "water and sanitation", "water & drainage", "water supply", "drainage", "sewage", "pipe", "water board", "water"],
    url: "https://cms.wasalhr.pk/",
    hint: "WASA Lahore Complaint Portal",
    fallbackName: "Water & Sanitation Authority (WASA)",
  },
  {
    keywords: ["lesco", "k-electric", "k electric", "electricity", "electricity board", "electric supply", "power supply", "streetlight", "street light"],
    url: "https://www.lesco.gov.pk/",
    hint: "Lahore Electric Supply Company",
    fallbackName: "LESCO",
  },
  {
    keywords: ["lwmc", "waste management", "garbage", "sanitation", "waste", "trash", "solid waste"],
    url: "https://crm.punjab.gov.pk/PublicUser",
    hint: "Chief Minister Punjab Complaint Portal",
    fallbackName: "Lahore Waste Management Company (LWMC)",
  },
  {
    keywords: ["pha", "parks", "horticulture", "garden", "green belt", "public property"],
    url: "https://www.pha.punjab.gov.pk/",
    hint: "Parks & Horticulture Authority",
    fallbackName: "Parks & Horticulture Authority (PHA)",
  },
  {
    keywords: ["road", "pothole", "highway", "nha", "public works", "infrastructure", "footpath", "sidewalk", "cda", "municipal"],
    url: "https://crm.punjab.gov.pk/PublicUser",
    hint: "Chief Minister Punjab Complaint Portal",
    fallbackName: "Road Maintenance / Public Works Department",
  },
];

const DEFAULT_PORTAL = {
  url: "https://web.citizenportal.gov.pk/",
  hint: "Pakistan Citizen Portal",
  fallbackName: "Pakistan Citizen Portal",
};

/** Extract a single-line field from the structured AI report */
function extractField(analysisText, label) {
  const match = (analysisText || "").match(new RegExp(`${label}[:\\s]+([^\\n]+)`, "i"));
  return match ? match[1].trim() : "";
}

/** Extract department name from AI analysis text */
function extractDepartment(analysisText) {
  return extractField(analysisText, "🏢\\s*RESPONSIBLE DEPARTMENT")
    || extractField(analysisText, "RESPONSIBLE DEPARTMENT")
    || "Municipal Authority";
}

/** Match extracted department (then category) to the correct complaint portal */
function getDepartmentLink(analysisText) {
  const department = extractDepartment(analysisText).toLowerCase();
  const category = extractField(analysisText, "🏷️\\s*CATEGORY")
    || extractField(analysisText, "CATEGORY");

  const matchRoute = (text) => {
    const lower = (text || "").toLowerCase();
    if (!lower) return null;
    return PORTAL_ROUTES.find((route) =>
      route.keywords.some((keyword) => lower.includes(keyword))
    );
  };

  const route = matchRoute(department) || matchRoute(category);
  const portal = route || DEFAULT_PORTAL;
  const displayName = extractDepartment(analysisText) || portal.fallbackName;

  return {
    name: displayName,
    url: portal.url,
    hint: portal.hint,
  };
}

// ── Component ──────────────────────────────────────────────────────────────
function LetterBox({ report, description, location }) {
  const [letter, setLetter]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [copied, setCopied]       = useState(false);
  const [open, setOpen]           = useState(false);

  const deptInfo   = getDepartmentLink(report);
  const department = extractDepartment(report);
  const portalUrl  = deptInfo.url;

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

  const copyLetter = async () => {
    if (!letter) return;
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadLetter = () => {
    if (!letter) return;
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "complaint-letter.txt";
    link.click();
    URL.revokeObjectURL(url);
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
          🏢 File Complaint to {deptInfo.name}
        </a>
      </div>

      {/* Department hint */}
      <p style={{ color: "#475569", fontSize: "12px", marginTop: "8px", paddingLeft: "4px" }}>
        🔗 Complaint portal: <span style={{ color: "#64748b" }}>{deptInfo.hint}</span> — opens in a new tab.
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
