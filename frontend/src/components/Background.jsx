import { motion } from "framer-motion";

function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">

      {/* Top Glow */}
      <motion.div
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -50, 40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-96 h-96 rounded-full bg-cyan-500/20 blur-[120px] top-0 left-0"
      />

      {/* Bottom Glow */}
      <motion.div
        animate={{
          x: [0, -80, 40, 0],
          y: [0, 40, -40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute w-[450px] h-[450px] rounded-full bg-emerald-500/20 blur-[120px] bottom-0 right-0"
      />

      {/* Center Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
        className="absolute w-[300px] h-[300px] rounded-full bg-cyan-400/10 blur-[100px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      />

    </div>
  );
}

export default Background;