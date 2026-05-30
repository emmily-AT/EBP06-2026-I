import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (data: Partial<Pick<User, 'name' | 'email'>>) => { success: boolean; error?: string };
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const register = async (name: string, email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.find((u: User & { password: string }) => u.email === email)) {
      return { success: false, error: 'Este correo ya está registrado' };
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    return { success: true };
  };

  const login = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User & { password: string }) => u.email === email && u.password === password);

    if (!user) {
      return { success: false, error: 'Correo o contraseña incorrectos' };
    }

    const userWithoutPassword = { id: user.id, email: user.email, name: user.name };
    setUser(userWithoutPassword);
    localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const updateUser = (data: Partial<Pick<User, 'name' | 'email'>>) => {
    if (!user) return { success: false, error: 'No hay sesión activa' };
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (data.email && data.email !== user.email) {
      if (users.find((u: User & { password: string }) => u.email === data.email)) {
        return { success: false, error: 'Este correo ya está registrado' };
      }
    }
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('auth_user', JSON.stringify(updated));
    const updatedUsers = users.map((u: User & { password: string }) =>
      u.id === user.id ? { ...u, ...data } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>
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
