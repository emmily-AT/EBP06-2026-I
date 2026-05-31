import { motion } from 'motion/react';

export function FinancialChaosIllustration() {
  // Floating animation variants
  const floatingVariants = {
    animate: (custom: number) => ({
      y: [0, -10, 0],
      rotate: [0, custom * 2, 0],
      transition: {
        duration: 3 + custom * 0.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    }),
  };

  const billVariants = {
    animate: (custom: number) => ({
      x: [0, custom * 5, 0],
      y: [0, -8, 0],
      rotate: [custom * -2, custom * 2, custom * -2],
      transition: {
        duration: 2.5 + custom * 0.3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    }),
  };

  return (
    <svg
      width="280"
      height="280"
      viewBox="0 0 280 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none"
    >
      {/* Background circle */}
      <motion.circle
        cx="140"
        cy="140"
        r="120"
        fill="#EEF2FF"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Scattered bills and papers */}
      <motion.g custom={0} variants={billVariants} animate="animate">
        <rect
          x="60"
          y="50"
          width="50"
          height="30"
          rx="4"
          fill="#FEE2E2"
          stroke="#EF4444"
          strokeWidth="2"
        />
        <line x1="68" y1="60" x2="90" y2="60" stroke="#EF4444" strokeWidth="2" />
        <line x1="68" y1="68" x2="102" y2="68" stroke="#EF4444" strokeWidth="2" />
      </motion.g>

      <motion.g custom={1} variants={billVariants} animate="animate">
        <rect
          x="170"
          y="40"
          width="50"
          height="30"
          rx="4"
          fill="#FEF3C7"
          stroke="#F59E0B"
          strokeWidth="2"
          transform="rotate(15 195 55)"
        />
        <line
          x1="178"
          y1="50"
          x2="200"
          y2="50"
          stroke="#F59E0B"
          strokeWidth="2"
          transform="rotate(15 189 50)"
        />
        <line
          x1="178"
          y1="58"
          x2="212"
          y2="58"
          stroke="#F59E0B"
          strokeWidth="2"
          transform="rotate(15 195 58)"
        />
      </motion.g>

      <motion.g custom={2} variants={billVariants} animate="animate">
        <rect
          x="40"
          y="200"
          width="55"
          height="35"
          rx="4"
          fill="#DBEAFE"
          stroke="#3B82F6"
          strokeWidth="2"
          transform="rotate(-10 67.5 217.5)"
        />
        <line
          x1="48"
          y1="212"
          x2="72"
          y2="212"
          stroke="#3B82F6"
          strokeWidth="2"
          transform="rotate(-10 60 212)"
        />
        <line
          x1="48"
          y1="222"
          x2="87"
          y2="222"
          stroke="#3B82F6"
          strokeWidth="2"
          transform="rotate(-10 67.5 222)"
        />
      </motion.g>

      {/* Floating coins */}
      <motion.g custom={1.5} variants={floatingVariants} animate="animate">
        <circle cx="210" cy="180" r="16" fill="#FBBF24" stroke="#F59E0B" strokeWidth="3" />
        <text x="210" y="187" textAnchor="middle" fontSize="20" fill="#F59E0B" fontWeight="bold">
          $
        </text>
      </motion.g>

      <motion.g custom={2} variants={floatingVariants} animate="animate">
        <circle cx="70" cy="150" r="12" fill="#FBBF24" stroke="#F59E0B" strokeWidth="2.5" />
        <text x="70" y="155" textAnchor="middle" fontSize="14" fill="#F59E0B" fontWeight="bold">
          $
        </text>
      </motion.g>

      {/* Person - Head */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <circle cx="140" cy="115" r="28" fill="#FFDDB3" />

        {/* Hair */}
        <path
          d="M112 110 Q112 85 140 85 Q168 85 168 110"
          fill="#64748B"
        />

        {/* Worried eyes */}
        <motion.g
          animate={{
            scaleY: [1, 0.3, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        >
          <ellipse cx="130" cy="112" rx="3" ry="4" fill="#475569" />
          <ellipse cx="150" cy="112" rx="3" ry="4" fill="#475569" />
        </motion.g>

        {/* Worried eyebrows */}
        <path
          d="M125 104 Q130 102 135 104"
          stroke="#475569"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M145 104 Q150 102 155 104"
          stroke="#475569"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Worried mouth */}
        <path
          d="M130 125 Q140 122 150 125"
          stroke="#475569"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </motion.g>

      {/* Person - Body */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <rect x="120" y="140" width="40" height="55" rx="8" fill="#818CF8" />

        {/* Arms in stressed position */}
        <motion.path
          d="M120 150 Q100 155 95 175"
          stroke="#FFDDB3"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              'M120 150 Q100 155 95 175',
              'M120 150 Q100 158 97 178',
              'M120 150 Q100 155 95 175',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.path
          d="M160 150 Q180 155 185 175"
          stroke="#FFDDB3"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              'M160 150 Q180 155 185 175',
              'M160 150 Q180 158 183 178',
              'M160 150 Q180 155 185 175',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.g>

      {/* Stress symbols */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      >
        <path
          d="M170 95 L175 85 L180 95"
          stroke="#EF4444"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M100 95 L105 85 L110 95"
          stroke="#EF4444"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </motion.g>

      {/* Additional floating document */}
      <motion.g custom={1.2} variants={floatingVariants} animate="animate">
        <rect
          x="185"
          y="210"
          width="45"
          height="28"
          rx="3"
          fill="#FEE2E2"
          stroke="#DC2626"
          strokeWidth="2"
          transform="rotate(20 207.5 224)"
        />
        <line
          x1="192"
          y1="218"
          x2="210"
          y2="218"
          stroke="#DC2626"
          strokeWidth="1.5"
          transform="rotate(20 201 218)"
        />
        <line
          x1="192"
          y1="225"
          x2="223"
          y2="225"
          stroke="#DC2626"
          strokeWidth="1.5"
          transform="rotate(20 207.5 225)"
        />
      </motion.g>
    </svg>
  );
}
