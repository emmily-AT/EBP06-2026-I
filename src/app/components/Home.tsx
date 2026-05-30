import { useAuth } from '../contexts/AuthContext';
import { LogOut, Plus, UtensilsCrossed, Car, Sparkles, Home as HomeIcon, ShoppingBag, Heart, GraduationCap, Coffee } from 'lucide-react';
import { useState, useEffect } from 'react';
import { WelcomeHeader } from './WelcomeHeader';

const categoryIcons = {
  'food': UtensilsCrossed,
  'transport': Car,
  'leisure': Sparkles,
  'home': HomeIcon,
  'shopping': ShoppingBag,
  'health': Heart,
  'education': GraduationCap,
  'other': Coffee,
};

const categoryColors = {
  'food': 'bg-orange-100 text-orange-600',
  'transport': 'bg-blue-100 text-blue-600',
  'leisure': 'bg-purple-100 text-purple-600',
  'home': 'bg-green-100 text-green-600',
  'shopping': 'bg-pink-100 text-pink-600',
  'health': 'bg-red-100 text-red-600',
  'education': 'bg-indigo-100 text-indigo-600',
  'other': 'bg-yellow-100 text-yellow-600',
};

interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: string;
  month: number;
  userId: string;
}

interface HomeProps {
  onCreateBudget: () => void;
}

export function Home({ onCreateBudget }: HomeProps) {
  const { user, logout } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    if (user) {
      const allBudgets = JSON.parse(localStorage.getItem('budgets') || '[]');
      const userBudgets = allBudgets.filter((b: Budget) => b.userId === user.id);
      setBudgets(userBudgets);
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col lg:flex-row">
      {/* Desktop Sidebar Navigation - Hidden on mobile */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-white lg:border-r lg:border-slate-200 lg:p-6">
        <div className="flex-1">
          {/* User Header in Sidebar */}
          <div className="mb-8">
            <WelcomeHeader userName={user?.name || 'Usuario'} />
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/5 text-primary rounded-xl transition-colors">
              <HomeIcon className="w-5 h-5" />
              <span>Presupuestos</span>
            </button>
          </nav>
        </div>

        {/* Logout Button in Sidebar */}
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Salir</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 pt-8 lg:p-8 pb-24 lg:pb-8">
          <div className="w-full max-w-md lg:max-w-4xl mx-auto">
            {/* Mobile Header - Hidden on desktop */}
            <div className="mb-8 lg:hidden">
              <WelcomeHeader userName={user?.name || 'Usuario'} />
            </div>

            {/* Empty State - When no budgets */}
            {budgets.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:p-8 space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 lg:w-10 lg:h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-slate-900 text-lg lg:text-xl mb-2">Comienza a administrar tus finanzas</h2>
                  <p className="text-slate-600 text-sm lg:text-base leading-relaxed max-w-lg mx-auto">
                    Llevar un control de tus gastos te ayuda a alcanzar tus metas financieras,
                    evitar gastos innecesarios y tener una visión clara de hacia dónde va tu dinero.
                    ¡Empieza hoy mismo creando tu primer presupuesto!
                  </p>
                </div>
              </div>
            )}

            {/* Budgets List */}
            {budgets.length > 0 && (
              <div className="space-y-3 lg:space-y-4">
                <h2 className="text-slate-700 text-sm lg:text-base">Mis presupuestos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                  {budgets.map((budget) => {
                    const Icon = categoryIcons[budget.categoryId as keyof typeof categoryIcons] || Coffee;
                    const color = categoryColors[budget.categoryId as keyof typeof categoryColors] || 'bg-yellow-100 text-yellow-600';

                    return (
                      <div
                        key={budget.id}
                        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 lg:p-5 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className={`min-w-[44px] min-h-[44px] w-12 h-12 lg:w-14 lg:h-14 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6 lg:w-7 lg:h-7" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-900 truncate">{budget.categoryName}</p>
                          <p className="text-sm lg:text-base text-slate-500">${budget.amount}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Bottom Navigation Bar - Hidden on desktop */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 lg:hidden">
          <div className="w-full max-w-md mx-auto flex gap-3">
            <button
              onClick={onCreateBudget}
              className="flex-1 bg-primary text-primary-foreground min-h-[44px] py-3 rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Crear presupuesto</span>
            </button>
            <button
              onClick={logout}
              className="min-w-[44px] min-h-[44px] px-4 py-3 bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>

        {/* Desktop Floating Action Button */}
        <div className="hidden lg:block fixed bottom-8 right-8">
          <button
            onClick={onCreateBudget}
            className="bg-primary text-primary-foreground px-6 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Crear presupuesto</span>
          </button>
        </div>
      </div>
    </div>
  );
}
