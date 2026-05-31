import { Plus, ShoppingCart, Car, Home, Film, Heart, GraduationCap, ShoppingBag, Wallet, TrendingDown, Edit2, Trash2, X, CalendarIcon } from 'lucide-react';
import { SidebarLayout } from './SidebarLayout';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

const categoryIcons = {
  'food': ShoppingCart,
  'transport': Car,
  'housing': Home,
  'entertainment': Film,
  'health': Heart,
  'education': GraduationCap,
  'shopping': ShoppingBag,
  'other': Wallet,
};

const categoryColors = {
  'food': 'bg-orange-100 text-orange-600',
  'transport': 'bg-blue-100 text-blue-600',
  'housing': 'bg-purple-100 text-purple-600',
  'entertainment': 'bg-pink-100 text-pink-600',
  'health': 'bg-red-100 text-red-600',
  'education': 'bg-green-100 text-green-600',
  'shopping': 'bg-yellow-100 text-yellow-600',
  'other': 'bg-slate-100 text-slate-600',
};

interface Expense {
  id: string;
  date: string;
  categoryId: string;
  categoryName: string;
  description: string;
  amount: string;
  userId: string;
}

interface ExpensesScreenProps {
  onNavigate: (page: 'home' | 'budgets' | 'incomes' | 'expenses' | 'reports') => void;
  onCreateExpense: () => void;
  onProfileClick: () => void;
}

