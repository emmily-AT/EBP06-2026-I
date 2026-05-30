import { Plus, Briefcase, DollarSign, TrendingUp, Gift, PiggyBank, RotateCcw, Wallet, Edit2, Trash2, X, CalendarIcon } from 'lucide-react';
import { SidebarLayout } from './SidebarLayout';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
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

const categoryIcons = {
  'salary': Briefcase,
  'freelance': DollarSign,
  'investment': TrendingUp,
  'bonus': Gift,
  'gift': Gift,
  'savings': PiggyBank,
  'refund': RotateCcw,
  'other': Wallet,
};

const categoryColors = {
  'salary': 'bg-blue-100 text-blue-600',
  'freelance': 'bg-purple-100 text-purple-600',
  'investment': 'bg-green-100 text-green-600',
  'bonus': 'bg-yellow-100 text-yellow-600',
  'gift': 'bg-pink-100 text-pink-600',
  'savings': 'bg-indigo-100 text-indigo-600',
  'refund': 'bg-teal-100 text-teal-600',
  'other': 'bg-slate-100 text-slate-600',
};

interface Income {
  id: string;
  date: string;
  categoryId: string;
  categoryName: string;
  description: string;
  amount: string;
  userId: string;
  createdAt?: string;
}

interface IncomesScreenProps {
  onNavigate: (page: 'home' | 'budgets' | 'incomes' | 'expenses' | 'reports') => void;
  onCreateIncome: () => void;
  onProfileClick: () => void;
}

