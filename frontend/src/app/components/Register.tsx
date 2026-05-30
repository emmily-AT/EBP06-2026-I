import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RegisterIllustration } from './RegisterIllustration';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export function Register({ onSwitchToLogin }: RegisterProps) {
  const { register, login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState('');
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    general: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: !name.trim(),
      email: !email || !validateEmail(email),
      password: !password || password.length < 6,
      confirmPassword: password !== confirmPassword,
      general: ''
    };

    setErrors(newErrors);

    if (!newErrors.name && !newErrors.email && !newErrors.password && !newErrors.confirmPassword) {
      setIsLoading(true);
      const registerResult = await register(name, email, password);

      if (!registerResult.success) {
        setIsLoading(false);
        setErrors({ ...newErrors, general: registerResult.error || 'Error al crear la cuenta' });
      } else {
        // Auto-login after successful registration
        const loginResult = await login(email, password);
        setIsLoading(false);

        if (!loginResult.success) {
          setErrors({ ...newErrors, general: 'Cuenta creada pero hubo un error al iniciar sesión. Por favor, inicia sesión manualmente.' });
        }
        // If login succeeds, the AuthContext will automatically update and redirect to dashboard
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] p-4 md:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Decorative blurred shapes */}
      
      

      <div className="w-full max-w-md lg:max-w-lg relative z-10">
        <div className="mb-6 md:mb-8 text-center">
          <div className="inline-flex items-center justify-center mb-4 md:mb-6">
            <RegisterIllustration />
          </div>
          <h1 className="text-[#3D2C8D] mb-1">Crear cuenta</h1>
          <p className="text-[#7B6FA0] text-sm md:text-base">Da el primer paso hacia tus finanzas organizadas</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-[#D8D0F0] p-5 md:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-[#3D2C8D]">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name && e.target.value.trim()) {
                    setErrors(prev => ({ ...prev, name: false, general: '' }));
                  }
                }}
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput('')}
                placeholder="Juan Pérez"
                className={`w-full px-4 py-3 md:py-3.5 bg-slate-50 border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px] ${
                  errors.name
                    ? 'border-red-300 bg-red-50/50 focus:border-red-400'
                    : focusedInput === 'name'
                    ? 'border-primary bg-white'
                    : 'border-slate-200 focus:border-primary focus:bg-white'
                }`}
              />
              {errors.name && (
                <p className="text-xs md:text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  Ingresa tu nombre completo
                </p>
              )}
            </div>

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
                className={`w-full px-4 py-3 md:py-3.5 bg-slate-50 border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px] ${
                  errors.email
                    ? 'border-red-300 bg-red-50/50 focus:border-red-400'
                    : focusedInput === 'email'
                    ? 'border-primary bg-white'
                    : 'border-slate-200 focus:border-primary focus:bg-white'
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
              <label htmlFor="password" className="block text-[#3D2C8D]">
                Contraseña
              </label>
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
                className={`w-full px-4 py-3 md:py-3.5 bg-slate-50 border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px] ${
                  errors.password
                    ? 'border-red-300 bg-red-50/50 focus:border-red-400'
                    : focusedInput === 'password'
                    ? 'border-primary bg-white'
                    : 'border-slate-200 focus:border-primary focus:bg-white'
                }`}
              />
              {errors.password && (
                <p className="text-xs md:text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  La contraseña debe tener al menos 6 caracteres
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-[#3D2C8D]">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword && e.target.value === password) {
                    setErrors(prev => ({ ...prev, confirmPassword: false, general: '' }));
                  }
                }}
                onFocus={() => setFocusedInput('confirmPassword')}
                onBlur={() => setFocusedInput('')}
                placeholder="••••••••"
                className={`w-full px-4 py-3 md:py-3.5 bg-slate-50 border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px] ${
                  errors.confirmPassword
                    ? 'border-red-300 bg-red-50/50 focus:border-red-400'
                    : focusedInput === 'confirmPassword'
                    ? 'border-primary bg-white'
                    : 'border-slate-200 focus:border-primary focus:bg-white'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-xs md:text-sm text-red-600 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                  Las contraseñas no coinciden
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
              className="w-full bg-[#0D0D0D] text-white border-2 border-[#3D2C8D] min-h-[44px] py-3 md:py-4 rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creando cuenta e iniciando sesión...' : 'Crear cuenta'}
            </button>
          </form>
        </div>

        <div className="mt-5 md:mt-6 text-center">
          <p className="text-slate-600 text-sm md:text-base">
            ¿Ya tienes una cuenta?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-primary hover:underline min-h-[44px] inline-flex items-center"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