export function ExpensesScreen({ onNavigate, onCreateExpense, onProfileClick }: ExpensesScreenProps) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editDate, setEditDate] = useState<Date | undefined>(undefined);
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editAmount, setEditAmount] = useState('0');
  const [focusedInput, setFocusedInput] = useState('');
  const [errors, setErrors] = useState({ category: false, description: false, amount: false, date: false });

  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  const loadExpenses = () => {
    if (user) {
      const allExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      const userExpenses = allExpenses.filter((e: Expense) => e.userId === user.id);
      // Sort by date descending
      userExpenses.sort((a: Expense, b: Expense) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setExpenses(userExpenses);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [user]);

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => {
    return sum + parseInt(expense.amount.replace(/[^\d]/g, ''));
  }, 0);

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
    const allExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const filtered = allExpenses.filter((e: Expense) => e.id !== id);
    localStorage.setItem('expenses', JSON.stringify(filtered));
    setDeleteConfirm(null);
    loadExpenses();
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setEditDate(new Date(expense.date));
    setEditCategory(expense.categoryId);
    setEditDescription(expense.description);
    setEditAmount(expense.amount);
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

    if (!newErrors.date && !newErrors.category && !newErrors.amount && editingExpense) {
      const allExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      const updated = allExpenses.map((e: Expense) => {
        if (e.id === editingExpense.id) {
          const categories = [
            { id: 'food', name: 'Alimentación' },
            { id: 'transport', name: 'Transporte' },
            { id: 'housing', name: 'Vivienda' },
            { id: 'entertainment', name: 'Entretenimiento' },
            { id: 'health', name: 'Salud' },
            { id: 'education', name: 'Educación' },
            { id: 'shopping', name: 'Compras' },
            { id: 'other', name: 'Otros' },
          ];
          const categoryName = categories.find(c => c.id === editCategory)?.name || '';

          return {
            ...e,
            date: editDate ? format(editDate, 'yyyy-MM-dd') : e.date,
            categoryId: editCategory,
            categoryName,
            description: editDescription,
            amount: editAmount,
          };
        }
        return e;
      });

      localStorage.setItem('expenses', JSON.stringify(updated));
      setEditingExpense(null);
      loadExpenses();
    }
  };

  return (
    <SidebarLayout currentPage="expenses" onNavigate={onNavigate} onProfileClick={onProfileClick}>
      <div className="flex-1 p-4 pt-8 md:p-6 xl:p-8 pb-24 xl:pb-8 bg-[#F7F5F0]">
        <div className="w-full max-w-md md:max-w-3xl xl:max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[#3D2C8D] text-[30px]">Gastos</h1>
              
            </div>
            <button
              onClick={onCreateExpense}
              className="bg-primary text-primary-foreground px-5 md:px-6 py-3.5 rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center gap-2 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline">Registrar gasto</span>
              <span className="md:hidden">Crear</span>
            </button>
          </div>

          {/* Empty State */}
          {expenses.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-6 md:p-8">
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingDown className="w-8 h-8 md:w-10 md:h-10 text-orange-600" />
                </div>
                <h2 className="text-[#26215C] text-lg md:text-xl mb-2">No tienes gastos registrados aún</h2>
                <p className="text-[#7B6FA0] text-sm md:text-base leading-relaxed max-w-lg mx-auto">
                  Comienza a registrar tus gastos para tener un mejor control financiero
                </p>
              </div>
            </div>
          )}

          {/* Expenses Grid */}
          {expenses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
              {expenses.map((expense) => {
                const Icon = categoryIcons[expense.categoryId as keyof typeof categoryIcons] || Wallet;
                const color = categoryColors[expense.categoryId as keyof typeof categoryColors] || 'bg-slate-100 text-slate-600';

                return (
                  <div
                    key={expense.id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-5">
                      {/* Header with Icon and Name */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`min-w-[44px] min-h-[44px] w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-900 font-medium truncate">{expense.categoryName}</p>
                          <p className="text-sm text-slate-500">{formatDate(expense.date)}</p>
                          {expense.description && (
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{expense.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Amount and Badge */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <span className="text-orange-600 font-semibold text-lg">
                          -${expense.amount}
                        </span>
                        <span className="text-xs px-2.5 py-1.5 rounded-lg bg-orange-100 text-orange-700 font-medium">
                          Gastado
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons Footer — always visible for touch accessibility */}
                    <div className="border-t border-slate-100 grid grid-cols-2 divide-x divide-slate-100">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="flex items-center justify-center gap-2 py-3.5 min-h-[48px] text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-inset"
                        aria-label={`Editar gasto ${expense.categoryName}`}
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(expense.id)}
                        className="flex items-center justify-center gap-2 py-3.5 min-h-[48px] text-sm font-medium text-red-500 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-inset"
                        aria-label={`Eliminar gasto ${expense.categoryName}`}
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
                  <h2 className="text-base font-semibold text-slate-900">¿Eliminar gasto?</h2>
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
      {editingExpense && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setEditingExpense(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-[#D8D0F0] p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl text-[#3D2C8D]">Editar gasto</h2>
                <button
                  onClick={() => setEditingExpense(null)}
                  className="p-2 min-w-[44px] min-h-[44px] hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-1"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-5">
                {/* Date Input */}
                <div className="space-y-2">
                  <label className="block text-[#3D2C8D]">Fecha</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 focus-visible:border-[#3D2C8D] focus-visible:bg-white min-h-[44px] flex items-center justify-between text-left ${
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
                  {errors.date && (
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                      Selecciona una fecha
                    </p>
                  )}
                </div>

                {/* Category Selector */}
                <div className="space-y-2">
                  <label className="block text-[#3D2C8D]">Categoría</label>
                  <div className={`grid grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-xl border transition-all ${
                    errors.category ? 'border-red-300 bg-red-50/50' : 'border-[#D8D0F0]'
                  }`}>
                    {[
                      { id: 'food', name: 'Alimentación', icon: ShoppingCart, color: 'bg-orange-100 text-orange-600' },
                      { id: 'transport', name: 'Transporte', icon: Car, color: 'bg-blue-100 text-blue-600' },
                      { id: 'housing', name: 'Vivienda', icon: Home, color: 'bg-purple-100 text-purple-600' },
                      { id: 'entertainment', name: 'Entretenimiento', icon: Film, color: 'bg-pink-100 text-pink-600' },
                      { id: 'health', name: 'Salud', icon: Heart, color: 'bg-red-100 text-red-600' },
                      { id: 'education', name: 'Educación', icon: GraduationCap, color: 'bg-green-100 text-green-600' },
                      { id: 'shopping', name: 'Compras', icon: ShoppingBag, color: 'bg-yellow-100 text-yellow-600' },
                      { id: 'other', name: 'Otros', icon: Wallet, color: 'bg-slate-100 text-slate-600' },
                    ].map((category) => {
                      const CategoryIcon = category.icon;
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
                            isSelected
                              ? `${category.color} scale-95 shadow-sm`
                              : 'bg-white hover:bg-slate-100 text-slate-600'
                          }`}
                        >
                          <CategoryIcon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
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
                  <label className="block text-[#3D2C8D]">
                    Descripción del gasto <span className="text-slate-400 text-sm">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => {
                      setEditDescription(e.target.value);
                      if (errors.description && e.target.value.trim()) {
                        setErrors(prev => ({ ...prev, description: false }));
                      }
                    }}
                    onFocus={() => setFocusedInput('description')}
                    onBlur={() => setFocusedInput('')}
                    placeholder="Ej: Compra de supermercado…"
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 min-h-[44px] ${
                      errors.description
                        ? 'border-red-300 bg-red-50/50 focus-visible:border-red-400'
                        : focusedInput === 'description'
                        ? 'border-primary bg-white'
                        : 'border-slate-200 focus-visible:border-[#3D2C8D] focus-visible:bg-white'
                    }`}
                  />
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="block text-[#3D2C8D]">Monto del gasto</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">
                      $
                    </div>
                    <input
                      type="text"
                      value={editAmount}
                      onChange={handleAmountChange}
                      onFocus={() => setFocusedInput('amount')}
                      onBlur={() => setFocusedInput('')}
                      placeholder="0"
                      className={`w-full pl-8 pr-4 py-3.5 bg-slate-50 border rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 min-h-[44px] ${
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
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="w-full bg-[#0D0D0D] text-white border-2 border-[#3D2C8D] py-4 min-h-[56px] rounded-xl hover:shadow-md active:scale-[0.98] transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-2"
                >
                  Guardar cambios
                </button>
                <button
                  onClick={() => setEditingExpense(null)}
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
