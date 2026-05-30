import { ChevronRight, X, Award, Lightbulb } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useCallback, useEffect, useRef } from 'react';
import { RecognitionCard } from './RecognitionCard';
import { useRecognition } from '../hooks/useRecognition';
import { useRecommendations } from '../hooks/useRecommendations';
import { useNotifications } from '../contexts/NotificationContext';
import * as LucideIcons from 'lucide-react';

interface ProfileProps {
  onBack: () => void;
  onNavigateRecognitions: () => void;
  highlightRecommendationId?: string; // ID de recomendación a resaltar al llegar
}

export function Profile({ onBack, onNavigateRecognitions, highlightRecommendationId }: ProfileProps) {
  const { user, logout, updateUser } = useAuth();
  const { recognition, loading } = useRecognition(user?.id);
  const { addNotification } = useNotifications();
  const recommendationRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleNewRecommendation = useCallback((recommendation: any) => {
    addNotification({
      message: `Nueva recomendación: ${recommendation.title}`,
      type: 'recommendation',
      recommendationId: recommendation.id,
    });
  }, [addNotification]);

  const { recommendations, loading: loadingRecommendations } = useRecommendations(user?.id, handleNewRecommendation);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Scroll automático a la recomendación resaltada
  useEffect(() => {
    if (highlightRecommendationId && recommendationRefs.current[highlightRecommendationId]) {
      setTimeout(() => {
        recommendationRefs.current[highlightRecommendationId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    }
  }, [highlightRecommendationId, recommendations]);
  const [editField, setEditField] = useState<'name' | 'email' | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);

  const handleEditOpen = (field: 'name' | 'email') => {
    setEditField(field);
    setEditValue(field === 'name' ? user?.name || '' : user?.email || '');
    setEditError('');
    setEditSuccess(false);
  };

  const handleEditSave = () => {
    if (!editField) return;
    const val = editValue.trim();
    if (!val) { setEditError('Este campo es obligatorio'); return; }
    if (editField === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEditError('Correo inválido'); return;
    }
    const result = updateUser({ [editField]: val });
    if (!result.success) { setEditError(result.error || 'Error al actualizar'); return; }
    setEditSuccess(true);
    setTimeout(() => { setEditField(null); setEditSuccess(false); }, 1200);
  };
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleChangePassword = () => {
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Todos los campos son obligatorios');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Simulate password change (in a real app, this would call an API)
    setPasswordSuccess(true);
    setTimeout(() => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordModal(false);
      setPasswordSuccess(false);
    }, 2000);
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
            {/* Avatar */}
            <div className="w-24 h-24 bg-[#FFD200] rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl font-semibold text-white text-[#000000]">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* User Info */}
            <h2 className="text-slate-900 mb-1 text-[24px]">{user?.name}</h2>
            <p className="text-slate-500">{user?.email}</p>
          </div>
        </div>

        {/* Account Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] mb-5">
          {/* Name */}
          <button onClick={() => handleEditOpen('name')} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors border-b border-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-inset">
            <span className="text-slate-900">Nombre</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">{user?.name}</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </button>

          {/* Email */}
          <button onClick={() => handleEditOpen('email')} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors border-b border-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-inset">
            <span className="text-slate-900">Correo</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">{user?.email}</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </button>

          {/* Password */}
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors border-b border-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-inset"
          >
            <span className="text-slate-900">Contraseña</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">••••••••</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </button>

          {/* Notifications */}
          <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors border-b border-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-inset">
            <span className="text-slate-900">Notificaciones</span>
            <div className="flex items-center gap-2">
              <span className="text-green-600">Activas</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </button>

          {/* Recognitions */}
          <button
            onClick={onNavigateRecognitions}
            className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-inset"
          >
            <span className="text-slate-900">Reconocimiento Financiero</span>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Recognition Section */}
        {recognition && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-[#3D2C8D]" />
              <h2 className="text-[#3D2C8D] font-semibold text-[20px]">Reconocimiento financiero</h2>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-8 flex items-center justify-center">
                <div className="text-slate-400">Cargando...</div>
              </div>
            ) : (
              <RecognitionCard
                name={recognition.name}
                description={recognition.description}
                badge={recognition.badge}
                badgeType={recognition.badgeType}
              />
            )}
          </div>
        )}

        {/* Recommendations Section */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-[#3D2C8D]" />
            <h2 className="text-[#3D2C8D] font-semibold text-[20px]">Recomendaciones para ti</h2>
          </div>

          {loadingRecommendations ? (
            <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-8 flex items-center justify-center">
              <div className="text-slate-400">Cargando recomendaciones...</div>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-[15px] mb-2">No hay recomendaciones disponibles</p>
                <p className="text-slate-400 text-[14px]">
                  Continúa usando la aplicación para recibir recomendaciones personalizadas
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  ref={(el) => {
                    recommendationRefs.current[recommendation.id] = el;
                  }}
                >
                  <RecommendationCard
                    recommendation={recommendation}
                    isHighlighted={highlightRecommendationId === recommendation.id}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0]">
          <button
            onClick={logout}
            className="w-full flex items-center justify-between p-5 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-inset"
          >
            <span className="text-red-600">Cerrar sesión</span>
            <ChevronRight className="w-5 h-5 text-red-600" />
          </button>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={onBack}
            className="w-full text-slate-500 py-3 hover:text-slate-700 transition-colors rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-1"
          >
            Volver
          </button>
        </div>
      </div>

      {/* Edit Name/Email Modal */}
      {editField && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setEditField(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-[#D8D0F0] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl text-[#3D2C8D]">{editField === 'name' ? 'Editar nombre' : 'Editar correo'}</h2>
                <button onClick={() => setEditField(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-1">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              {editSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-700 text-sm">¡Actualizado correctamente!</p>
                </div>
              )}
              {editError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-sm">{editError}</p>
                </div>
              )}
              <div>
                <label className="block text-sm text-slate-700 mb-2">{editField === 'name' ? 'Nombre' : 'Correo electrónico'}</label>
                <input
                  type={editField === 'email' ? 'email' : 'text'}
                  value={editValue}
                  onChange={(e) => { setEditValue(e.target.value); setEditError(''); }}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 focus-visible:border-[#3D2C8D]"
                />
              </div>
              <div className="flex flex-col gap-3 mt-6">
                <button onClick={() => setEditField(null)} className="w-full min-h-[48px] py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-1">
                  Cancelar
                </button>
                <button
                  onClick={handleEditSave}
                  className="w-full min-h-[56px] py-4 bg-[#0D0D0D] text-white border-2 border-[#3D2C8D] rounded-xl hover:shadow-md active:scale-[0.98] transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-2"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setShowPasswordModal(false)} />

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-[#D8D0F0] p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl text-[#3D2C8D]">Cambiar contraseña</h2>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-1"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Success Message */}
              {passwordSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-700 text-sm">¡Contraseña actualizada exitosamente!</p>
                </div>
              )}

              {/* Error Message */}
              {passwordError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-sm">{passwordError}</p>
                </div>
              )}

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Contraseña actual</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 focus-visible:border-[#3D2C8D]"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Nueva contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 focus-visible:border-[#3D2C8D]"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-700 mb-2">Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 focus-visible:border-[#3D2C8D]"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError('');
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="w-full min-h-[48px] py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleChangePassword}
                  className="w-full min-h-[56px] py-4 bg-[#0D0D0D] text-white border-2 border-[#3D2C8D] rounded-xl hover:shadow-md active:scale-[0.98] transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-2"
                >
                  Actualizar contraseña
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface RecommendationCardProps {
  recommendation: {
    id: string;
    icon: string;
    title: string;
    description: string;
  };
  isHighlighted?: boolean;
}

function RecommendationCard({ recommendation, isHighlighted }: RecommendationCardProps) {
  // Intentar obtener el ícono de lucide-react
  const IconComponent = (LucideIcons as any)[recommendation.icon];
  const isEmoji = !IconComponent && /[\p{Emoji}]/u.test(recommendation.icon);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border p-5 hover:shadow-md transition-all ${
      isHighlighted
        ? 'border-[#3D2C8D] shadow-lg ring-2 ring-[#3D2C8D]/20'
        : 'border-[#D8D0F0]'
    }`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 bg-gradient-to-br from-[#3D2C8D]/10 to-[#4c1d95]/10 rounded-xl flex items-center justify-center flex-shrink-0">
          {IconComponent ? (
            <IconComponent className="w-6 h-6 text-[#3D2C8D]" />
          ) : isEmoji ? (
            <span className="text-2xl">{recommendation.icon}</span>
          ) : (
            <Lightbulb className="w-6 h-6 text-[#3D2C8D]" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-slate-900 font-semibold text-[16px] mb-1 leading-tight">
            {recommendation.title}
          </h3>
          <p className="text-slate-600 text-[14px] leading-relaxed">
            {recommendation.description}
          </p>
        </div>
      </div>
    </div>
  );
}
