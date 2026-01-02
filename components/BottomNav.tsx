
import React, { useState, useEffect, useRef } from 'react';
import { AppScreen } from '../types';

interface BottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      // Logic:
      // 1. Always show at the very top (start) or very bottom (end of content).
      // 2. Hide when scrolling down (> lastScrollY) beyond a small threshold.
      // 3. Show when scrolling up.
      
      if (currentScrollY <= 10 || currentScrollY >= maxScroll - 10) {
        setIsVisible(true);
      } else {
         // Scrolling Down
         if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
            setIsVisible(false);
         } 
         // Scrolling Up
         else if (currentScrollY < lastScrollY.current) {
            setIsVisible(true);
         }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset visibility to true whenever the screen changes
  useEffect(() => {
    setIsVisible(true);
  }, [currentScreen]);

  const getIconClass = (screen: AppScreen) => {
    // Check if the current screen matches or if it's a sub-screen of MY (like Customer Center)
    const isActive = currentScreen === screen || (screen === AppScreen.MY && currentScreen === AppScreen.CUSTOMER_CENTER);
    
    return `material-symbols-outlined text-[26px] transition-all duration-500 ${
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
    <nav 
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-[#121212]/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/5 pb-[env(safe-area-inset-bottom)] pt-2 transition-transform duration-700 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
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
