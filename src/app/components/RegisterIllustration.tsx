import { motion } from 'motion/react';

export function RegisterIllustration() {
  const checkVariants = {
    animate: (custom: number) => ({
      scale: [1, 1.1, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        delay: custom * 0.3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    }),
  };

  const listItemVariants = {
    animate: (custom: number) => ({
      opacity: [0.4, 1],
      transition: {
        duration: 0.6,
        delay: custom * 0.2,
      },
    }),
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

      {/* Checklist board */}
      <motion.g
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <rect
          x="115"
          y="50"
          width="60"
          height="80"
          rx="4"
          fill="#FFFFFF"
          stroke="#CBD5E1"
          strokeWidth="2"
        />

        {/* Checklist items */}
        <motion.g custom={0} variants={listItemVariants} initial={{ opacity: 0 }} animate="animate">
          <circle cx="125" cy="65" r="4" fill="none" stroke="#10B981" strokeWidth="2" />
          <motion.path
            d="M123 65 L125 67 L128 63"
            stroke="#10B981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          />
          <line x1="135" y1="65" x2="165" y2="65" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        </motion.g>

        <motion.g custom={1} variants={listItemVariants} initial={{ opacity: 0 }} animate="animate">
          <circle cx="125" cy="80" r="4" fill="none" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="135" y1="80" x2="165" y2="80" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        </motion.g>

        <motion.g custom={2} variants={listItemVariants} initial={{ opacity: 0 }} animate="animate">
          <circle cx="125" cy="95" r="4" fill="none" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="135" y1="95" x2="160" y2="95" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        </motion.g>

        <motion.g custom={3} variants={listItemVariants} initial={{ opacity: 0 }} animate="animate">
          <circle cx="125" cy="110" r="4" fill="none" stroke="#CBD5E1" strokeWidth="2" />
          <line x1="135" y1="110" x2="155" y2="110" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
        </motion.g>
      </motion.g>

      {/* Person - taking action */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* Head */}
        <circle cx="65" cy="90" r="20" fill="#FFDDB3" />

        {/* Hair */}
        <path
          d="M45 85 Q45 65 65 65 Q85 65 85 85"
          fill="#64748B"
        />

        {/* Determined eyes */}
        <ellipse cx="59" cy="88" rx="2.5" ry="3.5" fill="#475569" />
        <ellipse cx="71" cy="88" rx="2.5" ry="3.5" fill="#475569" />

        {/* Focused eyebrows */}
        <path
          d="M55 82 Q59 80 63 81"
          stroke="#475569"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M67 81 Q71 80 75 82"
          stroke="#475569"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Determined smile */}
        <path
          d="M58 98 Q65 101 72 98"
          stroke="#475569"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Body */}
        <rect x="50" y="108" width="30" height="40" rx="6" fill="#818CF8" />

        {/* Left arm - reaching forward */}
        <motion.path
          d="M50 115 Q40 120 35 135"
          stroke="#FFDDB3"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Right arm - raised up (taking action) */}
        <motion.path
          d="M80 115 Q95 105 100 75"
          stroke="#FFDDB3"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          animate={{
            d: [
              'M80 115 Q95 105 100 75',
              'M80 115 Q95 102 102 72',
              'M80 115 Q95 105 100 75',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Hand pointing up */}
        <motion.circle
          cx="100"
          cy="75"
          r="5"
          fill="#FFDDB3"
          animate={{
            cy: [75, 72, 75],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.g>

      {/* Success sparkles */}
      <motion.g custom={0} variants={checkVariants} animate="animate">
        <path
          d="M110 40 L111 45 L110 40 L105 41 L110 40"
          fill="#FBBF24"
          stroke="#F59E0B"
          strokeWidth="1"
        />
      </motion.g>

      <motion.g custom={1} variants={checkVariants} animate="animate">
        <path
          d="M180 70 L181 75 L180 70 L175 71 L180 70"
          fill="#FBBF24"
          stroke="#F59E0B"
          strokeWidth="1"
        />
      </motion.g>

      <motion.g custom={2} variants={checkVariants} animate="animate">
        <path
          d="M175 125 L176 130 L175 125 L170 126 L175 125"
          fill="#FBBF24"
          stroke="#F59E0B"
          strokeWidth="1"
        />
      </motion.g>

      {/* "New" indicator */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8, type: 'spring' }}
      >
        <circle cx="30" cy="130" r="14" fill="#818CF8" />
        <text
          x="30"
          y="135"
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          fill="#FFFFFF"
        >
          +
        </text>
      </motion.g>

      {/* Decorative elements */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <circle cx="25" cy="60" r="3" fill="#10B981" />
        <circle cx="35" cy="55" r="2" fill="#10B981" />
      </motion.g>
    </svg>
  );
}