export function IncomesScreen({ onNavigate, onCreateIncome, onProfileClick }: IncomesScreenProps) {
  const { user } = useAuth();
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  // Edit form states
  const [editDate, setEditDate] = useState<Date | undefined>(undefined);
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('0');
  const [focusedInput, setFocusedInput] = useState('');
  const [errors, setErrors] = useState({ category: false, description: false, amount: false, date: false });

  const loadIncomes = () => {
    if (user) {
      const allIncomes = JSON.parse(localStorage.getItem('incomes') || '[]');
      const userIncomes = allIncomes.filter((i: Income) => i.userId === user.id);
      userIncomes.sort((a: Income, b: Income) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setIncomes(userIncomes);
    }
  };

  useEffect(() => {
    loadIncomes();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('es-ES', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (!numbers) return '0';
    const num = parseInt(numbers);
    return new Intl.NumberFormat('es-ES').format(num);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setEditAmount(formatted);
    if (errors.amount && formatted && formatted !== '0') {
      setErrors(prev => ({ ...prev, amount: false }));
    }
  };

  const handleDelete = (id: string) => {
    const allIncomes = JSON.parse(localStorage.getItem('incomes') || '[]');
    const filtered = allIncomes.filter((i: Income) => i.id !== id);
    localStorage.setItem('incomes', JSON.stringify(filtered));
    loadIncomes();
    setDeleteConfirm(null);
  };

  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    setEditDate(new Date(income.date));
    setEditCategory(income.categoryId);
    setEditDescription(income.description);
    setEditAmount(income.amount);
    setErrors({ category: false, description: false, amount: false, date: false });
  };

  const handleSaveEdit = () => {
    const newErrors = {
      date: !editDate,
      category: !editCategory,
      description: false,
      amount: !editAmount || editAmount === '0',
    };

    setErrors(newErrors);

    if (!newErrors.date && !newErrors.category && !newErrors.amount && editingIncome) {
      const allIncomes = JSON.parse(localStorage.getItem('incomes') || '[]');
      const updatedIncomes = allIncomes.map((i: Income) => {
        if (i.id === editingIncome.id) {
          return {
            ...i,
            date: editDate ? format(editDate, 'yyyy-MM-dd') : i.date,
            categoryId: editCategory,
            categoryName: categories.find(c => c.id === editCategory)?.name || '',
            description: editDescription,
            amount: editAmount,
          };
        }
        return i;
      });
      localStorage.setItem('incomes', JSON.stringify(updatedIncomes));
      loadIncomes();
      setEditingIncome(null);
    }
  };

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  return (
    <SidebarLayout currentPage="incomes" onNavigate={onNavigate} onProfileClick={onProfileClick}>
      <div className="flex-1 p-4 pt-8 md:p-6 xl:p-8 pb-24 xl:pb-8 bg-[#F7F5F0]">
        <div className="w-full max-w-md md:max-w-3xl xl:max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-[#3D2C8D] text-[30px]">Ingresos</h1>
            <button
              onClick={onCreateIncome}
              className="bg-primary text-primary-foreground px-5 md:px-6 py-3.5 rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center gap-2 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline">Registrar ingreso</span>
              <span className="md:hidden">Crear</span>
            </button>
          </div>

          {/* Empty State */}
          {incomes.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-6 md:p-8">
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
                </div>
                <h2 className="text-[#26215C] text-lg md:text-xl mb-2">No tienes ingresos registrados</h2>
                <p className="text-[#7B6FA0] text-sm md:text-base leading-relaxed max-w-lg mx-auto">
                  Comienza a llevar un registro de todos tus ingresos mensuales
                </p>
              </div>
            </div>
          )}

          {/* Incomes Grid */}
          {incomes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
              {incomes.map((income) => {
                const Icon = categoryIcons[income.categoryId as keyof typeof categoryIcons] || Wallet;
                const color = categoryColors[income.categoryId as keyof typeof categoryColors] || 'bg-slate-100 text-slate-600';

                return (
                  <div
                    key={income.id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-5">
                      {/* Header with Icon and Name */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`min-w-[44px] min-h-[44px] w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-900 font-medium truncate">{income.categoryName}</p>
                          <p className="text-sm text-slate-500">{formatDate(income.date)}</p>
                          {income.description && (
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{income.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Amount and Badge */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-green-600 font-semibold text-lg">
                          +${income.amount}
                        </span>
                        <span className="text-xs px-2.5 py-1.5 rounded-lg bg-green-100 text-green-700 font-medium">
                          Recibido
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons Footer — always visible for touch accessibility */}
                    <div className="border-t border-slate-100 grid grid-cols-2 divide-x divide-slate-100">
                      <button
                        onClick={() => handleEdit(income)}
                        className="flex items-center justify-center gap-2 py-3.5 min-h-[48px] text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-inset"
                        aria-label={`Editar ingreso ${income.categoryName}`}
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(income.id)}
                        className="flex items-center justify-center gap-2 py-3.5 min-h-[48px] text-sm font-medium text-red-500 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-inset"
                        aria-label={`Eliminar ingreso ${income.categoryName}`}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setDeleteConfirm(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-[#D8D0F0] p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900">¿Eliminar ingreso?</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Esta acción no se puede deshacer.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="w-full bg-slate-100 text-slate-700 py-4 min-h-[56px] rounded-xl hover:bg-slate-200 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="w-full bg-red-600 text-white py-4 min-h-[56px] rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar permanentemente
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editingIncome && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setEditingIncome(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-[#D8D0F0] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl text-[#3D2C8D]">Editar ingreso</h2>
                <button
                  onClick={() => setEditingIncome(null)}
                  className="p-2 min-w-[44px] min-h-[44px] hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-1"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Date Input */}
                <div className="space-y-2">
                  <label htmlFor="edit-date" className="block text-[#3D2C8D]">Fecha</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 min-h-[44px] flex items-center justify-between text-left ${
                          errors.date ? 'border-red-300 bg-red-50/50' : 'border-slate-200'
                        }`}
                      >
                        <span className={editDate ? 'text-slate-900' : 'text-slate-400'}>
                          {editDate ? format(editDate, "dd/MM/yyyy", { locale: es }) : "Selecciona una fecha"}
                        </span>
                        <CalendarIcon className="w-4 h-4 text-slate-400" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={editDate}
                        onSelect={(newDate) => {
                          setEditDate(newDate);
                          if (errors.date && newDate) {
                            setErrors(prev => ({ ...prev, date: false }));
                          }
                        }}
                        disabled={(date) => date < oneYearAgo || date > oneMonthFromNow}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Category Selector */}
                <div className="space-y-2">
                  <label className="block text-[#3D2C8D]">Categoría</label>
                  <div className={`grid grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-xl border transition-all ${
                    errors.category ? 'border-red-300 bg-red-50/50' : 'border-[#D8D0F0]'
                  }`}>
                    {categories.map((category) => {
                      const Icon = category.icon;
                      const isSelected = editCategory === category.id;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => {
                            setEditCategory(category.id);
                            if (errors.category) {
                              setErrors(prev => ({ ...prev, category: false }));
                            }
                          }}
                          className={`flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-lg transition-all h-[90px] ${
                            isSelected ? `${category.color} scale-95 shadow-sm` : 'bg-white hover:bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                          <span className="text-[13px] text-center leading-tight">{category.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label htmlFor="edit-description" className="block text-[#3D2C8D]">
                    Descripción <span className="text-slate-400 text-sm">(opcional)</span>
                  </label>
                  <input
                    id="edit-description"
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    onFocus={() => setFocusedInput('description')}
                    onBlur={() => setFocusedInput('')}
                    placeholder="Ej: Pago mensual de proyecto..."
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 min-h-[44px] ${
                      focusedInput === 'description' ? 'border-primary bg-white' : 'border-slate-200 focus-visible:border-[#3D2C8D] focus-visible:bg-white'
                    }`}
                  />
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label htmlFor="edit-amount" className="block text-[#3D2C8D]">Monto del ingreso</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">$</div>
                    <input
                      id="edit-amount"
                      type="text"
                      value={editAmount}
                      onChange={handleAmountChange}
                      onFocus={() => setFocusedInput('amount')}
                      onBlur={() => setFocusedInput('')}
                      placeholder="0"
                      className={`w-full pl-8 pr-4 py-3.5 bg-slate-50 border rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 min-h-[44px] ${
                        errors.amount ? 'border-red-300 bg-red-50/50' : focusedInput === 'amount' ? 'border-primary bg-white' : 'border-slate-200 focus-visible:border-[#3D2C8D] focus-visible:bg-white'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="w-full bg-[#0D0D0D] text-white border-2 border-[#3D2C8D] py-4 min-h-[56px] rounded-xl hover:shadow-md active:scale-[0.98] transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-2"
                >
                  Guardar cambios
                </button>
                <button
                  onClick={() => setEditingIncome(null)}
                  className="w-full text-slate-500 py-3 min-h-[44px] hover:text-slate-700 transition-colors rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-1"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </SidebarLayout>
  );
}
