import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../api/authService';

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  currency?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      authService.getProfile()
        .then(res => {
          const data = res.data;
          setUser({
            id: data.id,
            username: data.username,
            email: data.email,
            name: data.fullName,
            currency: data.currency,
            role: data.role,
          });
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const register = async (name: string, email: string, password: string) => {
    try {
      await authService.register(email, email, password, name);
      return { success: true };
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Error al crear la cuenta';
      return { success: false, error: msg };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await authService.login(email, password);
      const { token, userId, username, fullName } = res.data;

      localStorage.setItem('auth_token', token);

      // Fetch full profile after login
      const profileRes = await authService.getProfile();
      const data = profileRes.data;
      const userData: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        name: data.fullName,
        currency: data.currency,
        role: data.role,
      };

      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      return { success: true };
    } catch (err: any) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Correo o contraseña incorrectos';
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
