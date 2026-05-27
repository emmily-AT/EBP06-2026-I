import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Receipt, PiggyBank, ShoppingCart, Car, Home, Film, Heart, GraduationCap, ShoppingBag, Wallet, Briefcase, DollarSign, Gift } from 'lucide-react';
import { SidebarLayout } from './SidebarLayout';
import { NotificationBell } from './NotificationBell';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { transactionService } from '../api/transactionService';
import { dbIdToCategory } from '../api/categories';

const categoryIcons: { [key: string]: any } = {
  // Expense categories
  'food': ShoppingCart,
  'transport': Car,
  'housing': Home,
  'entertainment': Film,
  'health': Heart,
  'education': GraduationCap,
  'shopping': ShoppingBag,
  // Income categories
  'salary': Briefcase,
  'freelance': DollarSign,
  'investment': TrendingUp,
  'bonus': Gift,
  'gift': Gift,
  'savings': PiggyBank,
  'refund': ArrowUpRight,
  'other': Wallet,
};

interface Transaction {
  id: number;
  date: string;
  categoryId: number | null;
  description: string;
  amount: number;
  type: string;
}

interface DashboardHomeProps {
  onNavigate: (page: 'home' | 'budgets' | 'incomes' | 'expenses') => void;
  onCreateBudget: () => void;
  onCreateIncome: () => void;
  onCreateExpense: () => void;
  onProfileClick: () => void;
}

export function DashboardHome({ onNavigate, onCreateBudget, onCreateIncome, onCreateExpense, onProfileClick }: DashboardHomeProps) {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionCount, setTransactionCount] = useState(0);

  useEffect(() => {
    if (user) {
      transactionService.getTransactions()
        .then(res => {
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();

          const allTxs: Transaction[] = res.data;
          const filtered = allTxs.filter((tx: Transaction) => {
            const txDate = new Date(tx.date);
            if (viewMode === 'monthly') {
              return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
            } else {
              return txDate.getFullYear() === currentYear;
            }
          });

          const incomeTotal = filtered
            .filter(tx => tx.type === 'INCOME')
            .reduce((sum, tx) => sum + tx.amount, 0);
          const expenseTotal = filtered
            .filter(tx => tx.type === 'EXPENSE')
            .reduce((sum, tx) => sum + tx.amount, 0);

          setTotalIncome(incomeTotal);
          setTotalExpenses(expenseTotal);
          setTransactionCount(filtered.length);
          setTransactions(filtered.slice(0, 15));
        })
        .catch(console.error);
    }
  }, [user, viewMode]);

  const balance = totalIncome - totalExpenses;
  const savings = balance;

  // Get current month/year label
  const currentDate = new Date();
  const monthName = format(currentDate, 'MMMM', { locale: es });
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const currentYear = currentDate.getFullYear();
  const periodLabel = viewMode === 'monthly' ? capitalizedMonth : currentYear.toString();

  return (
    <SidebarLayout currentPage="home" onNavigate={onNavigate} onProfileClick={onProfileClick}>
      <div className="flex-1 p-4 pt-8 md:p-6 xl:p-8 pb-24 xl:pb-8 bg-[#F7F5F0]">
        <div className="w-full max-w-md md:max-w-3xl xl:max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="text-[#3D2C8D] text-[24px] md:text-[30px]">Resumen</h1>

            <div className="flex items-center gap-3">
              {/* Toggle Mensual/Anual */}
              <div className="bg-[#4c1d95] rounded-xl p-1 flex gap-1">
                <button
                  onClick={() => setViewMode('monthly')}
                  className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all ${ viewMode === 'monthly' ? 'bg-[#FFD200] text-black' : 'text-[#7B6FA0]' } text-[15px]`}
                >
                  Mensual
                </button>
                <button
                  onClick={() => setViewMode('yearly')}
                  className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-all ${ viewMode === 'yearly' ? 'bg-[#FFD200] text-black' : 'text-[#7B6FA0]' } text-[15px]`}
                >
                  Anual
                </button>
              </div>

              {/* Notification Bell */}
              <div className="flex-shrink-0">
                <NotificationBell />
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-[#4c1d95] rounded-2xl shadow-lg p-6 md:p-8 mb-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/70 mb-1" style={{ fontSize: '15px' }}>Balance total - {periodLabel}</p>
                <h2 className="font-semibold text-[40px]">${balance.toLocaleString('es-ES')}</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4 text-green-300" />
                  </div>
                  <p className="text-white/70 text-[15px]">Ingresos</p>
                </div>
                <p className="font-semibold text-[30px]">${totalIncome.toLocaleString('es-ES')}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <ArrowDownRight className="w-4 h-4 text-red-300" />
                  </div>
                  <p className="text-white/70 text-[15px]">Gastos</p>
                </div>
                <p className="font-semibold text-[30px]">${totalExpenses.toLocaleString('es-ES')}</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
            {/* Transactions Count */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-5 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-blue-600" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[#7B6FA0] text-[15px]">Transacciones</p>
                  <p className="text-2xl md:text-3xl text-slate-900 font-bold">{transactionCount}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Total del {viewMode === 'monthly' ? 'mes' : 'año'} actual</p>
            </div>

            {/* Savings */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-5 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <PiggyBank className="w-6 h-6 text-green-600" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[#7B6FA0] text-[15px]">Ahorro</p>
                  <p className="text-2xl md:text-3xl text-slate-900 font-bold">${savings.toLocaleString('es-ES')}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">Ahorro neto del {viewMode === 'monthly' ? 'mes' : 'año'} actual</p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-5 md:p-6">
            <h3 className="text-[#3D2C8D] mb-4 text-[20px]">Últimas transacciones</h3>

            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 text-[16px]">No hay transacciones registradas</p>
                <p className="text-slate-400 mt-2 text-[14px]">Comienza registrando un ingreso o gasto</p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.map((transaction) => {
                  const categoryKey = transaction.categoryId ? dbIdToCategory[transaction.categoryId] : undefined;
                  const Icon = categoryKey ? categoryIcons[categoryKey] || Wallet : Wallet;
                  const isIncome = transaction.type === 'INCOME';
                  const bgColor = isIncome ? 'bg-green-100' : 'bg-orange-100';
                  const textColor = isIncome ? 'text-green-600' : 'text-orange-600';

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center ${textColor}`}>
                          <Icon className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-[15px]">{transaction.description || 'Sin descripción'}</p>
                          <p className="text-slate-500 text-[13px]">
                            {transaction.description || 'Sin descripción'} • {format(new Date(transaction.date), 'dd MMM', { locale: es })}
                          </p>
                        </div>
                      </div>
                      <p className={`font-medium ${textColor} text-[17px]`}>
                        {isIncome ? '+' : '-'}${transaction.amount.toLocaleString('es-ES')}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}