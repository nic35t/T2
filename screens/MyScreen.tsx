
import React from 'react';
import { IMAGES } from '../constants';
import { AppScreen, NavigationHandler } from '../types';
import { useAppContext } from '../context/AppContext';

interface MyScreenProps {
  onNavigate?: NavigationHandler;
}

export const MyScreen: React.FC<MyScreenProps> = ({ onNavigate }) => {
  const { logout, userBalance, userPoints } = useAppContext();

  const handleLogout = () => {
    logout();
    onNavigate?.(AppScreen.ONBOARDING);
  };

  const navigateToCustomerCenter = (tab: 'NOTICE' | 'FAQ' | 'INQUIRY') => {
    onNavigate?.(AppScreen.CUSTOMER_CENTER, { initialTab: tab });
  };

  const formatKRW = (amount: number) => new Intl.NumberFormat('ko-KR').format(amount);

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
              <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-surface-card shadow-2xl relative">
                <img src={IMAGES.profile} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-1">
              <h2 className="text-xl font-bold tracking-tight font-serif">Alex Thespian</h2>
              <div className="mt-2 py-0.5 px-3 bg-gradient-to-r from-primary to-primary-dim rounded-full shadow-glow">
                <p className="text-black text-[10px] font-bold tracking-wide uppercase">Gold Member</p>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Dashboard Widget (New) */}
        <div className="px-4 mb-6">
           <div className="bg-surface-card border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10">
                 <span className="material-symbols-outlined text-6xl text-white">account_balance_wallet</span>
              </div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">My Assets</h3>
              <div className="flex gap-4">
                 <div className="flex-1">
                    <p className="text-[10px] text-gray-400 mb-1">L-Ticket Cash</p>
                    <p className="text-xl font-bold font-mono text-white tracking-tight">{formatKRW(userBalance)}</p>
                    <button 
                       onClick={() => onNavigate?.(AppScreen.HOME)} 
                       className="mt-2 text-[10px] font-bold text-lotte-red border border-lotte-red/30 px-2 py-1 rounded hover:bg-lotte-red hover:text-white transition-colors"
                    >
                       CHARGE
                    </button>
                 </div>
                 <div className="w-px bg-white/10"></div>
                 <div className="flex-1">
                    <p className="text-[10px] text-gray-400 mb-1">L-Point</p>
                    <p className="text-xl font-bold font-mono text-primary tracking-tight">{userPoints.toLocaleString()} P</p>
                    <p className="mt-2 text-[10px] text-gray-500">History &gt;</p>
                 </div>
              </div>
           </div>
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
            <p className="text-[10px] text-gray-600 font-mono">L.TICKET v3.0.0 (Phase 1 MVP)</p>
          </div>
        </div>
      </main>
    </div>
  );
};
