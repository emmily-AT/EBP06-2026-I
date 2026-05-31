import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Receipt, PiggyBank, ShoppingCart, Car, Home, Film, Heart, GraduationCap, ShoppingBag, Wallet, Briefcase, DollarSign, Gift } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { SidebarLayout } from './SidebarLayout';
import { NotificationBell } from './NotificationBell';
import { AccessibilityButton } from './AccessibilityButton';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const categoryColorMap: Record<string, string> = {
  'food': '#f97316',
  'transport': '#3b82f6',
  'housing': '#a855f7',
  'entertainment': '#ec4899',
  'health': '#ef4444',
  'education': '#22c55e',
  'shopping': '#eab308',
  'other': '#94a3b8',
};

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
  id: string;
  date: string;
  createdAt?: string;
  categoryId: string;
  categoryName: string;
  description: string;
  amount: string;
  type: 'income' | 'expense';
}

interface DashboardHomeProps {
  onNavigate: (page: 'home' | 'budgets' | 'incomes' | 'expenses' | 'reports') => void;
  onCreateBudget: () => void;
  onCreateIncome: () => void;
  onCreateExpense: () => void;
  onProfileClick: (recommendationId?: string) => void;
}

export function DashboardHome({ onNavigate, onCreateBudget, onCreateIncome, onCreateExpense, onProfileClick }: DashboardHomeProps) {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');

  const handleNotificationClick = (notification: any) => {
    if (notification.type === 'recommendation') {
      // Navegar al perfil con el ID de la recomendación
      onProfileClick(notification.recommendationId);
    }
  };
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionCount, setTransactionCount] = useState(0);
  const [barData, setBarData] = useState<{ mes: string; mesLabel: string; Ingresos: number; Gastos: number; index: number }[]>([]);
  const [pieData, setPieData] = useState<{ name: string; value: number; color: string }[]>([]);

  useEffect(() => {
    if (user) {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      // Load incomes
      const allIncomes = JSON.parse(localStorage.getItem('incomes') || '[]');
      const userIncomes = allIncomes.filter((income: any) => {
        const incomeDate = new Date(income.date);
        if (viewMode === 'monthly') {
          return income.userId === user.id &&
                 incomeDate.getMonth() === currentMonth &&
                 incomeDate.getFullYear() === currentYear;
        } else {
          return income.userId === user.id &&
                 incomeDate.getFullYear() === currentYear;
        }
      });

      // Load expenses
      const allExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      const userExpenses = allExpenses.filter((expense: any) => {
        const expenseDate = new Date(expense.date);
        if (viewMode === 'monthly') {
          return expense.userId === user.id &&
                 expenseDate.getMonth() === currentMonth &&
                 expenseDate.getFullYear() === currentYear;
        } else {
          return expense.userId === user.id &&
                 expenseDate.getFullYear() === currentYear;
        }
      });

      // Calculate totals
      const incomeTotal = userIncomes.reduce((sum: number, income: any) => {
        return sum + parseInt(income.amount.replace(/[^\d]/g, ''));
      }, 0);

      const expenseTotal = userExpenses.reduce((sum: number, expense: any) => {
        return sum + parseInt(expense.amount.replace(/[^\d]/g, ''));
      }, 0);

      setTotalIncome(incomeTotal);
      setTotalExpenses(expenseTotal);
      setTransactionCount(userIncomes.length + userExpenses.length);

      // Combine and sort transactions by creation date/time (most recent first)
      const allTransactions: Transaction[] = [
        ...userIncomes.map((income: any) => ({
          ...income,
          type: 'income' as const
        })),
        ...userExpenses.map((expense: any) => ({
          ...expense,
          type: 'expense' as const
        }))
      ].sort((a, b) => {
        // Sort by createdAt timestamp (with fallback to date for old transactions)
        const timestampA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(a.date).getTime();
        const timestampB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(b.date).getTime();

        // Most recent first (descending order)
        return timestampB - timestampA;
      });

      setTransactions(allTransactions.slice(0, 15));

      // --- Chart data (always all-time, not filtered by viewMode) ---
      const allIncomesAll: any[] = JSON.parse(localStorage.getItem('incomes') || '[]').filter((i: any) => i.userId === user.id);
      const allExpensesAll: any[] = JSON.parse(localStorage.getItem('expenses') || '[]').filter((e: any) => e.userId === user.id);

      // Last 6 months bar chart
      const monthLabels = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
      const now = new Date();
      const months6: { mes: string; mesLabel: string; Ingresos: number; Gastos: number; index: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const m = d.getMonth(); const y = d.getFullYear();
        const inc = allIncomesAll.filter((x: any) => { const dd = new Date(x.date); return dd.getMonth() === m && dd.getFullYear() === y; })
          .reduce((s: number, x: any) => s + parseInt(x.amount.replace(/[^\d]/g, '')), 0);
        const exp = allExpensesAll.filter((x: any) => { const dd = new Date(x.date); return dd.getMonth() === m && dd.getFullYear() === y; })
          .reduce((s: number, x: any) => s + parseInt(x.amount.replace(/[^\d]/g, '')), 0);
        const uniqueIndex = 5 - i;
        months6.push({ mes: `${y}-${String(m + 1).padStart(2, '0')}-${uniqueIndex}`, mesLabel: monthLabels[m], Ingresos: inc, Gastos: exp, index: uniqueIndex });
      }
      setBarData(months6);

      // Pie chart by expense category
      const catMap: Record<string, { value: number; color: string }> = {};
      allExpensesAll.forEach((x: any) => {
        const amt = parseInt(x.amount.replace(/[^\d]/g, ''));
        if (!catMap[x.categoryName]) {
          catMap[x.categoryName] = { value: 0, color: categoryColorMap[x.categoryId] || '#94a3b8' };
        }
        catMap[x.categoryName].value += amt;
      });
      setPieData(Object.entries(catMap).map(([name, { value, color }]) => ({ name, value, color })));
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
                  className={`px-3 md:px-4 min-h-[44px] rounded-lg font-medium transition-all text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD200] focus-visible:ring-offset-0 ${ viewMode === 'monthly' ? 'bg-[#FFD200] text-black' : 'text-[#7B6FA0] hover:text-white' }`}
                >
                  Mensual
                </button>
                <button
                  onClick={() => setViewMode('yearly')}
                  className={`px-3 md:px-4 min-h-[44px] rounded-lg font-medium transition-all text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD200] focus-visible:ring-offset-0 ${ viewMode === 'yearly' ? 'bg-[#FFD200] text-black' : 'text-[#7B6FA0] hover:text-white' }`}
                >
                  Anual
                </button>
              </div>

              {/* Notification Bell */}
              <div className="flex-shrink-0">
                <NotificationBell onNotificationClick={handleNotificationClick} />
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

          {/* Chart Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
            {/* Bar Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-5 md:p-6">
              <p className="text-[#7B6FA0] text-[15px] mb-4">Ingresos vs gastos — últimos 6 meses</p>
              {barData.length > 0 && (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={barData} barCategoryGap="35%" barGap={4}>
                    <XAxis
                      dataKey="mes"
                      tick={{ fontSize: 12, fill: '#7B6FA0' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => {
                        const item = barData.find(d => d.mes === value);
                        return item ? item.mesLabel : '';
                      }}
                    />
                    <YAxis hide />
                    <Tooltip
                      formatter={(v: number) => `$${v.toLocaleString('es-ES')}`}
                      contentStyle={{ borderRadius: 12, border: '1px solid #D8D0F0', fontSize: 13 }}
                      labelFormatter={(label) => {
                        const item = barData.find(d => d.mes === label);
                        return item ? item.mesLabel : '';
                      }}
                    />
                    <Bar dataKey="Ingresos" name="Ingresos" fill="#4ade80" radius={[4,4,0,0]} isAnimationActive={false} />
                    <Bar dataKey="Gastos" name="Gastos" fill="#f87171" radius={[4,4,0,0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              )}
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-3 rounded-sm bg-[#4ade80] inline-block" />Ingresos</span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-3 rounded-sm bg-[#f87171] inline-block" />Gastos</span>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-5 md:p-6">
              <p className="text-[#7B6FA0] text-[15px] mb-4">Gastos por categoría</p>
              {pieData.length === 0 ? (
                <div className="flex items-center justify-center h-[180px]">
                  <p className="text-slate-400 text-sm">Sin datos</p>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <PieChart width={140} height={160}>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={68} dataKey="value" stroke="none">
                      {pieData.map((d, idx) => (
                        <Cell key={`pie-cell-${idx}`} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => `$${v.toLocaleString('es-ES')}`} contentStyle={{ borderRadius: 12, border: '1px solid #D8D0F0', fontSize: 13 }} />
                  </PieChart>
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0 ml-4">
                    {(() => {
                      const total = pieData.reduce((s, d) => s + d.value, 0);
                      return pieData.map((d, i) => (
                        <div key={`pie-legend-${i}`} className="flex items-center gap-1.5 min-w-0">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                          <span className="text-xs text-slate-600 truncate">{d.name}</span>
                          <span className="text-xs text-slate-400 flex-shrink-0">{total > 0 ? Math.round((d.value / total) * 100) : 0}%</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}
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
                  const Icon = categoryIcons[transaction.categoryId] || Wallet;
                  const isIncome = transaction.type === 'income';
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
                          <p className="font-medium text-slate-900 text-[15px]">{transaction.categoryName}</p>
                          <p className="text-slate-500 text-[13px]">
                            {transaction.description || 'Sin descripción'} • {format(new Date(transaction.date), 'dd MMM', { locale: es })}
                          </p>
                        </div>
                      </div>
                      <p className={`font-medium ${textColor} text-[17px]`}>
                        {isIncome ? '+' : '-'}${parseInt(transaction.amount.replace(/[^\d]/g, '')).toLocaleString('es-ES')}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Accessibility Button */}
      <AccessibilityButton />
    </SidebarLayout>
  );
}