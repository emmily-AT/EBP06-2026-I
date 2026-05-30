import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type FontSize = 'normal' | 'large' | 'xlarge';

interface AccessibilityContextType {
  fontSize: FontSize;
  highContrast: boolean;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleHighContrast: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem('accessibility_fontSize');
    return (saved as FontSize) || 'normal';
  });

  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem('accessibility_highContrast');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('accessibility_fontSize', fontSize);

    // Apply font size class to body
    document.body.classList.remove('font-size-normal', 'font-size-large', 'font-size-xlarge');
    document.body.classList.add(`font-size-${fontSize}`);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('accessibility_highContrast', String(highContrast));

    // Apply high contrast class to body
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const increaseFontSize = () => {
    setFontSize((current) => {
      if (current === 'normal') return 'large';
      if (current === 'large') return 'xlarge';
      return current;
    });
  };

  const decreaseFontSize = () => {
    setFontSize((current) => {
      if (current === 'xlarge') return 'large';
      if (current === 'large') return 'normal';
      return current;
    });
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        highContrast,
        increaseFontSize,
        decreaseFontSize,
        toggleHighContrast,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
