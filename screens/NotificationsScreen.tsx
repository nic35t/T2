
import React from 'react';
import { IMAGES } from '../constants';
import { AppScreen, NavigationHandler } from '../types';
import { useAppContext } from '../context/AppContext';

interface NotificationsScreenProps {
  onBack: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBack }) => {
  const { notifications, markAsRead } = useAppContext();

  const getIcon = (type: 'info' | 'success' | 'alert') => {
    switch(type) {
        case 'success': return 'check_circle';
        case 'alert': return 'error';
        default: return 'info';
    }
  };

  const getColor = (type: 'info' | 'success' | 'alert') => {
    switch(type) {
        case 'success': return 'text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-500/10';
        case 'alert': return 'text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-500/10';
        default: return 'text-blue-600 dark:text-blue-500 bg-blue-100 dark:bg-blue-500/10';
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-background min-h-screen text-gray-900 dark:text-white font-sans relative transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-4 h-16 flex items-center gap-4 transition-colors">
         <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
         </button>
         <h1 className="text-lg font-serif font-bold">Notifications</h1>
      </header>

      <main className="p-4 space-y-4">
         {notifications.length > 0 ? (
            notifications.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => markAsRead(item.id)}
                  className={`relative p-5 rounded-2xl border transition-all cursor-pointer shadow-sm ${item.read ? 'bg-gray-100 dark:bg-surface-card border-transparent dark:border-white/5 opacity-70' : 'bg-white dark:bg-surface-card border-gray-200 dark:border-white/20'}`}
                >
                    {!item.read && <div className="absolute top-5 right-5 size-2 rounded-full bg-primary shadow-glow"></div>}
                    <div className="flex gap-4">
                        <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${getColor(item.type)}`}>
                            <span className="material-symbols-outlined text-[20px]">{getIcon(item.type)}</span>
                        </div>
                        <div>
                            <h3 className={`font-bold text-sm mb-1 ${item.read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>{item.title}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed mb-2">{item.message}</p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-600 font-mono uppercase tracking-wider">{item.time}</p>
                        </div>
                    </div>
                </div>
            ))
         ) : (
            <div className="flex flex-col items-center justify-center pt-32 text-gray-400 dark:text-gray-500">
               <span className="material-symbols-outlined text-4xl mb-4 opacity-50">notifications_off</span>
               <p className="text-sm">No new notifications</p>
            </div>
         )}
      </main>
    </div>
  );
};
