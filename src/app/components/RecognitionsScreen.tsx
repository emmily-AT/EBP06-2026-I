import { ChevronLeft, Award, CheckCircle2, Circle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRecognitions } from '../hooks/useRecognitions';
import type { Recognition } from '../hooks/useRecognitions';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface RecognitionsScreenProps {
  onBack: () => void;
}

export function RecognitionsScreen({ onBack }: RecognitionsScreenProps) {
  const { user } = useAuth();
  const { recognitions, loading, obtainedCount, pendingCount, currentRecognition } = useRecognitions(user?.id);

  const positiveRecognitions = recognitions.filter(r => r.tier === 'positive');
  const negativeRecognitions = recognitions.filter(r => r.tier === 'negative');

  return (
    <div className="min-h-screen bg-[#F7F5F0] p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#3D2C8D] mb-4 hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-2 rounded-lg p-1"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-[15px]">Volver al perfil</span>
          </button>

          <div className="flex items-center gap-3 mb-3">
            <Award className="w-7 h-7 text-[#3D2C8D]" />
            <h1 className="text-[#3D2C8D] text-[28px] md:text-[32px]">Reconocimiento Financiero</h1>
          </div>

          <p className="text-slate-600 text-[15px] md:text-[16px] leading-relaxed max-w-3xl">
            Tus hábitos financieros construyen tu historial. Cada reconocimiento refleja cómo has administrado tus ingresos, gastos y presupuestos a lo largo del tiempo.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-12 flex items-center justify-center">
            <div className="text-slate-400 text-[15px]">Cargando reconocimientos...</div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Obtained */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-[14px] mb-1">Obtenidos</p>
                    <p className="text-[#3D2C8D] text-[28px] font-semibold">{obtainedCount}</p>
                  </div>
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
              </div>

              {/* Pending */}
              <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-[14px] mb-1">Pendientes</p>
                    <p className="text-slate-600 text-[28px] font-semibold">{pendingCount}</p>
                  </div>
                  <Circle className="w-10 h-10 text-slate-300" />
                </div>
              </div>

              {/* Current */}
              <div className="bg-gradient-to-br from-[#3D2C8D] to-[#4c1d95] rounded-2xl shadow-sm p-5 text-white">
                <div className="flex flex-col h-full">
                  <p className="text-white/90 text-[14px] mb-2">Reconocimiento actual</p>
                  {currentRecognition ? (
                    <div className="flex items-center gap-2 mt-auto">
                      <span className="text-3xl">{currentRecognition.badge}</span>
                      <p className="text-white text-[16px] font-medium leading-tight flex-1">
                        {currentRecognition.name}
                      </p>
                    </div>
                  ) : (
                    <p className="text-white/70 text-[14px] mt-auto">Sin reconocimiento activo</p>
                  )}
                </div>
              </div>
            </div>

            {/* Positive Recognitions */}
            <div className="mb-8">
              <h2 className="text-[#3D2C8D] font-semibold text-[20px] md:text-[22px] mb-4">
                Reconocimientos Positivos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {positiveRecognitions.map((recognition) => (
                  <RecognitionCard key={recognition.id} recognition={recognition} />
                ))}
              </div>
            </div>

            {/* Negative Recognitions */}
            <div>
              <h2 className="text-[#3D2C8D] font-semibold text-[20px] md:text-[22px] mb-4">
                Reconocimientos de Advertencia
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {negativeRecognitions.map((recognition) => (
                  <RecognitionCard key={recognition.id} recognition={recognition} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface RecognitionCardProps {
  recognition: Recognition;
}

function RecognitionCard({ recognition }: RecognitionCardProps) {
  const isPositive = recognition.tier === 'positive';

  return (
    <div
      className={`rounded-2xl shadow-sm border-2 p-6 transition-all ${
        recognition.obtained
          ? isPositive
            ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-lg'
            : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-lg'
          : 'bg-white border-slate-200 opacity-60'
      }`}
    >
      <div className="flex items-start gap-4 mb-4">
        {/* Badge */}
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl flex-shrink-0 ${
            recognition.obtained
              ? isPositive
                ? 'bg-gradient-to-br from-amber-300 to-yellow-400 shadow-md'
                : 'bg-gradient-to-br from-red-300 to-orange-400 shadow-md'
              : 'bg-slate-200'
          }`}
        >
          {recognition.obtained ? (
            recognition.badge
          ) : (
            <span className="opacity-40">{recognition.badge}</span>
          )}
        </div>

        {/* Status */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3
              className={`font-semibold text-[18px] leading-tight ${
                recognition.obtained
                  ? isPositive
                    ? 'text-amber-900'
                    : 'text-red-900'
                  : 'text-slate-400'
              }`}
            >
              {recognition.name}
            </h3>
          </div>
          {recognition.obtained && (
            <div className="flex items-center gap-1.5 text-[13px]">
              <CheckCircle2 className={`w-4 h-4 ${isPositive ? 'text-green-600' : 'text-orange-600'}`} />
              <span className={isPositive ? 'text-green-700' : 'text-orange-700'}>
                Obtenido
              </span>
            </div>
          )}
          {!recognition.obtained && (
            <div className="flex items-center gap-1.5 text-[13px]">
              <Circle className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">No obtenido</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p
        className={`text-[14px] leading-relaxed ${
          recognition.obtained
            ? isPositive
              ? 'text-amber-800'
              : 'text-red-800'
            : 'text-slate-400'
        }`}
      >
        {recognition.description}
      </p>

      {/* Date */}
      {recognition.obtained && recognition.obtainedAt && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-[13px] text-slate-500">
            Obtenido el {format(new Date(recognition.obtainedAt), "d 'de' MMMM 'de' yyyy", { locale: es })}
          </p>
        </div>
      )}
    </div>
  );
}
