import { useState, useRef } from 'react';
import { DollarSign, Briefcase, TrendingUp, Gift, PiggyBank, RotateCcw, HelpCircle, Wallet, CalendarIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const categories = [
  { id: 'salary', name: 'Salario', icon: Briefcase, color: 'bg-blue-100 text-blue-600' },
  { id: 'freelance', name: 'Freelance', icon: DollarSign, color: 'bg-purple-100 text-purple-600' },
  { id: 'investment', name: 'Inversión', icon: TrendingUp, color: 'bg-green-100 text-green-600' },
  { id: 'bonus', name: 'Bono', icon: Gift, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'gift', name: 'Regalo', icon: Gift, color: 'bg-pink-100 text-pink-600' },
  { id: 'savings', name: 'Ahorro', icon: PiggyBank, color: 'bg-indigo-100 text-indigo-600' },
  { id: 'refund', name: 'Reembolso', icon: RotateCcw, color: 'bg-teal-100 text-teal-600' },
  { id: 'other', name: 'Otro', icon: Wallet, color: 'bg-slate-100 text-slate-600' },
];

interface IncomeProps {
  onBack: () => void;
}

export function Income({ onBack }: IncomeProps) {
  const { user } = useAuth();
  const today = new Date();

  // Calculate one year ago from today
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // Calculate one month from today
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  const [date, setDate] = useState<Date | undefined>(today);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('0');
  const [focusedInput, setFocusedInput] = useState('');
  const [errors, setErrors] = useState({ category: false, description: false, amount: false, date: false });
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
    if (!numbers) return '0';
    const num = parseInt(numbers);
    return new Intl.NumberFormat('es-ES').format(num);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setAmount(formatted);
    if (errors.amount && formatted && formatted !== '0') {
      setErrors(prev => ({ ...prev, amount: false }));
    }
  };

  const handleSave = () => {
    const newErrors = {
      date: !date,
      category: !selectedCategory,
      description: false, // Description is now optional
      amount: !amount || amount === '0',
    };

    setErrors(newErrors);

    if (!newErrors.date && !newErrors.category && !newErrors.amount) {
      const categoryName = categories.find(c => c.id === selectedCategory)?.name || '';
      setSavedCategoryName(categoryName);
      setSavedAmount(amount);

      // Save income to localStorage
      const newIncome = {
        id: Math.random().toString(36).substr(2, 9),
        date: date ? format(date, 'yyyy-MM-dd') : '',
        createdAt: new Date().toISOString(),
        categoryId: selectedCategory,
        categoryName,
        description,
        amount,
        userId: user?.id || ''
      };

      const existingIncomes = JSON.parse(localStorage.getItem('incomes') || '[]');
      existingIncomes.push(newIncome);
      localStorage.setItem('incomes', JSON.stringify(existingIncomes));

      setShowToast(true);

      setTimeout(() => {
        setDate(today);
        setSelectedCategory('');
        setDescription('');
        setAmount('0');
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
          <h1 className="text-[#3D2C8D] mb-1">Registrar ingreso</h1>
          <p className="text-[#7B6FA0] text-sm md:text-base">Mantén constancia de todos tus ingresos mensuales</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-5 md:p-6 lg:p-8 space-y-5 md:space-y-6">

          {/* Date Input */}
          <div className="space-y-2">
            <label htmlFor="date" className="block text-[#3D2C8D]">
              Fecha
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={`w-full px-4 py-3 md:py-3.5 bg-slate-50 border rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 focus-visible:border-[#3D2C8D] focus-visible:bg-white min-h-[44px] flex items-center justify-between text-left ${
                    errors.date ? 'border-red-300 bg-red-50/50' : 'border-slate-200'
                  }`}
                >
                  <span className={date ? 'text-slate-900' : 'text-slate-400'}>
                    {date ? format(date, "dd/MM/yyyy", { locale: es }) : "Selecciona una fecha"}
                  </span>
                  <CalendarIcon className="w-4 h-4 text-slate-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate);
                    if (errors.date && newDate) {
                      setErrors(prev => ({ ...prev, date: false }));
                    }
                  }}
                  disabled={(date) => {
                    return date < oneYearAgo || date > oneMonthFromNow;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                Selecciona una fecha
              </p>
            )}
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <label className="block text-[#3D2C8D]">
              Categoría
            </label>
            <div
              ref={categoryGridRef}
              role="radiogroup"
              aria-label="Categoría del ingreso"
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
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-[#3D2C8D]">
              Descripción del ingreso <span className="text-slate-400 text-sm">(opcional)</span>
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description && e.target.value.trim()) {
                  setErrors(prev => ({ ...prev, description: false }));
                }
              }}
              onFocus={() => setFocusedInput('description')}
              onBlur={() => setFocusedInput('')}
              placeholder="Ej: Pago mensual de proyecto..."
              className={`w-full px-4 py-3 md:py-3.5 bg-slate-50 border rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 min-h-[44px] ${
                errors.description
                  ? 'border-red-300 bg-red-50/50 focus-visible:border-red-400'
                  : focusedInput === 'description'
                  ? 'border-primary bg-white'
                  : 'border-slate-200 focus-visible:border-[#3D2C8D] focus-visible:bg-white'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                Ingresa una descripción
              </p>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-[#3D2C8D]">
              Monto del ingreso
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
                  El ingreso quedará almacenado en tu historial financiero
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
            Guardar ingreso
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
                <p className="text-slate-900 font-medium">¡Ingreso guardado!</p>
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