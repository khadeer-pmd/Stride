import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, CheckCheck, AlertTriangle, Calendar, BookOpen, ShieldAlert, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { AppNotification } from '../../types/academic';

interface NotificationsDropdownProps {
  onNavigate?: (tab: string) => void;
}

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ onNavigate }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'attendance' | 'warning' | 'academic' | 'system'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const getNotifIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'attendance':
        return <Calendar className="w-4 h-4 text-[#73AFA0]" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#D94F4F]" />;
      case 'academic':
        return <BookOpen className="w-4 h-4 text-[#2E9D68]" />;
      case 'system':
      default:
        return <ShieldAlert className="w-4 h-4 text-[#E9B95F]" />;
    }
  };

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationRead(notif.id);
    if (notif.link && onNavigate) {
      if (notif.link.includes('attendance')) {
        onNavigate('attendance');
      } else if (notif.link.includes('study-guide')) {
        onNavigate('study-guide');
      }
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-[#D1E5E1]/40 transition-colors focus:outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5 text-neutral-700" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#D94F4F] text-[10px] font-bold text-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#D1E5E1] z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Panel Header */}
          <div className="p-4 bg-[#E8F2F0]/80 border-b border-[#D1E5E1] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#73AFA0]" />
              <h3 className="font-semibold text-neutral-800 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold bg-[#73AFA0]/20 text-[#73AFA0] rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs text-[#73AFA0] hover:text-[#5c9386] font-medium flex items-center gap-1 transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-2 bg-white border-b border-neutral-100 overflow-x-auto scrollbar-none text-xs">
            {(['all', 'attendance', 'warning', 'academic'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded-full font-medium transition-all capitalize whitespace-nowrap ${
                  filter === tab
                    ? 'bg-[#73AFA0] text-white shadow-sm'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-neutral-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-neutral-400" />
                <p className="text-xs">No notifications found.</p>
              </div>
            ) : (
              filteredNotifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer hover:bg-[#E8F2F0]/40 transition-colors ${
                    !notif.read ? 'bg-[#FFE7A5]/10' : 'bg-white'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-neutral-100 mt-0.5 shrink-0">
                    {getNotifIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-medium truncate ${!notif.read ? 'text-neutral-900 font-semibold' : 'text-neutral-700'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-[10px] text-neutral-400 shrink-0">{notif.timestamp}</span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-[#73AFA0] shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
