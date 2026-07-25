import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaArrowRight, FaShieldAlt, FaBolt, FaMapMarkerAlt } from "react-icons/fa";
import smartCity from "../assets/smartcity.png";
import { useLanguage } from "../LanguageProvider";
import { translate } from "../i18n";

const features = [
  { icon: <FaBolt />,        key: "home.hero.feature1" },
  { icon: <FaMapMarkerAlt />, key: "home.hero.feature2" },
  { icon: <FaShieldAlt />,    key: "home.hero.feature3" },
];

const stats = [
  { value: "10K+", key: "home.hero.stat1" },
  { value: "98%",  key: "home.hero.stat2" },
  { value: "24/7", key: "home.hero.stat3" },
  { value: "50+",  key: "home.hero.stat4" },
];

function Hero() {
  const { language } = useLanguage();

  return (
    <section style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "100px clamp(20px, 5vw, 80px) 60px",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* ── Animated background glows ── */}
      <motion.div
        animate={{ x: [0, 60, -30, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", top: "-100px", left: "-100px",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ x: [0, -50, 40, 0], y: [0, 50, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute", bottom: "-80px", right: "-80px",
          width: "600px", height: "600px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
          filter: "blur(60px)", pointerEvents: "none",
        }}
      />

      {/* ── Badge ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "6px 16px", borderRadius: "999px",
          background: "rgba(34,211,238,0.06)",
          border: "1px solid rgba(34,211,238,0.2)",
          marginBottom: "32px",
        }}
      >
        <span style={{
          height: "7px", width: "7px", borderRadius: "50%",
          background: "#22d3ee", display: "inline-block",
          boxShadow: "0 0 8px #22d3ee",
        }} />
        <span style={{ color: "#22d3ee", fontSize: "12px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          {translate(language, "home.badge")}
        </span>
      </motion.div>

      <div className="hero-grid" style={{
        width: "100%",
        gap: "44px",
        alignItems: "center",
      }}>
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          style={{ maxWidth: "680px" }}
        >
          <h1 style={{
            fontSize: "clamp(2.4rem, 5vw, 4rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: "24px",
            color: "white",
          }}>
            {translate(language, "home.hero.title")}
          </h1>

          <p style={{
            fontSize: "18px", color: "#94a3b8",
            lineHeight: 1.75, marginBottom: "16px",
            fontWeight: 500,
          }}>
            {translate(language, "home.hero.subtitle")}
          </p>

          <p style={{
            fontSize: "15px", color: "#64748b",
            lineHeight: 1.8, marginBottom: "40px",
            maxWidth: "440px",
          }}>
            {translate(language, "home.hero.description")}
          </p>

          {/* Feature pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "40px" }}>
            {features.map((f) => (
              <div key={f.key} style={{
                display: "inline-flex", alignItems: "center", gap: "7px",
                padding: "7px 14px", borderRadius: "999px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(34,211,238,0.15)",
                color: "#94a3b8", fontSize: "13px",
              }}>
                <span style={{ color: "#22d3ee", fontSize: "11px" }}>{f.icon}</span>
                {translate(language, f.key)}
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
            <Link to="/report" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "14px 28px", borderRadius: "12px",
              background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
              color: "white", fontWeight: 700, fontSize: "15px",
              textDecoration: "none",
              boxShadow: "0 8px 32px rgba(6,182,212,0.35)",
            }}>
              🚀 {translate(language, "home.hero.action")}
              <FaArrowRight style={{ fontSize: "13px" }} />
            </Link>
          </div>
        </motion.div>

        {/* RIGHT — Card */}
        <motion.div
          className="hero-card"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          style={{ display: "flex", justifyContent: "center", position: "relative" }}
        >
          {/* Outer glow ring */}
          <div style={{
            position: "absolute",
            width: "340px", height: "340px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)",
            filter: "blur(30px)",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
          }} />

          {/* Card */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "relative", zIndex: 1,
              width: "340px",
              borderRadius: "28px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(34,211,238,0.2)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(34,211,238,0.1) inset",
              padding: "32px 24px",
              display: "flex", flexDirection: "column", alignItems: "center",
            }}
          >
            {/* Top label */}
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              marginBottom: "20px",
            }}>
              <span style={{
                height: "8px", width: "8px", borderRadius: "50%",
                background: "#22d3ee", display: "inline-block",
                boxShadow: "0 0 10px #22d3ee",
              }} />
              <span style={{ color: "#64748b", fontSize: "12px", letterSpacing: "0.1em" }}>
                LIVE • AI ACTIVE
              </span>
            </div>

            <img
              src={smartCity}
              alt="Smart City"
              style={{ width: "240px", objectFit: "contain", marginBottom: "20px" }}
            />

            <h2 style={{ color: "white", fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>
              Smart City AI
            </h2>

            <p style={{ color: "#64748b", fontSize: "13px", letterSpacing: "0.1em" }}>
              Detect • Classify • Assign • Track
            </p>

            {/* Mini status pills */}
            <div style={{ display: "flex", gap: "8px", marginTop: "20px" }}>
              {["Road", "Water", "Power", "Waste"].map((t) => (
                <span key={t} style={{
                  padding: "4px 10px", borderRadius: "999px",
                  background: "rgba(34,211,238,0.08)",
                  border: "1px solid rgba(34,211,238,0.15)",
                  color: "#67e8f9", fontSize: "11px", fontWeight: 500,
                }}>
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Stats strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1px",
          maxWidth: "800px",
          width: "100%",
          marginTop: "80px",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid rgba(34,211,238,0.1)",
          background: "rgba(34,211,238,0.1)",
        }}
      >
        {stats.map((s) => (
          <div key={s.key} style={{
            background: "rgba(2,6,23,0.9)",
            padding: "20px",
            textAlign: "center",
            backdropFilter: "blur(10px)",
          }}>
            <p style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "#22d3ee" }}>{s.value}</p>
            <p style={{ fontSize: "12px", color: "#475569", marginTop: "4px" }}>{translate(language, s.key)}</p>
          </div>
        ))}
      </motion.div>

    </section>
  );
}

export default Hero;
