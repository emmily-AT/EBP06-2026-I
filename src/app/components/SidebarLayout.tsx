import { Home, FileText, DollarSign, TrendingDown, LogOut, BarChart2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NotificationBell } from './NotificationBell';

interface SidebarLayoutProps {
  children: React.ReactNode;
  currentPage: 'home' | 'budgets' | 'incomes' | 'expenses' | 'reports';
  onNavigate: (page: 'home' | 'budgets' | 'incomes' | 'expenses' | 'reports') => void;
  onProfileClick?: () => void;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) {
    return 'Buenos días';
  } else if (hour >= 12 && hour < 18) {
    return 'Buenas tardes';
  } else {
    return 'Buenas noches';
  }
};

export function SidebarLayout({ children, currentPage, onNavigate, onProfileClick }: SidebarLayoutProps) {
  const { user, logout } = useAuth();
  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col xl:flex-row">
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden xl:flex xl:flex-col xl:w-72 xl:bg-[#4c1d95] xl:border-r xl:border-slate-200 xl:fixed xl:top-0 xl:left-0 xl:h-screen xl:overflow-y-auto">
        <div className="flex-1 p-6">
          {/* Profile Card */}
          <button
            onClick={onProfileClick}
            className="w-full bg-[#FFD200] rounded-2xl p-6 mb-8 text-black hover:bg-[#E6BD00] transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#4c1d95]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                <span className="text-xl font-medium text-black">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm opacity-70">{greeting}</p>
                <p className="font-medium text-lg">{user?.name}</p>
              </div>
            </div>
            <p className="text-sm opacity-80 italic">Cada peso cuenta</p>
          </button>

          {/* Navigation Items */}
          <nav className="space-y-2">
            <button
              onClick={() => onNavigate('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD200] focus-visible:ring-offset-0 ${
                currentPage === 'home'
                  ? 'bg-[#FFD200] text-black'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[17px]">Resumen</span>
            </button>
            <button
              onClick={() => onNavigate('budgets')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD200] focus-visible:ring-offset-0 ${
                currentPage === 'budgets'
                  ? 'bg-[#FFD200] text-black'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[17px]">Presupuestos</span>
            </button>
            <button
              onClick={() => onNavigate('incomes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD200] focus-visible:ring-offset-0 ${
                currentPage === 'incomes'
                  ? 'bg-[#FFD200] text-black'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <DollarSign className="w-5 h-5" />
              <span className="text-[17px]">Ingresos</span>
            </button>
            <button
              onClick={() => onNavigate('expenses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD200] focus-visible:ring-offset-0 ${
                currentPage === 'expenses'
                  ? 'bg-[#FFD200] text-black'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <TrendingDown className="w-5 h-5" />
              <span className="text-[17px]">Gastos</span>
            </button>
            <button
              onClick={() => onNavigate('reports')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD200] focus-visible:ring-offset-0 ${
                currentPage === 'reports'
                  ? 'bg-[#FFD200] text-black'
                  : 'text-white/70 hover:bg-white/10'
              }`}
            >
              <BarChart2 className="w-5 h-5" />
              <span className="text-[17px]">Reportes</span>
            </button>
          </nav>
        </div>

        {/* Logout Button in Sidebar */}
        <div className="p-6 pt-0">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 text-white hover:bg-white/20 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD200] focus-visible:ring-offset-0"
          >
            <LogOut className="w-5 h-5" />
            <span>Salir</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col xl:ml-72">
        {children}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#4c1d95] border-t border-purple-700/30 p-4 xl:hidden z-40">
        <div className="w-full max-w-md mx-auto flex gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-colors min-h-[44px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD200] focus-visible:ring-offset-0 ${
              currentPage === 'home'
                ? 'bg-[#FFD200] text-black'
                : 'text-white/70'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Resumen</span>
          </button>
          <button
            onClick={() => onNavigate('budgets')}
            className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-colors min-h-[44px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD200] focus-visible:ring-offset-0 ${
              currentPage === 'budgets'
                ? 'bg-[#FFD200] text-black'
                : 'text-white/70'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs">Presupuestos</span>
          </button>
          <button
            onClick={() => onNavigate('incomes')}
            className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-colors min-h-[44px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD200] focus-visible:ring-offset-0 ${
              currentPage === 'incomes'
                ? 'bg-[#FFD200] text-black'
                : 'text-white/70'
            }`}
          >
            <DollarSign className="w-5 h-5" />
            <span className="text-xs">Ingresos</span>
          </button>
          <button
            onClick={() => onNavigate('expenses')}
            className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-colors min-h-[44px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD200] focus-visible:ring-offset-0 ${
              currentPage === 'expenses'
                ? 'bg-[#FFD200] text-black'
                : 'text-white/70'
            }`}
          >
            <TrendingDown className="w-5 h-5" />
            <span className="text-xs">Gastos</span>
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className={`flex-1 flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-colors min-h-[44px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD200] focus-visible:ring-offset-0 ${
              currentPage === 'reports' ? 'bg-[#FFD200] text-black' : 'text-white/70'
            }`}
          >
            <BarChart2 className="w-5 h-5" />
            <span className="text-xs">Reportes</span>
          </button>
          <button
            onClick={logout}
            className="flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-colors text-white/70 hover:bg-white/10 min-h-[44px] justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD200] focus-visible:ring-offset-0"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs">Salir</span>
          </button>
        </div>
      </div>
    </div>
  );
}