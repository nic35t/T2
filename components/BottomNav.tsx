
import React from 'react';
import { AppScreen } from '../types';

interface BottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const getIconClass = (screen: AppScreen) => {
    // Check if the current screen matches or if it's a sub-screen of MY (like Customer Center)
    const isActive = currentScreen === screen || (screen === AppScreen.MY && currentScreen === AppScreen.CUSTOMER_CENTER);
    
    return `material-symbols-outlined text-[26px] transition-all duration-300 ${
      isActive ? 'text-primary scale-110 drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
    }`;
  };

  const getTextClass = (screen: AppScreen) => {
    const isActive = currentScreen === screen || (screen === AppScreen.MY && currentScreen === AppScreen.CUSTOMER_CENTER);
    return `text-[10px] font-bold tracking-wider uppercase mt-1 transition-colors ${
      isActive ? 'text-primary' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
    }`;
  };

  const navItems = [
    { id: AppScreen.HOME, icon: 'home', label: 'Home' },
    { id: AppScreen.SEARCH, icon: 'diamond', label: 'Curated' },
    { id: AppScreen.TICKETS, icon: 'confirmation_number', label: 'Tickets' },
    { id: AppScreen.MY, icon: 'person', label: 'My' }, // Changed from PROFILE to MY
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 pb-[env(safe-area-inset-bottom)] pt-2 transition-colors duration-300">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center justify-center flex-1 h-full group active:scale-95 transition-transform"
          >
            <span
              className={getIconClass(item.id)}
              style={{ fontVariationSettings: (currentScreen === item.id || (item.id === AppScreen.MY && currentScreen === AppScreen.CUSTOMER_CENTER)) ? "'FILL' 1" : "'FILL' 0" }}
            >
              {item.icon}
            </span>
            <span className={getTextClass(item.id)}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
