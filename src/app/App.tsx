import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { Onboarding } from './components/Onboarding';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ForgotPassword } from './components/ForgotPassword';
import { Budget } from './components/Budget';
import { Income } from './components/Income';
import { Expense } from './components/Expense';
import { Profile } from './components/Profile';
import { DashboardHome } from './components/DashboardHome';
import { BudgetsScreen } from './components/BudgetsScreen';
import { IncomesScreen } from './components/IncomesScreen';
import { ExpensesScreen } from './components/ExpensesScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { RecognitionsScreen } from './components/RecognitionsScreen';

type AppView = 'onboarding' | 'login' | 'register' | 'forgot-password' | 'dashboard-home' | 'budgets' | 'incomes' | 'expenses' | 'reports' | 'create-budget' | 'create-income' | 'create-expense' | 'profile' | 'recognitions';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>('login');
  const [refreshKey, setRefreshKey] = useState(0);
  const [highlightRecommendationId, setHighlightRecommendationId] = useState<string | undefined>(undefined);

  const handleProfileNavigation = (recommendationId?: string) => {
    setHighlightRecommendationId(recommendationId);
    setCurrentView('profile');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-500">Cargando...</div>
      </div>
    );
  }

  if (showOnboarding && !user) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  if (!user) {
    if (currentView === 'login') {
      return (
        <Login
          onSwitchToRegister={() => setCurrentView('register')}
          onForgotPassword={() => setCurrentView('forgot-password')}
        />
      );
    } else if (currentView === 'register') {
      return <Register onSwitchToLogin={() => setCurrentView('login')} />;
    } else if (currentView === 'forgot-password') {
      return <ForgotPassword onBack={() => setCurrentView('login')} />;
    }
  }

  // User is authenticated - show app views
  switch (currentView) {
    case 'create-budget':
      return <Budget onBack={() => {
        setRefreshKey(prev => prev + 1);
        setCurrentView('budgets');
      }} />;

    case 'create-income':
      return <Income onBack={() => {
        setRefreshKey(prev => prev + 1);
        setCurrentView('incomes');
      }} />;

    case 'create-expense':
      return <Expense onBack={() => {
        setRefreshKey(prev => prev + 1);
        setCurrentView('expenses');
      }} />;

    case 'profile':
      return <Profile
        onBack={() => {
          setHighlightRecommendationId(undefined);
          setCurrentView('dashboard-home');
        }}
        onNavigateRecognitions={() => setCurrentView('recognitions')}
        highlightRecommendationId={highlightRecommendationId}
      />;

    case 'recognitions':
      return <RecognitionsScreen onBack={() => setCurrentView('profile')} />;

    case 'budgets':
      return (
        <BudgetsScreen
          key={`budgets-${refreshKey}`}
          onNavigate={(page) => setCurrentView(page === 'home' ? 'dashboard-home' : page)}
          onCreateBudget={() => setCurrentView('create-budget')}
          onProfileClick={() => handleProfileNavigation()}
        />
      );

    case 'incomes':
      return (
        <IncomesScreen
          key={`incomes-${refreshKey}`}
          onNavigate={(page) => setCurrentView(page === 'home' ? 'dashboard-home' : page)}
          onCreateIncome={() => setCurrentView('create-income')}
          onProfileClick={() => handleProfileNavigation()}
        />
      );

    case 'expenses':
      return (
        <ExpensesScreen
          key={`expenses-${refreshKey}`}
          onNavigate={(page) => setCurrentView(page === 'home' ? 'dashboard-home' : page)}
          onCreateExpense={() => setCurrentView('create-expense')}
          onProfileClick={() => handleProfileNavigation()}
        />
      );

    case 'reports':
      return (
        <ReportsScreen
          onNavigate={(page) => setCurrentView(page === 'home' ? 'dashboard-home' : page)}
          onProfileClick={() => handleProfileNavigation()}
        />
      );

    case 'dashboard-home':
    default:
      return (
        <DashboardHome
          onNavigate={(page) => setCurrentView(page === 'home' ? 'dashboard-home' : page)}
          onCreateBudget={() => setCurrentView('create-budget')}
          onCreateIncome={() => setCurrentView('create-income')}
          onCreateExpense={() => setCurrentView('create-expense')}
          onProfileClick={handleProfileNavigation}
        />
      );
  }
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </AuthProvider>
    </AccessibilityProvider>
  );
}