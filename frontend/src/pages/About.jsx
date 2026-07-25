import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaRobot, FaMapMarkerAlt, FaBolt, FaShieldAlt, FaGithub, FaLinkedin } from "react-icons/fa";
import { FaCity } from "react-icons/fa";
import Navbar from "../components/Navbar";

const GITHUB_URL = "https://github.com/tasleensana03-boop";
const LINKEDIN_URL = "https://www.linkedin.com/in/tasleen-sana-8ab01a301";
const EMAIL = "tasleensana03@gmail.com";

const features = [
  { icon: <FaRobot />,         title: "Gemini AI Analysis",      desc: "Google's Gemini 2.5 Flash model reads both your image and description to identify the exact civic issue, its severity, and root cause." },
  { icon: <FaMapMarkerAlt />,  title: "Auto Location Detection", desc: "One-click GPS detection captures your exact coordinates and converts them to a real address using OpenStreetMap — no API key needed." },
  { icon: <FaBolt />,          title: "Instant Structured Reports", desc: "AI generates a complete report — category, severity, responsible department, recommended action, and resolution timeline — in seconds." },
  { icon: <FaShieldAlt />,     title: "Wide Issue Coverage",     desc: "From potholes and broken streetlights to water leaks and garbage overflow, CivicLens handles any type of civic infrastructure problem." },
];

const stack = [
  { name: "React 19",        color: "#22d3ee" },
  { name: "Tailwind CSS 4",  color: "#38bdf8" },
  { name: "Framer Motion",   color: "#a78bfa" },
  { name: "React Router",    color: "#4ade80" },
  { name: "Flask",           color: "#facc15" },
  { name: "Gemini AI",       color: "#f472b6" },
  { name: "Python",          color: "#60a5fa" },
  { name: "Vite",            color: "#fb923c" },
];

const steps = [
  { step: "01", label: "Upload Photo",    icon: "📸" },
  { step: "02", label: "Describe Issue",  icon: "📝" },
  { step: "03", label: "Detect Location", icon: "📍" },
  { step: "04", label: "AI Analyzes",     icon: "🤖" },
];

