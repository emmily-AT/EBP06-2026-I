import { useState } from 'react';
import { ArrowLeft, Mail, Lock, CheckCircle } from 'lucide-react';
import { ForgotPasswordIllustration } from './ForgotPasswordIllustration';

interface ForgotPasswordProps {
  onBack: () => void;
}

type Step = 'request' | 'confirmation' | 'reset';

export function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; newPassword?: string; confirmPassword?: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRequestReset = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Ingresa un correo electrónico válido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    // Aquí iría la lógica de envío de correo
    setStep('confirmation');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { newPassword?: string; confirmPassword?: string } = {};

    if (!newPassword.trim()) {
      newErrors.newPassword = 'La contraseña es obligatoria';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    // Aquí iría la lógica de actualización de contraseña
    alert('Contraseña restablecida exitosamente');
    onBack();
  };

  const handleGoToReset = () => {
    setStep('reset');
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] p-4 md:p-6 lg:p-8 flex items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-md lg:max-w-lg relative z-10">
        {/* Request Reset Password */}
        {step === 'request' && (
          <>
            <div className="mb-6 md:mb-8 text-center">
              <div className="inline-flex items-center justify-center mb-4 md:mb-6">
                <ForgotPasswordIllustration />
              </div>
              <h1 className="text-[#3D2C8D] mb-1">Recuperar contraseña</h1>
              <p className="text-[#7B6FA0] text-sm md:text-base">Ingresa tu correo electrónico para restablecer tu contraseña</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-[#D8D0F0] p-5 md:p-6 lg:p-8">
              {/* Back Button */}
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-[#7B6FA0] hover:text-[#3D2C8D] mb-6 transition-colors rounded-lg px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-1"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Volver al inicio</span>
              </button>

              {/* Form */}
              <form onSubmit={handleRequestReset} className="space-y-4 md:space-y-5">
                <div className="space-y-2">
                  <label className="block text-[#3D2C8D]">Correo electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="tu@email.com"
                    className={`w-full px-4 py-3 md:py-3.5 bg-slate-50 border rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 min-h-[44px] ${
                      errors.email ? 'border-red-300 bg-red-50/50 focus-visible:border-red-400' : 'border-slate-200 focus-visible:border-[#3D2C8D] focus-visible:bg-white'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs md:text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.email}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0D0D0D] text-white border-2 border-[#3D2C8D] min-h-[56px] py-4 rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-2"
                >
                  Enviar enlace de recuperación
                </button>
              </form>
            </div>
          </>
        )}

        {/* Confirmation Message */}
        {step === 'confirmation' && (
          <>
            <div className="mb-6 md:mb-8 text-center">
              <div className="inline-flex items-center justify-center mb-4 md:mb-6">
                <ForgotPasswordIllustration />
              </div>
              <h1 className="text-[#3D2C8D] mb-1">Correo enviado</h1>
              <p className="text-[#7B6FA0] text-sm md:text-base">Revisa tu bandeja de entrada</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-[#D8D0F0] p-5 md:p-6 lg:p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <p className="text-[#7B6FA0] text-sm mb-2">
                  Hemos enviado un enlace de recuperación a:
                </p>
                <p className="text-[#3D2C8D] font-medium text-base mb-4">{email}</p>
                <p className="text-slate-500 text-xs md:text-sm">
                  Sigue las instrucciones para restablecer tu contraseña
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleGoToReset}
                  className="w-full bg-[#0D0D0D] text-white border-2 border-[#3D2C8D] min-h-[56px] py-4 rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-2"
                >
                  Continuar con el restablecimiento
                </button>
                <button
                  onClick={onBack}
                  className="w-full text-[#7B6FA0] hover:text-[#3D2C8D] py-3 transition-colors text-sm rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-1"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </div>
          </>
        )}

        {/* Reset Password Form */}
        {step === 'reset' && (
          <>
            <div className="mb-6 md:mb-8 text-center">
              <div className="inline-flex items-center justify-center mb-4 md:mb-6">
                <ForgotPasswordIllustration />
              </div>
              <h1 className="text-[#3D2C8D] mb-1">Restablecer contraseña</h1>
              <p className="text-[#7B6FA0] text-sm md:text-base">Ingresa tu nueva contraseña</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-[#D8D0F0] p-5 md:p-6 lg:p-8">
              <form onSubmit={handleResetPassword} className="space-y-4 md:space-y-5">
                <div className="space-y-2">
                  <label className="block text-[#3D2C8D]">Nueva contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors({ ...errors, newPassword: undefined });
                    }}
                    placeholder="Mínimo 6 caracteres"
                    className={`w-full px-4 py-3 md:py-3.5 bg-slate-50 border rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 min-h-[44px] ${
                      errors.newPassword ? 'border-red-300 bg-red-50/50 focus-visible:border-red-400' : 'border-slate-200 focus-visible:border-[#3D2C8D] focus-visible:bg-white'
                    }`}
                  />
                  {errors.newPassword && (
                    <p className="text-xs md:text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-[#3D2C8D]">Confirmar contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    placeholder="Repite tu contraseña"
                    className={`w-full px-4 py-3 md:py-3.5 bg-slate-50 border rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 min-h-[44px] ${
                      errors.confirmPassword ? 'border-red-300 bg-red-50/50 focus-visible:border-red-400' : 'border-slate-200 focus-visible:border-[#3D2C8D] focus-visible:bg-white'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs md:text-sm text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0D0D0D] text-white border-2 border-[#3D2C8D] min-h-[56px] py-4 rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-2"
                >
                  Restablecer contraseña
                </button>

                <button
                  type="button"
                  onClick={onBack}
                  className="w-full text-[#7B6FA0] hover:text-[#3D2C8D] py-3 transition-colors text-sm rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-1"
                >
                  Cancelar
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
