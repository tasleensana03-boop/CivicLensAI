import { useState } from "react";
import { motion } from "framer-motion";
import { FaLocationDot } from "react-icons/fa6";
import { FaKeyboard, FaSpinner } from "react-icons/fa";
import { useLanguage } from "../LanguageProvider";
import { translate } from "../i18n";

function LocationBox({ location, setLocation }) {
  const { language } = useLanguage();
  const [detecting,   setDetecting]   = useState(false);
  const [coords,      setCoords]      = useState("");
  const [manualMode,  setManualMode]  = useState(false);

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lon = position.coords.longitude.toFixed(6);
        const rawCoords = `${lat}, ${lon}`;
        setCoords(rawCoords);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          if (data?.display_name) {
            const addr = data.address;
            const parts = [
              addr.road || addr.pedestrian || addr.footway,
              addr.suburb || addr.neighbourhood || addr.quarter,
              addr.city || addr.town || addr.village || addr.county,
              addr.state,
              addr.country,
            ].filter(Boolean);
            setLocation(parts.slice(0, 4).join(", ") || data.display_name);
          } else {
            setLocation(rawCoords);
          }
        } catch {
          setLocation(rawCoords);
        }
        setDetecting(false);
      },
      () => {
        alert("Unable to fetch your location. Please allow location access or type it manually.");
        setDetecting(false);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="w-full">

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            height: "38px", width: "38px", borderRadius: "10px",
            background: "rgba(34,211,238,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <FaLocationDot style={{ color: "#22d3ee", fontSize: "16px" }} />
          </div>
          <div>
            <p style={{ color: "white", fontWeight: 600, fontSize: "15px" }}>{translate(language, "report.locationTitle")}</p>
            <p style={{ color: "#64748b", fontSize: "12px", marginTop: "2px" }}>
              {translate(language, "report.locationSubtitle")}
            </p>
          </div>
        </div>

        <button
          onClick={() => setManualMode(!manualMode)}
          style={{
            display: "flex", alignItems: "center", gap: "5px",
            fontSize: "12px", color: "#22d3ee", background: "none",
            border: "none", cursor: "pointer", padding: 0,
          }}
        >
          <FaKeyboard style={{ fontSize: "11px" }} />
          {manualMode ? translate(language, "report.manualToggle.autoDetect") : translate(language, "report.manualToggle.typeManually")}
        </button>
      </div>

      {/* Manual input */}
      {manualMode ? (
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Main Boulevard, Gulshan, Karachi"
          style={{
            width: "100%", borderRadius: "10px",
            background: "rgba(2,6,23,0.6)",
            border: "1px solid rgba(71,85,105,0.6)",
            padding: "12px 16px", color: "white",
            fontSize: "14px", outline: "none",
            boxSizing: "border-box",
          }}
        />
      ) : (
        /* Detect button */
        <button
          onClick={detectLocation}
          disabled={detecting}
          style={{
            width: "100%", padding: "12px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
            border: "none", color: "white",
            fontSize: "14px", fontWeight: 600,
            cursor: detecting ? "not-allowed" : "pointer",
            opacity: detecting ? 0.7 : 1,
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            transition: "opacity 0.2s",
          }}
        >
          {detecting ? (
            <>
              <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
              Detecting...
            </>
          ) : (
            "📍 Detect Current Location"
          )}
        </button>
      )}

      {/* Detected address display */}
      {location && !manualMode && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            marginTop: "12px",
            borderRadius: "10px",
            background: "rgba(2,6,23,0.6)",
            border: "1px solid rgba(34,211,238,0.15)",
            padding: "12px 14px",
            display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px",
          }}
        >
          <div style={{ flex: 1 }}>
            <p style={{ color: "#64748b", fontSize: "11px", marginBottom: "4px" }}>📍 {translate(language, "report.locationTitle")}</p>
            <p style={{ color: "#67e8f9", fontSize: "13px", fontWeight: 500, lineHeight: 1.5 }}>{location}</p>
            {coords && (
              <p style={{ color: "#334155", fontSize: "11px", marginTop: "4px", fontFamily: "monospace" }}>{coords}</p>
            )}
          </div>
          <button
            onClick={() => { setLocation(""); setCoords(""); }}
            style={{ color: "#334155", background: "none", border: "none", cursor: "pointer", fontSize: "12px", flexShrink: 0 }}
          >
            ✕
          </button>
        </motion.div>
      )}

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}

export default LocationBox;
