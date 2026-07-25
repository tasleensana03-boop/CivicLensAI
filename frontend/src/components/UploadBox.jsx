import { useRef, useState, useEffect } from "react";
import { FaCloudUploadAlt, FaCamera, FaTimes, FaCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function UploadBox({ image, setImage }) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [stream, setStream] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Start camera stream when modal opens
  useEffect(() => {
    if (!cameraOpen) return;

    setCameraError("");

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      })
      .catch(() => {
        setCameraError(
          "Camera access denied. Please allow camera permission in your browser settings."
        );
      });

    // Cleanup on close
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [cameraOpen]);

  const closeCamera = () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCameraOpen(false);
    setCameraError("");
  };

  // Capture current video frame as a File
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], `civic-photo-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });
      setImage(file);
      closeCamera();
    }, "image/jpeg", 0.92);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) setImage(file);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full flex flex-col"
        style={{ flex: 1 }}
      >
        {/* ── Drop / Preview zone ── */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="
            relative flex flex-col items-center justify-center
            w-full flex-1 min-h-[260px]
            rounded-2xl border border-dashed border-cyan-400/40
            bg-slate-900/50 backdrop-blur-xl overflow-hidden
            transition-all duration-300
            hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20
            group
          "
          style={{ flexGrow: 1 }}
        >
          {image ? (
            <>
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                <p className="text-white text-sm font-medium">Change image</p>
                <div className="flex gap-3">
                  <label
                    htmlFor="upload-gallery"
                    className="cursor-pointer px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-medium hover:bg-cyan-500/30 transition flex items-center gap-2"
                  >
                    <FaCloudUploadAlt /> Gallery
                  </label>
                  <button
                    type="button"
                    onClick={() => setCameraOpen(true)}
                    className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-medium hover:bg-cyan-500/30 transition flex items-center gap-2"
                  >
                    <FaCamera /> Camera
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #22d3ee 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="relative z-10 flex flex-col items-center gap-4 px-6 text-center">
                <div className="h-16 w-16 rounded-2xl bg-cyan-400/10 flex items-center justify-center group-hover:bg-cyan-400/20 transition">
                  <FaCloudUploadAlt className="text-cyan-400 text-3xl" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white mb-1">
                    Upload Civic Issue Image
                  </h2>
                  <p className="text-sm text-slate-400">
                    Drag & drop here, or use the buttons below
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    JPG • PNG • JPEG • up to 10MB
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Action buttons ── */}
        {!image && (
          <div style={{ display: "flex", gap: "10px", marginTop: "14px", marginBottom: "2px" }}>
            <label
              htmlFor="upload-gallery"
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                padding: "11px 0", borderRadius: "10px", cursor: "pointer",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(34,211,238,0.2)",
                color: "white", fontSize: "13px", fontWeight: 500,
              }}
            >
              <FaCloudUploadAlt style={{ color: "#22d3ee" }} />
              Choose from Gallery
            </label>

            <button
              type="button"
              onClick={() => setCameraOpen(true)}
              style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                padding: "11px 0", borderRadius: "10px",
                background: "rgba(34,211,238,0.08)",
                border: "1px solid rgba(34,211,238,0.25)",
                color: "white", fontSize: "13px", fontWeight: 500, cursor: "pointer",
              }}
            >
              <FaCamera style={{ color: "#22d3ee" }} />
              Take a Photo
            </button>
          </div>
        )}

        {/* Hidden gallery input */}
        <input
          id="upload-gallery"
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        {/* Selected file info */}
        {image && (
          <div className="mt-3 flex items-center justify-between px-1">
            <p className="text-cyan-400 text-sm font-medium truncate">
              ✅ {image.name}
            </p>
            <button
              type="button"
              onClick={() => setImage(null)}
              className="text-slate-500 hover:text-red-400 text-xs transition ml-3 shrink-0"
            >
              ✕ Remove
            </button>
          </div>
        )}
      </motion.div>

      {/* ── Camera Modal ── */}
      <AnimatePresence>
        {cameraOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(2, 6, 23, 0.92)" }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-lg rounded-3xl overflow-hidden border border-cyan-400/20 bg-slate-900 shadow-2xl shadow-cyan-500/20"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FaCamera className="text-cyan-400" />
                  <h3 className="text-white font-semibold">Take a Photo</h3>
                </div>
                <button
                  onClick={closeCamera}
                  className="h-8 w-8 rounded-full bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>

              {/* Camera feed or error */}
              <div className="relative bg-black" style={{ aspectRatio: "4/3" }}>
                {cameraError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                    <div className="text-4xl">📷</div>
                    <p className="text-slate-300 text-sm">{cameraError}</p>
                    <p className="text-slate-500 text-xs">
                      On Chrome: click the camera icon in the address bar → Allow
                    </p>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Viewfinder corners */}
                {!cameraError && (
                  <>
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br-lg" />
                  </>
                )}
              </div>

              {/* Capture button */}
              {!cameraError && (
                <div className="flex items-center justify-center py-5 bg-slate-900">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="h-16 w-16 rounded-full bg-white flex items-center justify-center hover:bg-cyan-100 transition shadow-lg shadow-white/20 active:scale-95"
                  >
                    <FaCircle className="text-cyan-500 text-3xl" />
                  </button>
                </div>
              )}
            </motion.div>

            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default UploadBox;
