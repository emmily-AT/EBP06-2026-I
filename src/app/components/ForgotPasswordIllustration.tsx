import { motion } from 'motion/react';

export function ForgotPasswordIllustration() {
  const screenVariants = {
    animate: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const emailVariants = {
    animate: {
      y: [0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none"
    >
      {/* Background circle */}
      <motion.circle
        cx="100"
        cy="100"
        r="85"
        fill="#EEF2FF"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Desk */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <rect
          x="40"
          y="125"
          width="120"
          height="8"
          rx="2"
          fill="#94A3B8"
        />
      </motion.g>

      {/* Computer */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Monitor */}
        <rect
          x="85"
          y="75"
          width="60"
          height="45"
          rx="3"
          fill="#1E293B"
          stroke="#818CF8"
          strokeWidth="2"
        />

        {/* Screen glow */}
        <motion.rect
          x="90"
          y="80"
          width="50"
          height="35"
          fill="url(#screenGlow)"
          variants={screenVariants}
          animate="animate"
        />

        <defs>
          <linearGradient id="screenGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Monitor stand */}
        <rect
          x="107"
          y="120"
          width="16"
          height="8"
          rx="1"
          fill="#64748B"
        />
        <rect
          x="100"
          y="128"
          width="30"
          height="3"
          rx="1.5"
          fill="#94A3B8"
        />
      </motion.g>

      {/* Person sitting */}
      <motion.g
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {/* Head */}
        <circle cx="60" cy="85" r="18" fill="#FFDDB3" />

        {/* Hair */}
        <path
          d="M42 80 Q42 62 60 62 Q78 62 78 80"
          fill="#64748B"
        />

        {/* Focused eyes */}
        <ellipse cx="54" cy="83" rx="2" ry="2.5" fill="#475569" />
        <ellipse cx="66" cy="83" rx="2" ry="2.5" fill="#475569" />

        {/* Concentrated eyebrows */}
        <path
          d="M50 77 Q54 75 58 76"
          stroke="#475569"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M62 76 Q66 75 70 77"
          stroke="#475569"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Neutral mouth */}
        <line
          x1="56"
          y1="92"
          x2="64"
          y2="92"
          stroke="#475569"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Body */}
        <rect x="45" y="100" width="30" height="35" rx="5" fill="#818CF8" />

        {/* Arm pointing to computer */}
        <motion.path
          d="M75 105 Q85 105 90 100"
          stroke="#FFDDB3"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        />

        {/* Left arm */}
        <path
          d="M45 105 Q35 110 35 120"
          stroke="#FFDDB3"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      </motion.g>

      {/* Email icon floating */}
      <motion.g variants={emailVariants} animate="animate">
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <rect
            x="140"
            y="50"
            width="28"
            height="20"
            rx="3"
            fill="#F1F5F9"
            stroke="#818CF8"
            strokeWidth="2"
          />
          <path
            d="M140 52 L154 62 L168 52"
            stroke="#818CF8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.g>
      </motion.g>

      {/* Lock icon - representing password recovery */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 1 }}
      >
        <rect
          x="148"
          y="100"
          width="16"
          height="14"
          rx="2"
          fill="#FCD34D"
          opacity="0.8"
        />
        <path
          d="M152 100 L152 96 Q152 92 156 92 Q160 92 160 96 L160 100"
          stroke="#FCD34D"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </motion.g>

      {/* Decorative dots */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <circle cx="35" cy="60" r="3" fill="#818CF8" />
        <circle cx="45" cy="55" r="2" fill="#818CF8" />
        <circle cx="165" cy="130" r="2.5" fill="#818CF8" />
      </motion.g>
    </svg>
  );
}
