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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <button
          type="button"
          onClick={toggleListening}
          disabled={!speechSupported}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {listening ? <FaMicrophoneSlash className="text-base" /> : <FaMicrophone className="text-base" />}
          <span>{listening ? translate(language, "report.voiceStop") : translate(language, "report.voiceButton")}</span>
        </button>
        <p className="text-xs text-slate-400 max-w-lg">
          {listening ? translate(language, "report.voiceListening") : translate(language, "report.voiceTip")}
        </p>
      </div>
      {!speechSupported && (
        <p className="text-xs text-rose-300 mb-3">
          {translate(language, "report.voiceUnsupported")}
        </p>
      )}

      {/* Text Area */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={translate(language, "report.descriptionPlaceholder")}
        style={{
          width: "100%",
          height: "160px",
          borderRadius: "12px",
          background: "rgba(2,6,23,0.6)",
          border: "1px solid rgba(71,85,105,0.5)",
          padding: "16px 18px",
          color: "white",
          fontSize: "14px",
          outline: "none",
          resize: "none",
          lineHeight: "1.7",
          boxSizing: "border-box",
          fontFamily: "inherit",
        }}
      />

      <p className="mt-3 text-xs text-slate-600">
        {translate(language, "report.descriptionTip")}
      </p>
    </div>
  );
}

export default DescriptionBox;
