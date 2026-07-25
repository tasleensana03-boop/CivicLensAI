import { motion } from "framer-motion";

/**
 * Reusable Button component
 *
 * Props:
 *  - onClick   : click handler
 *  - children  : button label / content
 *  - variant   : "primary" (default) | "outline" | "ghost"
 *  - size      : "sm" | "md" (default) | "lg"
 *  - disabled  : boolean
 *  - className : extra Tailwind classes
 *  - type      : button type ("button" | "submit") — defaults to "button"
 */
function Button({
  onClick,
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
}) {
  const base = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-xl transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variants = {
    primary: `
      bg-gradient-to-r from-cyan-500 to-blue-600
      hover:from-cyan-400 hover:to-blue-500
      text-white shadow-lg shadow-cyan-500/30
    `,
    outline: `
      border border-cyan-400 text-cyan-400
      hover:bg-cyan-500/10
    `,
    ghost: `
      bg-slate-800 text-slate-200
      hover:bg-slate-700 border border-slate-700
    `,
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}

export default Button;
