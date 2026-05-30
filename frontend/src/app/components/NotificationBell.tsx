import { useState, useRef, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface NotificationBellProps {
  variant?: 'light' | 'dark';
}

export function NotificationBell({ variant = 'light' }: NotificationBellProps) {
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleBellClick = () => {
    if (!isOpen && unreadCount > 0) {
      markAllAsRead();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={handleBellClick}
        className={`relative p-2 rounded-xl transition-colors ${
          variant === 'dark' ? 'hover:bg-white/10' : 'hover:bg-slate-100'
        } ${unreadCount > 0 ? 'animate-shake' : ''}`}
      >
        <Bell
          className={`w-6 h-6 ${variant === 'dark' ? 'text-white' : 'text-[#F2B233]'}`}
          fill={variant === 'dark' ? 'white' : '#F2B233'}
        />

        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 max-h-[500px] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-slate-900 font-medium">Notificaciones</h3>
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                Limpiar todo
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No tienes notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-slate-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        !notification.isRead ? 'bg-blue-500' : 'bg-slate-300'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {format(new Date(notification.date), "dd 'de' MMMM, HH:mm", { locale: es })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CSS for shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg); }
          20%, 40%, 60%, 80% { transform: rotate(10deg); }
        }

        .animate-shake {
          animation: shake 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
