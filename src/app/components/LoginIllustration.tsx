import { motion } from 'motion/react';

export function LoginIllustration() {
  const doorVariants = {
    animate: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const arrowVariants = {
    animate: {
      x: [0, 8, 0],
      transition: {
        duration: 1.8,
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

      {/* Door frame */}
      <motion.g
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <rect
          x="125"
          y="60"
          width="45"
          height="70"
          rx="3"
          fill="#F1F5F9"
          stroke="#818CF8"
          strokeWidth="2.5"
        />

        {/* Door handle */}
        <circle cx="162" cy="95" r="3" fill="#818CF8" />

        {/* Door opening glow */}
        <motion.rect
          x="127"
          y="63"
          width="8"
          height="64"
          fill="url(#doorGlow)"
          variants={doorVariants}
          animate="animate"
        />

        <defs>
          <linearGradient id="doorGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </motion.g>

      {/* Person - confident and relaxed */}
      <motion.g
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* Head */}
        <circle cx="80" cy="85" r="20" fill="#FFDDB3" />

        {/* Hair */}
        <path
          d="M60 80 Q60 60 80 60 Q100 60 100 80"
          fill="#64748B"
        />

        {/* Confident eyes */}
        <ellipse cx="74" cy="83" rx="2.5" ry="3" fill="#475569" />
        <ellipse cx="86" cy="83" rx="2.5" ry="3" fill="#475569" />

        {/* Relaxed eyebrows */}
        <path
          d="M70 77 Q74 76 78 77"
          stroke="#475569"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M82 77 Q86 76 90 77"
          stroke="#475569"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Gentle smile */}
        <path
          d="M74 92 Q80 95 86 92"
          stroke="#475569"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Body */}
        <rect x="65" y="103" width="30" height="40" rx="6" fill="#818CF8" />

        {/* Arms - relaxed position */}
        <path
          d="M65 110 Q55 115 50 130"
          stroke="#FFDDB3"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M95 110 Q105 115 110 130"
          stroke="#FFDDB3"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
      </motion.g>

      {/* Forward arrow - representing entry */}
      <motion.g variants={arrowVariants} animate="animate">
        <path
          d="M100 95 L115 95"
          stroke="#4F46E5"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M110 90 L115 95 L110 100"
          stroke="#4F46E5"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </motion.g>

      {/* Small checkmark - subtle confidence indicator */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
      >
        <circle cx="145" cy="140" r="12" fill="#10B981" opacity="0.2" />
        <path
          d="M140 140 L143 143 L150 136"
          stroke="#10B981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </motion.g>

      {/* Decorative dots */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <circle cx="35" cy="60" r="3" fill="#818CF8" />
        <circle cx="45" cy="55" r="2" fill="#818CF8" />
        <circle cx="38" cy="140" r="2.5" fill="#818CF8" />
      </motion.g>
    </svg>
  );
}
