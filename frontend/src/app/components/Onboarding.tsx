import { useState } from 'react';
import { motion } from 'motion/react';
import { FinancialChaosIllustration } from './FinancialChaosIllustration';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep] = useState(0);
  const totalSteps = 3;

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-[375px] md:max-w-md lg:max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden relative flex flex-col" style={{ minHeight: 'min(812px, 90vh)' }}>
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-8 lg:px-12 pt-12 md:pt-16 pb-8 md:pb-12">
          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 md:mb-12"
          >
            <FinancialChaosIllustration />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-3 md:mb-4"
          >
            <h1 className="text-[#3D2C8D] mb-2 md:mb-3">Empieza ahora</h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-8 md:mb-12"
          >
            <p className="text-[#7B6FA0] text-sm md:text-base leading-relaxed max-w-[280px] md:max-w-sm mx-auto">
              Organiza tus finanzas de forma simple y recupera la tranquilidad
            </p>
          </motion.div>

          {/* Progress Dots */}
          

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <motion.button
              onClick={onComplete}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#3D2C8D] text-white min-h-[44px] py-3 md:py-4 px-6 rounded-2xl shadow-lg shadow-indigo-600/30 hover:bg-[#3D2C8D]/90 transition-colors duration-200"
            >
              Comenzar
            </motion.button>
          </motion.div>
        </div>

        {/* Decorative gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
