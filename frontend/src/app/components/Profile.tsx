import { ChevronRight, LogOut, X, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { userService } from '../api/userService';

interface ProfileProps {
  onBack: () => void;
}

export function Profile({ onBack }: ProfileProps) {
  const { user, logout } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [showEmailMask, setShowEmailMask] = useState(true);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);

  const maskEmail = (email: string) => {
    if (!email) return '';
    const [local, domain] = email.split('@');
    return `${local.substring(0, 1)}***${local.substring(local.length - 1)}@${domain}`;
  };

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Todos los campos son obligatorios');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden');
      return;
    }
    if (!validatePassword(newPassword)) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial');
      return;
    }

    try {
      await userService.updatePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setTimeout(() => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordModal(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (e: any) {
      const message = e.response?.data?.message || e.message || 'Error al actualizar la contraseña';
      setPasswordError(message);
    }
  };

  const handleTerminateSessions = async () => {
    try {
      await userService.terminateSessions();
      setSessions([]);
      setShowSessionsModal(false);
    } catch (e) {
      console.error('Error terminating sessions');
    }
  };

  const openSessionsModal = () => {
    setShowSessionsModal(true);
    userService.getSessions()
      .then(res => setSessions(res.data))
      .catch(console.error);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] p-4 md:p-6 lg:p-8 flex items-start justify-center pt-8 md:pt-12 lg:pt-16">
      <div className="w-full max-w-md lg:max-w-2xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-[#3D2C8D] mb-1 text-[30px]">Mi perfil</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-6 md:p-8 mb-5">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-[#FFD200] rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl font-semibold text-white text-[#000000]">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-slate-900 mb-1 text-[24px]">{user?.name}</h2>
            <p className="text-slate-500">{user?.email}</p>
          </div>
        </div>

        {/* Account Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] mb-5">
          <div className="divide-y divide-slate-100">
            {/* Name */}
            <div className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
              <span className="text-slate-900">Nombre</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">{user?.name}</span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            {/* Email with Masking */}
            <div className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
              <span className="text-slate-900">Correo</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">
                  {showEmailMask ? maskEmail(user?.email || '') : user?.email}
                </span>
                <button onClick={() => setShowEmailMask(!showEmailMask)} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                  {showEmailMask ? <Eye className="w-4 h-4 text-slate-400" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                </button>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            {/* Currency */}
            <div className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
              <span className="text-slate-900">Moneda</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">{user?.currency || 'COP'}</span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
              <span className="text-slate-900">Rol</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">{user?.role || 'Usuario'}</span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            {/* Password */}
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
            >
              <span className="text-slate-900">Contraseña</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">••••••••</span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </button>

            {/* Sessions */}
            <button
              onClick={openSessionsModal}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
            >
              <span className="text-slate-900">Sesiones Activas</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Ver sesiones</span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </button>
          </div>
        </div>

        {/* Actions Card - Responsive Hierarchy */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] flex flex-col md:flex-row gap-3 p-4">
          <button
            onClick={logout}
            className="flex-1 flex items-center justify-center gap-2 p-5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
          <button
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-2 p-5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 transition-colors font-medium"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Volver
          </button>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <>
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setShowPasswordModal(false)} />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
              <div className="bg-white rounded-2xl shadow-2xl border border-[#D8D0F0] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl text-[#3D2C8D]">Cambiar contraseña</h2>
                  <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                {passwordSuccess && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-green-700 text-sm">¡Contraseña actualizada exitosamente!</p>
                  </div>
                )}
                {passwordError && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-sm">{passwordError}</p>
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Contraseña actual</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Nueva contraseña</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-700 mb-2">Confirmar nueva contraseña</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={handleChangePassword} className="flex-1 bg-[#0D0D0D] text-white border-2 border-[#3D2C8D] py-3 rounded-xl hover:shadow-md active:scale-[0.98] transition-all">
                    Actualizar contraseña
                  </button>
                  <button onClick={() => setShowPasswordModal(false)} className="px-6 py-3 text-slate-500 hover:text-slate-700 transition-colors">
                    Cancelar
                  </button>
                </div>
                </div>
              </div>
            </>
          )}

        {/* Sessions Modal */}
        {showSessionsModal && (
          <>
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setShowSessionsModal(false)} />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
              <div className="bg-white rounded-2xl shadow-2xl border border-[#D8D0F0] p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl text-[#3D2C8D]">Sesiones Activas</h2>
                  <button onClick={() => setShowSessionsModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                <div className="space-y-3">
                  {sessions.length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <p className="text-sm text-slate-500">No hay sesiones activas</p>
                    </div>
                  ) : (
                    sessions.map((session: any) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <span role="img" aria-label="device" className="w-5 h-5 text-slate-400 flex items-center justify-center">📱</span>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{session.device || 'Desconocido'}</p>
                            <p className="text-xs text-slate-500">{session.ipAddress || ''}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-6 flex gap-3">
                  <button onClick={handleTerminateSessions} className="flex-1 bg-[#0D0D0D] text-white py-3 rounded-xl hover:shadow-md transition-all">
                    Cerrar sesión en otros equipos
                  </button>
                  <button onClick={() => setShowSessionsModal(false)} className="px-6 py-3 text-slate-500 hover:text-slate-700 transition-colors">
                    Cancelar
                  </button>
                </div>
                </div>
              </div>
            </>
          )}
      </div>
    </div>
  );
}
