
import React from 'react';
import { IMAGES } from '../constants';
import { AppScreen, NavigationHandler } from '../types';
import { useAppContext } from '../context/AppContext';

interface MyScreenProps {
  onNavigate?: NavigationHandler;
}

export const MyScreen: React.FC<MyScreenProps> = ({ onNavigate }) => {
  const { logout } = useAppContext();

  const handleLogout = () => {
    logout();
    onNavigate?.(AppScreen.ONBOARDING);
  };

  const navigateToCustomerCenter = (tab: 'NOTICE' | 'FAQ' | 'INQUIRY') => {
    onNavigate?.(AppScreen.CUSTOMER_CENTER, { initialTab: tab });
  };

  return (
    <div className="bg-background min-h-screen text-white font-display pb-28 animate-fade-in">
      <header className="flex-none pt-12 pb-4 px-6 flex items-center justify-center relative z-10 border-b border-white/5">
        <h1 className="text-lg font-bold tracking-tight font-serif">My L.TICKET</h1>
        <div 
          onClick={() => onNavigate?.(AppScreen.TICKETS)}
          className="absolute right-6 text-primary cursor-pointer hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[24px]">confirmation_number</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-6">
        {/* User Info Section */}
        <div className="relative flex flex-col items-center pt-8 pb-8 px-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="w-28 h-28 rounded-full overflow-hidden border-[3px] border-surface-card shadow-2xl relative">
                <img src={IMAGES.profile} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 bg-primary text-background p-1.5 rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined text-[16px]">edit</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-1">
              <h2 className="text-xl font-bold tracking-tight font-serif">Alex Thespian</h2>
              <p className="text-primary-light/70 text-sm font-medium">alex@lticket.com</p>
              <div className="mt-2 py-0.5 px-3 bg-primary/10 border border-primary/20 rounded-full">
                <p className="text-primary text-[10px] font-bold tracking-wide uppercase">Gold Member</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Wallet Shortcut */}
        <div className="px-4 mb-6">
          <button 
            onClick={() => onNavigate?.(AppScreen.TICKETS)}
            className="w-full bg-surface-card border border-white/5 rounded-2xl p-4 flex items-center justify-between group shadow-lg hover:border-primary/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-background transition-colors">
                <span className="material-symbols-outlined">confirmation_number</span>
              </div>
              <div className="text-left">
                <h3 className="text-sm font-semibold text-white group-hover:text-primary transition-colors">Ticket Wallet</h3>
                <p className="text-xs text-gray-500">Check active tickets & history</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-500 group-hover:text-primary transition-colors text-[20px]">arrow_forward</span>
          </button>
        </div>

        {/* Menu Sections */}
        <div className="px-4 flex flex-col gap-6">
          
          {/* Customer Center Section */}
          <div>
            <h3 className="px-2 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Customer Center</h3>
            <div className="bg-surface-card rounded-2xl overflow-hidden shadow-sm border border-white/5">
              {[
                { icon: 'campaign', label: 'Notices', action: () => navigateToCustomerCenter('NOTICE') },
                { icon: 'help', label: 'FAQ', action: () => navigateToCustomerCenter('FAQ') },
                { icon: 'support_agent', label: '1:1 Inquiry', action: () => navigateToCustomerCenter('INQUIRY') }
              ].map((item, idx) => (
                <React.Fragment key={item.label}>
                  <button 
                    onClick={item.action}
                    className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left group"
                  >
                    <div className="flex items-center justify-center rounded-lg bg-[#2C2C2E] text-primary shrink-0 w-9 h-9">
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{item.label}</p>
                    </div>
                    <span className="material-symbols-outlined text-gray-600 text-[18px] group-hover:text-white transition-colors">chevron_right</span>
                  </button>
                  {idx < 2 && <div className="h-px bg-white/5 mx-4"></div>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* App Settings Section */}
          <div>
            <h3 className="px-2 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">App Settings</h3>
            <div className="bg-surface-card rounded-2xl overflow-hidden shadow-sm border border-white/5">
              {[
                { icon: 'notifications', label: 'Notifications', toggle: true },
                { icon: 'language', label: 'Language', sub: 'English' },
                { icon: 'dark_mode', label: 'Appearance', sub: 'Dark Mode' }
              ].map((item, idx) => (
                <React.Fragment key={item.label}>
                  <button className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left group">
                    <div className="flex items-center justify-center rounded-lg bg-[#2C2C2E] text-primary shrink-0 w-9 h-9">
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      {item.sub && <p className="text-[10px] text-gray-400 mt-0.5">{item.sub}</p>}
                    </div>
                    {item.toggle ? (
                      <div className="w-10 h-6 bg-primary rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    ) : (
                      <span className="material-symbols-outlined text-gray-600 text-[18px] group-hover:text-white transition-colors">chevron_right</span>
                    )}
                  </button>
                  {idx < 2 && <div className="h-px bg-white/5 mx-4"></div>}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full h-14 bg-surface-card border border-white/5 rounded-2xl flex items-center justify-center text-[#ff453a] font-bold hover:bg-[#ff453a]/10 hover:border-[#ff453a]/30 transition-all mt-2"
          >
            Log Out
          </button>
          
          <div className="pb-8 text-center">
            <p className="text-[10px] text-gray-600 font-mono">L.TICKET v2.0.0 (Build 20231101)</p>
          </div>
        </div>
      </main>
    </div>
  );
};
