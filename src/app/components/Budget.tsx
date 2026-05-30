import { useState, useRef } from 'react';
import { ShoppingCart, Car, Home, Film, Heart, GraduationCap, ShoppingBag, Wallet } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const categories = [
  { id: 'food', name: 'Alimentación', icon: ShoppingCart, color: 'bg-orange-100 text-orange-600' },
  { id: 'transport', name: 'Transporte', icon: Car, color: 'bg-blue-100 text-blue-600' },
  { id: 'housing', name: 'Vivienda', icon: Home, color: 'bg-purple-100 text-purple-600' },
  { id: 'entertainment', name: 'Entretenimiento', icon: Film, color: 'bg-pink-100 text-pink-600' },
  { id: 'health', name: 'Salud', icon: Heart, color: 'bg-red-100 text-red-600' },
  { id: 'education', name: 'Educación', icon: GraduationCap, color: 'bg-green-100 text-green-600' },
  { id: 'shopping', name: 'Compras', icon: ShoppingBag, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'other', name: 'Otros', icon: Wallet, color: 'bg-slate-100 text-slate-600' },
];

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

interface BudgetProps {
  onBack: () => void;
}

export function Budget({ onBack }: BudgetProps) {
  const { user } = useAuth();
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [focusedInput, setFocusedInput] = useState('');
  const [errors, setErrors] = useState({ category: false, amount: false, customCategory: false });
  const [showToast, setShowToast] = useState(false);
  const [savedCategoryName, setSavedCategoryName] = useState('');
  const [savedAmount, setSavedAmount] = useState('');

  const categoryGridRef = useRef<HTMLDivElement>(null);

  const handleCategoryKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const cols = 4;
    const total = categories.length;
    let nextIndex = -1;

    if (e.key === 'ArrowRight') nextIndex = Math.min(index + 1, total - 1);
    else if (e.key === 'ArrowLeft') nextIndex = Math.max(index - 1, 0);
    else if (e.key === 'ArrowDown') nextIndex = Math.min(index + cols, total - 1);
    else if (e.key === 'ArrowUp') nextIndex = Math.max(index - cols, 0);
    else return;

    e.preventDefault();
    const buttons = categoryGridRef.current?.querySelectorAll<HTMLButtonElement>('button');
    buttons?.[nextIndex]?.focus();
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (!numbers) return '';
    const num = parseInt(numbers);
    return new Intl.NumberFormat('es-ES').format(num);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setAmount(formatted);
    if (errors.amount && formatted) {
      setErrors(prev => ({ ...prev, amount: false }));
    }
  };

  const handleSave = () => {
    const newErrors = {
      category: !selectedCategory,
      amount: !amount || amount === '0',
      customCategory: selectedCategory === 'other' && !customCategory.trim()
    };

    setErrors(newErrors);

    if (!newErrors.category && !newErrors.amount && !newErrors.customCategory) {
      const categoryName = selectedCategory === 'other'
        ? customCategory
        : categories.find(c => c.id === selectedCategory)?.name || '';
      setSavedCategoryName(categoryName);
      setSavedAmount(amount);

      // Save budget to localStorage
      const newBudget = {
        id: Math.random().toString(36).substr(2, 9),
        categoryId: selectedCategory,
        categoryName,
        amount,
        month: selectedMonth,
        userId: user?.id || ''
      };

      const existingBudgets = JSON.parse(localStorage.getItem('budgets') || '[]');
      existingBudgets.push(newBudget);
      localStorage.setItem('budgets', JSON.stringify(existingBudgets));

      setShowToast(true);

      setTimeout(() => {
        setSelectedCategory('');
        setCustomCategory('');
        setAmount('');
      }, 500);

      setTimeout(() => {
        setShowToast(false);
        onBack(); // Return to home after saving
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] p-4 md:p-6 lg:p-8 flex items-start justify-center pt-8 md:pt-12 lg:pt-16">
      <div className="w-full max-w-md lg:max-w-2xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-[#3D2C8D] mb-1">Crear presupuesto</h1>
          <p className="text-[#7B6FA0] text-sm md:text-base">Define tus límites de gasto mensuales</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-5 md:p-6 lg:p-8 space-y-5 md:space-y-6">

          {/* Month Selector */}
          <div className="space-y-2">
            <label htmlFor="month" className="block text-[#3D2C8D]">
              Mes
            </label>
            <div className="relative">
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full px-4 py-3 md:py-3.5 bg-slate-50 border border-slate-200 rounded-xl appearance-none cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 focus-visible:border-[#3D2C8D] focus-visible:bg-white min-h-[44px]"
              >
                {months.map((month, index) => (
                  <option key={index} value={index} disabled={index < currentMonth}>
                    {month}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg width="16" height="16" className="md:w-5 md:h-5" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label className="block text-[#3D2C8D]">
              Categoría
            </label>
            <div
              ref={categoryGridRef}
              role="radiogroup"
              aria-label="Categoría del presupuesto"
              className={`grid grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-xl border transition-all ${
                errors.category ? 'border-red-300 bg-red-50/50' : 'border-[#D8D0F0]'
              }`}>
              {categories.map((category, index) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                return (
                  <button
                    key={category.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={isSelected || (!selectedCategory && index === 0) ? 0 : -1}
                    onKeyDown={(e) => handleCategoryKeyDown(e, index)}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      if (errors.category) {
                        setErrors(prev => ({ ...prev, category: false }));
                      }
                    }}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-lg transition-all h-[90px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-1 ${
                      isSelected
                        ? `${category.color} scale-95 shadow-sm`
                        : 'bg-white hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                    <span className="text-[13px] text-center leading-tight">{category.name}</span>
                  </button>
                );
              })}
            </div>
            {errors.category && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                Selecciona una categoría
              </p>
            )}
            {selectedCategory === 'other' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => {
                    setCustomCategory(e.target.value);
                    if (errors.customCategory && e.target.value.trim()) {
                      setErrors(prev => ({ ...prev, customCategory: false }));
                    }
                  }}
                  onFocus={() => setFocusedInput('customCategory')}
                  onBlur={() => setFocusedInput('')}
                  placeholder="Escribe el nombre de la categoría"
                  className={`w-full px-4 py-3 md:py-3.5 bg-slate-50 border rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 min-h-[44px] ${
                    errors.customCategory
                      ? 'border-red-300 bg-red-50/50 focus-visible:border-red-400'
                      : focusedInput === 'customCategory'
                      ? 'border-primary bg-white'
                      : 'border-slate-200 focus-visible:border-[#3D2C8D] focus-visible:bg-white'
                  }`}
                />
                {errors.customCategory && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                    <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                    Ingresa un nombre para la categoría
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-[#3D2C8D]">
              Monto del presupuesto
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base md:text-lg">
                $
              </div>
              <input
                id="amount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                onFocus={() => setFocusedInput('amount')}
                onBlur={() => setFocusedInput('')}
                placeholder="0"
                className={`w-full pl-8 pr-4 py-3.5 md:py-4 bg-slate-50 border rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 min-h-[44px] ${
                  errors.amount
                    ? 'border-red-300 bg-red-50/50 focus-visible:border-red-400'
                    : focusedInput === 'amount'
                    ? 'border-primary bg-white'
                    : 'border-slate-200 focus-visible:border-[#3D2C8D] focus-visible:bg-white'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                Ingresa un monto válido
              </p>
            )}
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 md:p-5">
            <div className="flex gap-3">
              <div className="text-blue-600 mt-0.5 flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10 10V14M10 6V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm md:text-base text-blue-900">
                  Recibirás una notificación cuando alcances el 80% de tu presupuesto
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 mt-6 md:mt-8">
          <button
            onClick={handleSave}
            className="w-full bg-[#0D0D0D] text-white border-2 border-[#3D2C8D] min-h-[56px] py-4 rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all font-medium text-[17px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-2"
          >
            Guardar presupuesto
          </button>
          <button
            onClick={onBack}
            className="w-full text-slate-500 min-h-[48px] py-3 hover:text-slate-700 transition-colors rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-1"
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-40"></div>

          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-white rounded-2xl shadow-2xl border border-green-200 px-6 py-4 flex items-center gap-4 min-w-[320px]">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
                  <svg
                    className="w-6 h-6 text-green-600 animate-check-draw"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeDasharray="24"
                      strokeDashoffset="24"
                      style={{
                        animation: 'drawCheck 0.5s ease-out 0.2s forwards'
                      }}
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-slate-900 font-medium">¡Presupuesto guardado!</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {savedCategoryName} - ${savedAmount}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}