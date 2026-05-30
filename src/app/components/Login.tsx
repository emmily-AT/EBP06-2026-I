import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginIllustration } from './LoginIllustration';
import { AccessibilityButton } from './AccessibilityButton';

interface LoginProps {
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

export function Login({ onSwitchToRegister, onForgotPassword }: LoginProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState('');
  const [errors, setErrors] = useState({ email: false, password: false, general: '' });
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: !email || !validateEmail(email),
      password: !password || password.length < 6,
      general: ''
    };

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      setIsLoading(true);
      const result = await login(email, password);
      setIsLoading(false);

      if (!result.success) {
        setErrors({ ...newErrors, general: result.error || 'Error al iniciar sesión' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] p-4 md:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Decorative blurred shapes */}
      
      

      <div className="w-full max-w-md lg:max-w-lg relative z-10">
        <div className="mb-6 md:mb-8 text-center">
          <div className="inline-flex items-center justify-center mb-4 md:mb-6">
            <LoginIllustration />
          </div>
          <h1 className="text-[#3D2C8D] mb-1">Iniciar sesión</h1>
          <p className="text-[#7B6FA0] text-sm md:text-base">Continúa tu camino hacia el orden financiero</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-[#D8D0F0] p-5 md:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-[#3D2C8D]">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email && validateEmail(e.target.value)) {
                    setErrors(prev => ({ ...prev, email: false, general: '' }));
                  }
                }}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput('')}
                placeholder="tu@email.com"
                className={`w-full px-4 py-3 md:py-3.5 bg-slate-50 border rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 min-h-[44px] ${
                  errors.email
                    ? 'border-red-300 bg-red-50/50 focus-visible:border-red-400'
                    : focusedInput === 'email'
                    ? 'border-primary bg-white'
                    : 'border-slate-200 focus-visible:border-[#3D2C8D] focus-visible:bg-white'
                }`}
              />
              {errors.email && (
                <p className="text-xs md:text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  Ingresa un correo válido
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-[#3D2C8D]">
                  Contraseña
                </label>
                
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password && e.target.value.length >= 6) {
                    setErrors(prev => ({ ...prev, password: false, general: '' }));
                  }
                }}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput('')}
                placeholder="••••••••"
                className={`w-full px-4 py-3 md:py-3.5 bg-slate-50 border rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 min-h-[44px] ${
                  errors.password
                    ? 'border-red-300 bg-red-50/50 focus-visible:border-red-400'
                    : focusedInput === 'password'
                    ? 'border-primary bg-white'
                    : 'border-slate-200 focus-visible:border-[#3D2C8D] focus-visible:bg-white'
                }`}
              />
              {errors.password && (
                <p className="text-xs md:text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  La contraseña debe tener al menos 6 caracteres
                </p>
              )}
            </div>

            {errors.general && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-sm md:text-base text-red-900">{errors.general}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0D0D0D] text-white border-2 border-[#3D2C8D] min-h-[56px] py-4 rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-2"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>

        <div className="mt-5 md:mt-6 text-center space-y-3">
          <p className="text-sm md:text-base">
            <button
              onClick={onForgotPassword}
              className="text-primary hover:underline min-h-[44px] inline-flex items-center rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-1"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </p>
          <p className="text-slate-600 text-sm md:text-base">
            ¿No tienes una cuenta?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-primary hover:underline min-h-[44px] inline-flex items-center rounded-lg px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-1"
            >
              Regístrate
            </button>
          </p>
        </div>
      </div>

      {/* Accessibility Button */}
      <AccessibilityButton />
    </div>
  );
}
