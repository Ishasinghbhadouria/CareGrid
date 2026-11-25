import React from 'react';
import {
  Bell,
  X,
  Calendar,
  Clock,
  FileText,
  Ambulance,
  UserCheck
} from 'lucide-react';

export default function NotificationsDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onNotificationClick
}) {
  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'emergency':
        return <Ambulance className="w-4 h-4 text-rose-600" />;
      case 'queue':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'appointment':
        return <Calendar className="w-4 h-4 text-teal-600" />;
      case 'record':
        return <FileText className="w-4 h-4 text-cyan-600" />;
      case 'carecircle':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm sm:max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col justify-between animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div>
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                  <p className="text-[11px] text-slate-400">
                    Live updates across all CareGrid pipelines
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Actions */}
            <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {notifications.filter((n) => !n.read).length} unread alerts
              </span>
              <button
                onClick={onMarkAllAsRead}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors"
              >
                Mark all as read
              </button>
            </div>

            {/* Notification Items List */}
            <div className="p-3 sm:p-4 space-y-2.5 overflow-y-auto max-h-[calc(100vh-10rem)]">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNotificationClick && onNotificationClick(item)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    item.read
                      ? 'bg-slate-50/50 border-slate-100 opacity-80'
                      : 'bg-white border-slate-200 shadow-2xs hover:border-teal-500/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 shrink-0">
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {item.title}
                        </h4>
                        {!item.read && (
                          <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {item.message}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1.5 block">
                        {item.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
            <span className="text-[11px] text-slate-400 font-medium">
              CareGrid Real-time Push Protocol Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
