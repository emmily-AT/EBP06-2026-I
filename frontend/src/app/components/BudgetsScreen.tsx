import { Plus, ShoppingCart, Car, Home as HomeIcon, Film, Heart, GraduationCap, ShoppingBag, Wallet, FileText } from 'lucide-react';
import { SidebarLayout } from './SidebarLayout';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useState, useEffect } from 'react';
import { budgetService } from '../api/budgetService';
import { transactionService } from '../api/transactionService';
import { dbIdToCategory } from '../api/categories';

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
  id: number;
  name: string;
  limitAmount: number;
  month: number | null;
  year: number | null;
  categoryId: number | null;
}

interface BudgetsScreenProps {
  onNavigate: (page: 'home' | 'budgets' | 'incomes' | 'expenses') => void;
  onCreateBudget: () => void;
  onProfileClick: () => void;
}

export function BudgetsScreen({ onNavigate, onCreateBudget, onProfileClick }: BudgetsScreenProps) {
  const { addNotification } = useNotifications();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

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
    Promise.all([
      budgetService.getBudgets(),
      transactionService.getTransactions(),
    ])
      .then(([budgetsRes, txRes]) => {
        setBudgets(budgetsRes.data);
        setExpenses(txRes.data.filter((tx: any) => tx.type === 'EXPENSE'));
      })
      .catch(console.error);
  }, []);

  // Check for budget alerts (80% threshold)
  useEffect(() => {
    if (budgets.length > 0 && expenses.length > 0) {
      const notifiedBudgets = getNotifiedBudgets();

      budgets.forEach((budget) => {
        const amountNum = budget.limitAmount;

        // Calculate spent amount for this budget
        const categoryExpenses = expenses.filter((expense) => {
          if (expense.categoryId !== budget.categoryId) return false;
          if (budget.month != null) {
            const expenseMonth = new Date(expense.date).getMonth() + 1;
            return expenseMonth === budget.month;
          }
          return true;
        });

        const spentAmount = categoryExpenses.reduce((total, expense) => {
          return total + expense.amount;
        }, 0);

        const spentPercentage = amountNum > 0 ? Math.round((spentAmount / amountNum) * 100) : 0;

        // Trigger notification at 80% or more, but only once per budget (persisted in localStorage)
        const budgetKey = `${budget.id}-${budget.month}`;
        if (spentPercentage >= 80 && !notifiedBudgets.has(budgetKey)) {
          addNotification({
            message: `Has alcanzado el ${spentPercentage}% de tu presupuesto en ${budget.name}`,
            type: 'budget_alert',
            category: budget.name,
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
              className="bg-primary text-primary-foreground px-4 md:px-6 py-3 rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center gap-2 min-h-[44px]"
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
                const categoryKey = budget.categoryId ? dbIdToCategory[budget.categoryId] : undefined;
                const Icon = categoryKey ? categoryIcons[categoryKey as keyof typeof categoryIcons] || Wallet : Wallet;
                const color = categoryKey ? categoryColors[categoryKey as keyof typeof categoryColors] || 'bg-slate-100 text-slate-600' : 'bg-slate-100 text-slate-600';
                const amountNum = budget.limitAmount;

                // Calculate spent amount from expenses
                const categoryExpenses = expenses.filter((expense) => {
                  if (expense.categoryId !== budget.categoryId) return false;
                  if (budget.month != null) {
                    const expenseMonth = new Date(expense.date).getMonth() + 1;
                    return expenseMonth === budget.month;
                  }
                  return true;
                });

                const spentAmount = categoryExpenses.reduce((total, expense) => {
                  return total + expense.amount;
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
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow"
                  >
                    {/* Header with Icon, Name and Status Badge */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`min-w-[44px] min-h-[44px] w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-900 font-medium truncate">{budget.name}</p>
                        <p className="text-sm text-slate-500">{budget.month != null ? months[budget.month - 1] : ''}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-lg flex-shrink-0 ${statusClass}`}>
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
                );
              })}
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}