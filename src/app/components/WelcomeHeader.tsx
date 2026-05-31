import { useEffect, useState } from 'react';

interface WelcomeHeaderProps {
  userName: string;
}

const motivationalPhrases = [
  'Tu dinero, tus reglas',
  'Cada peso cuenta',
  'Ahorra hoy, disfruta mañana',
  'El control es poder',
  'Tus metas están más cerca',
];

export function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return { text: 'Buenos días', emoji: '☀️' };
    } else if (hour >= 12 && hour < 19) {
      return { text: 'Buenas tardes', emoji: '👋' };
    } else {
      return { text: 'Buenas noches', emoji: '🌙' };
    }
  };

  const greeting = getGreeting();
  const motivationalPhrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl md:rounded-3xl shadow-lg transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
      style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
      }}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative p-5 md:p-6 lg:p-7 space-y-2">
        <div>
          <p className="text-white/90 text-xs md:text-sm tracking-wide">{greeting.text}</p>
          <h1 className="text-white text-xl md:text-2xl mt-0.5">{userName}</h1>
        </div>

        {/* Motivational phrase */}
        <div className="pt-2.5 md:pt-3 border-t border-white/20">
          <p className="text-white/80 text-xs md:text-sm italic">{motivationalPhrase}</p>
        </div>
      </div>
    </div>
  );
}
