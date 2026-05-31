import { useState, useRef, useEffect } from 'react';
import { Type, Contrast, Plus, Minus, Check } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

export function AccessibilityButton() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { fontSize, highContrast, increaseFontSize, decreaseFontSize, toggleHighContrast } = useAccessibility();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close menu on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const fontSizeLabel = fontSize === 'normal' ? 'Normal' : fontSize === 'large' ? 'Grande' : 'Muy grande';
  const canIncrease = fontSize !== 'xlarge';
  const canDecrease = fontSize !== 'normal';

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50">
      {/* Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute bottom-full right-0 mb-3 bg-white rounded-2xl shadow-xl border-2 border-[#3D2C8D] p-4 w-72 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <h3 className="text-[#3D2C8D] font-semibold mb-4 text-[17px]">Opciones de accesibilidad</h3>

          {/* Font Size Control */}
          <div className="mb-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-[#3D2C8D]" />
              <span className="text-slate-700 text-[15px] font-medium">Tamaño de texto</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={decreaseFontSize}
                disabled={!canDecrease}
                className={`flex-1 min-h-[48px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all ${
                  canDecrease
                    ? 'border-[#3D2C8D] text-[#3D2C8D] hover:bg-[#EEEDFE] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-2'
                    : 'border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                aria-label="Disminuir tamaño de texto"
              >
                <Minus className="w-4 h-4" />
                <span className="text-[14px] font-medium">A-</span>
              </button>
              <div className="flex-1 text-center">
                <span className="text-[14px] text-slate-600">{fontSizeLabel}</span>
              </div>
              <button
                onClick={increaseFontSize}
                disabled={!canIncrease}
                className={`flex-1 min-h-[48px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all ${
                  canIncrease
                    ? 'border-[#3D2C8D] text-[#3D2C8D] hover:bg-[#EEEDFE] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-2'
                    : 'border-slate-200 text-slate-400 cursor-not-allowed'
                }`}
                aria-label="Aumentar tamaño de texto"
              >
                <Plus className="w-4 h-4" />
                <span className="text-[14px] font-medium">A+</span>
              </button>
            </div>
          </div>

          {/* High Contrast Toggle */}
          <div>
            <button
              onClick={toggleHighContrast}
              className="w-full min-h-[48px] flex items-center justify-between px-4 py-3 rounded-xl border-2 border-[#3D2C8D] hover:bg-[#EEEDFE] transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-2"
              aria-label={highContrast ? 'Desactivar alto contraste' : 'Activar alto contraste'}
              aria-pressed={highContrast}
            >
              <div className="flex items-center gap-2">
                <Contrast className="w-4 h-4 text-[#3D2C8D]" />
                <span className="text-slate-700 text-[15px] font-medium">Alto contraste</span>
              </div>
              <div
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  highContrast ? 'bg-[#3D2C8D]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform flex items-center justify-center ${
                    highContrast ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                >
                  {highContrast && <Check className="w-3 h-3 text-[#3D2C8D]" />}
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#3D2C8D] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-100 transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD200] focus-visible:ring-offset-2"
        aria-label="Abrir opciones de accesibilidad"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="font-bold text-[18px]">A+</span>
      </button>
    </div>
  );
}
