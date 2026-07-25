import { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaPen } from "react-icons/fa";
import { useLanguage } from "../LanguageProvider";
import { LOCALES, translate } from "../i18n";

function DescriptionBox({ description, setDescription }) {
  const { language } = useLanguage();
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === LOCALES.HI ? "hi-IN" : "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += `${result[0]?.transcript || ""} `;
        }
      }
      finalTranscript = finalTranscript.trim();
      if (finalTranscript) {
        setDescription((prev) => (prev ? `${prev} ${finalTranscript}` : finalTranscript));
      }
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    setSpeechSupported(true);

    return () => {
      recognition.stop?.();
      recognitionRef.current = null;
      setListening(false);
    };
  }, [language, setDescription]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      return;
    }

    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (error) {
      console.error(error);
      setListening(false);
    }
  };

  return (
    <div className="w-full">

      {/* Heading */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
          <FaPen className="text-cyan-400 text-base" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{translate(language, "report.descriptionTitle")}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {translate(language, "report.descriptionHint")}
          </p>
        </div>
      </div>

      {!speechSupported && (
        <p style={{ color: "#fda4af", fontSize: "12px", marginBottom: "10px" }}>
          {translate(language, "report.voiceUnsupported")}
        </p>
      )}

      <p style={{
        color: listening ? "#67e8f9" : "#64748b",
        fontSize: "12px",
        marginBottom: "10px",
        lineHeight: 1.5,
      }}>
        {listening ? translate(language, "report.voiceListening") : translate(language, "report.voiceTip")}
      </p>

      {/* Text Area with voice button */}
      <div style={{ position: "relative" }}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={translate(language, "report.descriptionPlaceholder")}
          style={{
            width: "100%",
            height: "160px",
            borderRadius: "12px",
            background: "rgba(2,6,23,0.6)",
            border: listening ? "1px solid rgba(34,211,238,0.45)" : "1px solid rgba(71,85,105,0.5)",
            padding: "16px 52px 16px 18px",
            color: "white",
            fontSize: "14px",
            outline: "none",
            resize: "none",
            lineHeight: "1.7",
            boxSizing: "border-box",
            fontFamily: "inherit",
            transition: "border-color 0.2s",
          }}
        />
        <button
          type="button"
          onClick={toggleListening}
          disabled={!speechSupported}
          aria-label={listening ? translate(language, "report.voiceStop") : translate(language, "report.voiceButton")}
          title={listening ? translate(language, "report.voiceStop") : translate(language, "report.voiceButton")}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: listening ? "1px solid rgba(248,113,113,0.45)" : "1px solid rgba(34,211,238,0.25)",
            background: listening ? "rgba(248,113,113,0.15)" : "rgba(34,211,238,0.1)",
            color: listening ? "#fca5a5" : "#22d3ee",
            cursor: speechSupported ? "pointer" : "not-allowed",
            opacity: speechSupported ? 1 : 0.4,
            transition: "background 0.2s, border-color 0.2s, color 0.2s",
            flexShrink: 0,
          }}
        >
          {listening ? <FaMicrophoneSlash style={{ fontSize: "15px" }} /> : <FaMicrophone style={{ fontSize: "15px" }} />}
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-600">
        {translate(language, "report.descriptionTip")}
      </p>
    </div>
  );
}

export default DescriptionBox;
