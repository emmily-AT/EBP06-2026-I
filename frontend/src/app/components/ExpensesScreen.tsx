import { Plus, ShoppingCart, Car, Home, Film, Heart, GraduationCap, ShoppingBag, Wallet, TrendingDown } from 'lucide-react';
import { SidebarLayout } from './SidebarLayout';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { transactionService } from '../api/transactionService';
import { dbIdToCategory } from '../api/categories';

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
  id: number;
  date: string;
  categoryId: number | null;
  description: string;
  amount: number;
}

interface ExpensesScreenProps {
  onNavigate: (page: 'home' | 'budgets' | 'incomes' | 'expenses') => void;
  onCreateExpense: () => void;
  onProfileClick: () => void;
}

export function ExpensesScreen({ onNavigate, onCreateExpense, onProfileClick }: ExpensesScreenProps) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    transactionService.getTransactions()
      .then(res => {
        const expenses = res.data
          .filter((tx: any) => tx.type === 'EXPENSE')
          .map((tx: any) => ({
            id: tx.id,
            date: tx.date,
            categoryId: tx.categoryId,
            description: tx.description,
            amount: tx.amount,
          }));
        setExpenses(expenses);
      })
      .catch(console.error);
  }, []);

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, expense) => {
    return sum + expense.amount;
  }, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('es-ES', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
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
              className="bg-primary text-primary-foreground px-4 md:px-6 py-3 rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center gap-2 min-h-[44px]"
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
                const categoryKey = expense.categoryId ? dbIdToCategory[expense.categoryId] : undefined;
                const Icon = categoryKey ? categoryIcons[categoryKey as keyof typeof categoryIcons] || Wallet : Wallet;
                const color = categoryKey ? categoryColors[categoryKey as keyof typeof categoryColors] || 'bg-slate-100 text-slate-600' : 'bg-slate-100 text-slate-600';

                return (
                  <div
                    key={expense.id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow"
                  >
                    {/* Header with Icon and Name */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`min-w-[44px] min-h-[44px] w-12 h-12 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-900 font-medium truncate">{expense.description || 'Sin descripción'}</p>
                        <p className="text-sm text-slate-500">{formatDate(expense.date)}</p>
                      </div>
                    </div>

                    {/* Amount and Badge */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <span className="text-orange-600 font-medium text-lg">
                        -${expense.amount.toLocaleString('es-ES')}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-lg bg-orange-100 text-orange-700">
                        Gastado
                      </span>
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
