import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  message: string;
  date: string;
  isRead: boolean;
  category?: string;
  type: 'budget_alert' | 'info' | 'recommendation';
  recommendationId?: string; // ID de la recomendación asociada
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'isRead'>) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('notifications');
    if (saved) {
      setNotifications(JSON.parse(saved));
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'date' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      isRead: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({
        ...notification,
        isRead: true,
      }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
