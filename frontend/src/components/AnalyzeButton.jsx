import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaArrowRight, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

function AnalyzeButton({ image, description, location, email, phone, setReport, setReportId, setSubmissionMessage, loading, setLoading }) {
  const analyzeIssue = async () => {
    if (!description) {
      alert("Please describe the issue first.");
      return;
    }

    setLoading(true);
    setReport("");
    setSubmissionMessage("");
    if (setReportId) setReportId(null);

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("location", location);
      formData.append("email", email);
      formData.append("phone", phone);
      if (image) formData.append("image", image);

      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.status === "error") {
        setReport(`❌ Error: ${data.message}`);
      } else if (data.status === "duplicate") {
        setReport(`__DUPLICATE__${JSON.stringify(data.duplicate)}`);
      } else {
        setReport(data.analysis || JSON.stringify(data));
        if (setReportId && data.report_id) setReportId(data.report_id);
        if (setSubmissionMessage) {
          setSubmissionMessage(`Report submitted successfully! Your report ID is #${data.report_id}. We will notify you at the email or phone number you provided.`);
        }
      }

    } catch {
      setReport("❌ Backend connection failed. Make sure the Flask server is running on port 5000.");
    }

    setLoading(false);
  };

  return (
    <motion.button
      onClick={analyzeIssue}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.97 }}
      disabled={loading}
      style={{
        width: "100%",
        padding: "16px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        background: loading
          ? "rgba(6,182,212,0.5)"
          : "linear-gradient(135deg, #06b6d4, #3b82f6)",
        border: "none",
        color: "white",
        fontSize: "15px",
        fontWeight: 700,
        cursor: loading ? "not-allowed" : "pointer",
        boxShadow: "0 8px 24px rgba(6,182,212,0.25)",
        transition: "all 0.2s",
      }}
    >
      <FaRobot style={{ fontSize: "18px" }} />

      {loading ? (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg style={{ animation: "spin 1s linear infinite", width: "16px", height: "16px" }}
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Analyzing with AI...
        </span>
      ) : (
        <>
          Analyze With AI
          <FaArrowRight style={{ fontSize: "13px" }} />
        </>
      )}

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </motion.button>
  );
}

export default AnalyzeButton;
