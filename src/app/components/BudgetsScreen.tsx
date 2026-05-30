import { Plus, ShoppingCart, Car, Home as HomeIcon, Film, Heart, GraduationCap, ShoppingBag, Wallet, FileText, Edit2, Trash2, X } from 'lucide-react';
import { SidebarLayout } from './SidebarLayout';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useState, useEffect } from 'react';

const categoryIcons = {
  'food': ShoppingCart,
  'transport': Car,
  'housing': HomeIcon,
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

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: string;
  month: number;
  userId: string;
}

interface BudgetsScreenProps {
  onNavigate: (page: 'home' | 'budgets' | 'incomes' | 'expenses' | 'reports') => void;
  onCreateBudget: () => void;
  onProfileClick: () => void;
}

export function BudgetsScreen({ onNavigate, onCreateBudget, onProfileClick }: BudgetsScreenProps) {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editError, setEditError] = useState('');

  const handleDelete = (id: string) => {
    const allBudgets = JSON.parse(localStorage.getItem('budgets') || '[]');
    const updated = allBudgets.filter((b: Budget) => b.id !== id);
    localStorage.setItem('budgets', JSON.stringify(updated));
    setBudgets(budgets.filter(b => b.id !== id));
    setDeleteConfirm(null);
  };

  const handleEditOpen = (budget: Budget) => {
    setEditingBudget(budget);
    setEditAmount(budget.amount.replace(/[^\d]/g, ''));
    setEditError('');
  };

  const handleEditSave = () => {
    if (!editingBudget) return;
    const num = parseInt(editAmount.replace(/[^\d]/g, ''));
    if (!editAmount || isNaN(num) || num <= 0) {
      setEditError('Ingresa un monto válido');
      return;
    }
    const formatted = num.toLocaleString('es-ES');
    const allBudgets = JSON.parse(localStorage.getItem('budgets') || '[]');
    const updated = allBudgets.map((b: Budget) =>
      b.id === editingBudget.id ? { ...b, amount: formatted } : b
    );
    localStorage.setItem('budgets', JSON.stringify(updated));
    setBudgets(budgets.map(b => b.id === editingBudget.id ? { ...b, amount: formatted } : b));
    setEditingBudget(null);
  };

  // Load notified budgets from localStorage
  const getNotifiedBudgets = (): Set<string> => {
    const stored = localStorage.getItem('notifiedBudgets');
    if (stored) {
      return new Set(JSON.parse(stored));
    }
    return new Set();
  };

  const saveNotifiedBudget = (budgetKey: string) => {
    const notified = getNotifiedBudgets();
    notified.add(budgetKey);
    localStorage.setItem('notifiedBudgets', JSON.stringify([...notified]));
  };

  useEffect(() => {
    if (user) {
      const allBudgets = JSON.parse(localStorage.getItem('budgets') || '[]');
      const userBudgets = allBudgets.filter((b: Budget) => b.userId === user.id);
      setBudgets(userBudgets);

      const allExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      const userExpenses = allExpenses.filter((e: any) => e.userId === user.id);
      setExpenses(userExpenses);
    }
  }, [user]);

  // Check for budget alerts (80% threshold)
  useEffect(() => {
    if (budgets.length > 0 && expenses.length > 0) {
      const notifiedBudgets = getNotifiedBudgets();

      budgets.forEach((budget) => {
        const amountNum = parseInt(budget.amount.replace(/[^\d]/g, ''));

        // Calculate spent amount for this budget
        const categoryExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          const expenseMonth = expenseDate.getMonth();
          return expense.categoryId === budget.categoryId && expenseMonth === budget.month;
        });

        const spentAmount = categoryExpenses.reduce((total, expense) => {
          const expenseAmount = parseInt(expense.amount.replace(/[^\d]/g, ''));
          return total + expenseAmount;
        }, 0);

        const spentPercentage = amountNum > 0 ? Math.round((spentAmount / amountNum) * 100) : 0;

        // Trigger notification at 80% or more, but only once per budget (persisted in localStorage)
        const budgetKey = `${budget.id}-${budget.month}-${budget.userId}`;
        if (spentPercentage >= 80 && !notifiedBudgets.has(budgetKey)) {
          addNotification({
            message: `Has alcanzado el ${spentPercentage}% de tu presupuesto en ${budget.categoryName}`,
            type: 'budget_alert',
            category: budget.categoryName,
          });
          saveNotifiedBudget(budgetKey);
        }
      });
    }
  }, [budgets, expenses, addNotification]);

  return (
    <SidebarLayout currentPage="budgets" onNavigate={onNavigate} onProfileClick={onProfileClick}>
      <div className="flex-1 p-4 pt-8 md:p-6 xl:p-8 pb-24 xl:pb-8 bg-[#F7F5F0]">
        <div className="w-full max-w-md md:max-w-3xl xl:max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-[#3D2C8D] text-[30px]">Presupuestos</h1>
            <button
              onClick={onCreateBudget}
              className="bg-primary text-primary-foreground px-5 md:px-6 py-3.5 rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center gap-2 min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline">Definir presupuesto</span>
              <span className="md:hidden">Crear</span>
            </button>
          </div>

          {/* Empty State */}
          {budgets.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-6 md:p-8">
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#EEEDFE] rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 md:w-10 md:h-10 text-[#534AB7]" />
                </div>
                <h2 className="text-[#26215C] mb-2 text-[20px]">No tienes presupuestos aún</h2>
                <p className="text-[#7B6FA0] leading-relaxed max-w-lg mx-auto text-[16px]">
                  Comienza a controlar tus gastos creando tu primer presupuesto mensual
                </p>
              </div>
            </div>
          )}

          {/* Budgets Grid */}
          {budgets.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
              {budgets.map((budget) => {
                const Icon = categoryIcons[budget.categoryId as keyof typeof categoryIcons] || Wallet;
                const color = categoryColors[budget.categoryId as keyof typeof categoryColors] || 'bg-slate-100 text-slate-600';
                const amountNum = parseInt(budget.amount.replace(/[^\d]/g, ''));

                // Calculate spent amount from expenses
                const categoryExpenses = expenses.filter((expense) => {
                  const expenseDate = new Date(expense.date);
                  const expenseMonth = expenseDate.getMonth();
                  return expense.categoryId === budget.categoryId && expenseMonth === budget.month;
                });

                const spentAmount = categoryExpenses.reduce((total, expense) => {
                  const expenseAmount = parseInt(expense.amount.replace(/[^\d]/g, ''));
                  return total + expenseAmount;
                }, 0);

                const spentPercentage = amountNum > 0 ? Math.round((spentAmount / amountNum) * 100) : 0;
                const availableAmount = Math.max(0, amountNum - spentAmount);

                // Determine status and colors
                let statusText = 'En control';
                let statusClass = 'bg-green-100 text-green-700';
                let progressColor = 'bg-green-500';

                if (spentPercentage >= 100) {
                  statusText = 'Excedido';
                  statusClass = 'bg-red-100 text-red-700';
                  progressColor = 'bg-red-500';
                } else if (spentPercentage >= 80) {
                  statusText = 'Alerta';
                  statusClass = 'bg-yellow-100 text-yellow-700';
                  progressColor = 'bg-yellow-500';
                }

                return (
                  <div
                    key={budget.id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-5">
                      {/* Header with Icon, Name and Status Badge */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`min-w-[44px] min-h-[44px] w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-900 font-medium truncate">{budget.categoryName}</p>
                          <p className="text-sm text-slate-500">{months[budget.month]}</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1.5 rounded-lg flex-shrink-0 font-medium ${statusClass}`}>
                          {statusText}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                          <span>Gastado: ${spentAmount.toLocaleString('es-ES')}</span>
                          <span>{spentPercentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${progressColor}`}
                            style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Available Amount */}
                      <div className="pt-3 border-t border-slate-100">
                        <p className="text-sm text-slate-600">
                          Disponible: <span className="font-semibold text-slate-900">${availableAmount.toLocaleString('es-ES')}</span> de ${amountNum.toLocaleString('es-ES')}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons Footer — always visible for touch accessibility */}
                    <div className="border-t border-slate-100 grid grid-cols-2 divide-x divide-slate-100">
                      <button
                        onClick={() => handleEditOpen(budget)}
                        className="flex items-center justify-center gap-2 py-3.5 min-h-[48px] text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-inset"
                        aria-label={`Editar presupuesto ${budget.categoryName}`}
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(budget.id)}
                        className="flex items-center justify-center gap-2 py-3.5 min-h-[48px] text-sm font-medium text-red-500 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-inset"
                        aria-label={`Eliminar presupuesto ${budget.categoryName}`}
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
                  <h2 className="text-base font-semibold text-slate-900">¿Eliminar presupuesto?</h2>
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
      {editingBudget && (
        <>
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => setEditingBudget(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-[#D8D0F0] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl text-[#3D2C8D]">Editar presupuesto</h2>
                <button onClick={() => setEditingBudget(null)} className="p-2 min-w-[44px] min-h-[44px] hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-1">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <p className="text-slate-500 mb-4">{editingBudget.categoryName} · {months[editingBudget.month]}</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-700 mb-2">Monto del presupuesto</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => { setEditAmount(e.target.value); setEditError(''); }}
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95]/40 focus-visible:border-[#3D2C8D]"
                      placeholder="0"
                      min="1"
                    />
                  </div>
                  {editError && <p className="text-xs text-red-600 mt-1">{editError}</p>}
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-6">
                <button
                  onClick={handleEditSave}
                  className="w-full bg-[#0D0D0D] text-white border-2 border-[#3D2C8D] py-4 min-h-[56px] rounded-xl hover:shadow-md active:scale-[0.98] transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C1D95] focus-visible:ring-offset-2"
                >
                  Guardar cambios
                </button>
                <button
                  onClick={() => setEditingBudget(null)}
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