const card = {
  borderRadius: "16px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(34,211,238,0.2)",
  backdropFilter: "blur(16px)",
  padding: "24px",
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

function About() {
  return (
    <div style={{ minHeight: "100vh", width: "100%", backgroundColor: "#020617", color: "white" }}>
      <Navbar />

      <main style={{ paddingTop: "120px", paddingBottom: "80px", paddingLeft: "24px", paddingRight: "24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

          {/* ── Hero ── */}
          <motion.div {...fadeUp(0)} style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 80px" }}>
            <p style={{ color: "#22d3ee", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: "11px", fontWeight: 600, marginBottom: "16px" }}>
              About the Project
            </p>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, lineHeight: 1.2, marginBottom: "20px" }}>
              What is <span style={{ color: "#22d3ee" }}>CivicLens AI?</span>
            </h1>
            <p style={{ color: "#cbd5e1", fontSize: "16px", lineHeight: 1.8, marginBottom: "32px" }}>
              CivicLens AI is an intelligent civic issue reporting platform that combines
              computer vision and large language models to help citizens report
              infrastructure problems — and help local governments act on them faster.
            </p>
            <Link
              to="/report"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "#06b6d4", color: "white", fontWeight: 700,
                padding: "14px 28px", borderRadius: "12px", textDecoration: "none",
                boxShadow: "0 8px 24px rgba(6,182,212,0.3)",
              }}
            >
              🚀 Try It Now
            </Link>
          </motion.div>

          {/* ── How It Works ── */}
          <motion.div {...fadeUp(0.1)} style={{ marginBottom: "80px" }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, textAlign: "center", marginBottom: "36px" }}>
              How It <span style={{ color: "#22d3ee" }}>Works</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              {steps.map((item, i) => (
                <motion.div key={item.step}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                  style={{ ...card, textAlign: "center" }}>
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>{item.icon}</div>
                  <p style={{ color: "#22d3ee", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "6px" }}>
                    STEP {item.step}
                  </p>
                  <p style={{ color: "white", fontWeight: 600, fontSize: "14px" }}>{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Features ── */}
          <motion.div {...fadeUp(0.2)} style={{ marginBottom: "80px" }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, textAlign: "center", marginBottom: "36px" }}>
              Key <span style={{ color: "#22d3ee" }}>Features</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {features.map((f, i) => (
                <motion.div key={f.title}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
                  style={{ ...card, display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{
                    height: "44px", width: "44px", minWidth: "44px", borderRadius: "12px",
                    background: "rgba(34,211,238,0.1)", display: "flex", alignItems: "center",
                    justifyContent: "center", color: "#22d3ee", fontSize: "18px",
                  }}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "15px", fontWeight: 600, color: "white", marginBottom: "6px" }}>{f.title}</h3>
                    <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.7 }}>{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Tech Stack ── */}
          <motion.div {...fadeUp(0.3)} style={{ marginBottom: "80px", textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, marginBottom: "28px" }}>
              Tech <span style={{ color: "#22d3ee" }}>Stack</span>
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px" }}>
              {stack.map((t) => (
                <span key={t.name} style={{
                  padding: "8px 18px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontSize: "13px", fontWeight: 600, color: t.color,
                }}>
                  {t.name}
                </span>
              ))}
            </div>
          </motion.div>

          {/* ── Developer Card ── */}
          <motion.div {...fadeUp(0.4)} style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              ...card, maxWidth: "420px", width: "100%",
              textAlign: "center", borderRadius: "24px",
              boxShadow: "0 20px 60px rgba(34,211,238,0.08)",
            }}>
              <div style={{
                height: "72px", width: "72px", borderRadius: "20px",
                background: "rgba(34,211,238,0.1)", display: "flex",
                alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px", fontSize: "32px", color: "#22d3ee",
              }}>
                <FaCity />
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: "white", marginBottom: "4px" }}>Tasleen Sana</h3>
              <p style={{ color: "#22d3ee", fontSize: "13px", fontWeight: 500, marginBottom: "12px" }}>Designer & Developer</p>
              <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.7, marginBottom: "20px" }}>
                Built CivicLens AI to bridge the gap between citizens and government —
                making civic issue reporting smart, fast, and data-driven.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "20px", fontSize: "22px" }}>
                <a href={GITHUB_URL} target="_blank" rel="noreferrer" style={{ color: "#94a3b8", textDecoration: "none" }}><FaGithub /></a>
                <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" style={{ color: "#94a3b8", textDecoration: "none" }}><FaLinkedin /></a>
              </div>
              <a href={`mailto:${EMAIL}`} style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13px" }}>{EMAIL}</a>
            </div>
          </motion.div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer style={{ width: "100%", borderTop: "1px solid #1e293b", padding: "48px 24px", backgroundColor: "#020617" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "10px" }}>
          <h2 style={{ fontSize: "26px", fontWeight: 700, color: "white" }}>
            CivicLens <span style={{ color: "#22d3ee" }}>AI</span>
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>AI-Powered Civic Issue Reporting System</p>
          <div style={{ display: "flex", gap: "20px", fontSize: "20px", margin: "6px 0" }}>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" style={{ color: "#94a3b8" }}><FaGithub /></a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" style={{ color: "#94a3b8" }}><FaLinkedin /></a>
          </div>
          <a href={`mailto:${EMAIL}`} style={{ color: "#94a3b8", textDecoration: "none", fontSize: "13px" }}>{EMAIL}</a>
          <p style={{ color: "#475569", fontSize: "13px" }}>© 2026 CivicLens AI. All rights reserved.</p>
          <p style={{ color: "#22d3ee", fontSize: "13px", fontWeight: 500 }}>Built with React • Flask • Gemini AI</p>
          <p style={{ color: "#94a3b8", fontSize: "13px" }}>
            Designed & Developed by <span style={{ color: "white", fontWeight: 600 }}>Tasleen Sana</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default About;
