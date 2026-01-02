
import React, { useState, useEffect } from 'react';
import { IMAGES } from '../constants';
import { AppScreen, NavigationHandler, TicketData, SeatGrade } from '../types';
import { useAppContext } from '../context/AppContext';

interface TicketsScreenProps {
  onNavigate?: NavigationHandler;
}

type TicketTab = 'available' | 'history' | 'canceled';

export const TicketsScreen: React.FC<TicketsScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TicketTab>('available');
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Cancel Logic State
  const [ticketToCancel, setTicketToCancel] = useState<TicketData | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCanceling, setIsCanceling] = useState(false);
  
  const { tickets, unreadCount, cancelTicket } = useAppContext();

  // Toast Timer
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Filter tickets logic
  // 'available': Live, Upcoming, Active (Non-gifts only)
  const availableTickets = tickets.filter(t => !t.isGift && ['live', 'upcoming', 'active'].includes(t.status));
  
  // 'history': Past events OR Gifted tickets (excluding canceled gifts)
  const historyTickets = tickets.filter(t => 
    ((!t.isGift && t.status === 'past') || (t.isGift)) && t.status !== 'canceled'
  );
  
  const canceledTickets = tickets.filter(t => t.status === 'canceled');
  
  // Logic for Available Stack
  const featuredTicket = availableTickets[activeIndex];
  const nextIndex = (activeIndex + 1) % availableTickets.length;
  const upcomingTicket = availableTickets.length > 1 ? availableTickets[nextIndex] : null;

  const handleShowQR = (e: React.MouseEvent, ticket: TicketData) => {
    e.stopPropagation();
    onNavigate?.(AppScreen.TICKET_QR, ticket);
  };

  const handleSwap = () => {
    if (availableTickets.length > 1) {
      setActiveIndex(nextIndex);
    }
  };

  const handleResendSMS = (e: React.MouseEvent, name?: string) => {
     e.stopPropagation();
     setToastMessage(`SMS has been resent to ${name || 'recipient'}.`);
  };

  const handleCancelClick = (e: React.MouseEvent, ticket: TicketData) => {
    e.stopPropagation();
    setTicketToCancel(ticket);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (!ticketToCancel) return;
    
    setIsCanceling(true);
    setTimeout(() => {
        cancelTicket(ticketToCancel.id);
        setIsCanceling(false);
        setShowCancelModal(false);
        setTicketToCancel(null);
        setToastMessage('Gift has been canceled successfully.');
    }, 1000);
  };

  const formatKRW = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  const renderTabButton = (tab: TicketTab, label: string, count?: number) => {
    const isActive = activeTab === tab;
    return (
      <button 
        onClick={() => setActiveTab(tab)}
        className={`relative flex-1 py-3 text-center transition-colors ${isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-400'}`}
      >
        <span className={`font-bold text-sm tracking-wide whitespace-nowrap ${isActive ? '' : 'font-medium'}`}>
          {label} {count !== undefined && count > 0 && `(${count})`}
        </span>
        {isActive && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-primary rounded-full shadow-glow animate-fade-in"></span>
        )}
      </button>
    );
  };

  return (
    <div className="bg-gray-100 dark:bg-background-dark min-h-screen pb-28 text-gray-900 dark:text-white font-sans relative overflow-hidden transition-colors duration-300">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full font-bold shadow-2xl z-[100] animate-fade-in-up border border-gray-200">
           {toastMessage}
        </div>
      )}

      {/* Texture Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url('${IMAGES.texture}')`, backgroundSize: 'cover' }}
      ></div>

      <header className="sticky top-0 z-50 bg-gray-100/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 transition-colors">
        <div className="flex items-center justify-between px-5 h-16 pt-2">
          <h1 className="text-xl font-serif font-bold tracking-tight text-gray-900 dark:text-white">My Wallet</h1>
          <button 
             onClick={() => onNavigate?.(AppScreen.NOTIFICATIONS)}
             className="size-10 flex items-center justify-center rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-all hover:bg-gray-50 dark:hover:bg-white/10 relative shadow-sm dark:shadow-none"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
               <span className="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full border border-gray-100 dark:border-background shadow-sm"></span>
            )}
          </button>
        </div>
        <div className="flex w-full px-4 mt-1 pb-1 overflow-x-auto no-scrollbar gap-4">
          {renderTabButton('available', 'Active', availableTickets.length)}
          {renderTabButton('history', 'History')}
          {renderTabButton('canceled', 'Canceled')}
        </div>
      </header>

      <main className="px-4 pt-6 flex flex-col relative min-h-[60vh] z-10">
        {/* Available Tab Content */}
        {activeTab === 'available' && (
          <div className="animate-fade-in">
            {availableTickets.length > 0 ? (
              <>
                {/* Info Banner */}
                <div className="bg-white dark:bg-surface-card border border-primary/20 rounded-xl p-4 flex items-start gap-3 mb-8 mx-1 shadow-sm transition-colors">
                  <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">info</span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                    Present the QR code at the counter or scan at the kiosk.
                  </p>
                </div>

                {/* Featured Ticket (Front) */}
                {featuredTicket && (
                  <div 
                    key={`front-${featuredTicket.id}`}
                    className="relative z-30 transform transition-all duration-500 hover:scale-[1.01] mb-[-40px]"
                  >
                    <div className={`bg-surface-card rounded-[2rem] overflow-hidden shadow-wallet-active border relative flex flex-col transition-colors duration-1000 ${featuredTicket.status === 'live' || featuredTicket.category === 'voucher' ? 'border-primary/30' : 'border-white/10'}`}>
                      {/* Header Strip */}
                      <div className={`bg-gradient-to-r ${featuredTicket.category === 'voucher' ? 'from-slate-800 to-black text-white' : (featuredTicket.status === 'live' ? 'from-primary to-[#B8962E] text-background' : 'from-surface-lighter to-surface-card text-white border-b border-white/10')} px-6 py-3 flex justify-between items-center shadow-lg relative z-10`}>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[20px] drop-shadow-sm">
                             {featuredTicket.category === 'voucher' ? 'credit_card' : 'confirmation_number'}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-widest drop-shadow-sm font-mono">
                            {featuredTicket.category === 'voucher' ? 'Premium Voucher' : (featuredTicket.status === 'live' ? "Today's Show" : "Upcoming")}
                          </span>
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm font-mono ${featuredTicket.status === 'live' || featuredTicket.category === 'voucher' ? 'animate-pulse' : ''} ${featuredTicket.status === 'live' ? 'bg-black/80 text-primary' : 'bg-white/10 text-gray-300'}`}>
                          {featuredTicket.category === 'voucher' ? 'VALID' : (featuredTicket.status === 'live' ? 'D-DAY' : 'D-45')}
                        </span>
                      </div>

                      {/* Ticket Image Area */}
                      <div className="relative h-56 w-full">
                        <div 
                           className="absolute inset-0 bg-cover bg-center"
                           style={{ backgroundImage: `url('${featuredTicket.image}')` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-surface-card/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full px-6 pb-4">
                          <h2 className="font-serif text-3xl font-bold leading-tight text-white mb-1 drop-shadow-lg">{featuredTicket.title}</h2>
                          <p className="text-sm text-gray-200 font-medium flex items-center gap-1 opacity-90 font-mono">
                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                            {featuredTicket.location}
                          </p>
                        </div>
                      </div>

                      {/* Ticket Details */}
                      <div className="px-6 pb-6 bg-surface-card relative pt-4 text-white">
                         <div className="relative flex items-center justify-between mb-5 opacity-30">
                            <div className="w-3 h-6 bg-background rounded-r-full absolute -left-6"></div>
                            <div className="flex-1 border-t-2 border-dashed border-white mx-1"></div>
                            <div className="w-3 h-6 bg-background rounded-l-full absolute -right-6"></div>
                         </div>

                         {featuredTicket.category === 'voucher' ? (
                            // Voucher Layout
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6">
                               <div className="col-span-2">
                                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-bold font-sans">Balance</p>
                                  <p className="text-2xl font-bold text-primary font-mono tracking-tighter">{formatKRW(featuredTicket.balance || 0)}</p>
                               </div>
                               <div>
                                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-bold font-sans">Validity</p>
                                  <p className="text-sm font-semibold text-white font-mono">{featuredTicket.fullDate}</p>
                               </div>
                               <div>
                                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-bold font-sans">Voucher No.</p>
                                  <p className="text-sm font-mono text-white tracking-widest">**** {featuredTicket.id.slice(-4)}</p>
                               </div>
                            </div>
                         ) : (
                            // Performance Layout
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6">
                                <div>
                                   <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-bold font-sans">Date</p>
                                   <p className="text-sm font-semibold text-white font-mono">{featuredTicket.fullDate}</p>
                                   <p className="text-[11px] text-gray-400">Time check required</p>
                                </div>
                                <div>
                                   <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1 font-bold font-sans">Time</p>
                                   <p className="text-sm font-semibold text-white font-mono">{featuredTicket.time}</p>
                                   <p className="text-[11px] text-gray-400">Entry starts 30m prior</p>
                                </div>
                                <div className="col-span-2">
                                   <div className="bg-white/5 rounded-xl border border-white/5 p-3 flex justify-between items-center">
                                      <div>
                                         <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5 font-bold font-sans">Seat</p>
                                         <p className="text-sm font-bold text-primary font-mono">{featuredTicket.seats}</p>
                                      </div>
                                      <span className="material-symbols-outlined text-white/20">chair</span>
                                   </div>
                                </div>
                            </div>
                         )}

                         <button 
                          onClick={(e) => handleShowQR(e, featuredTicket)}
                          className="relative group w-full h-14 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-white/20 transition-all shadow-lg overflow-hidden"
                         >
                            <div className="absolute inset-0 bg-primary/5 animate-pulse-slow"></div>
                            
                            <span className="material-symbols-outlined text-[22px] relative z-10">{featuredTicket.category === 'voucher' ? 'barcode_scanner' : 'qr_code_2'}</span>
                            <span className="tracking-wide text-sm uppercase relative z-10">{featuredTicket.category === 'voucher' ? 'Scan to Pay' : 'View Mobile Ticket'}</span>
                            
                            {(featuredTicket.status === 'live' || featuredTicket.category === 'voucher') && (
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 flex size-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full size-2 bg-primary"></span>
                              </span>
                            )}
                         </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upcoming Ticket (Stacked Behind) */}
                {upcomingTicket && (
                  <div 
                    key={`back-${upcomingTicket.id}`}
                    onClick={handleSwap}
                    className="relative z-20 scale-[0.96] opacity-90 transition-all duration-500 group hover:scale-[0.97] hover:-mt-[30px] cursor-pointer"
                  >
                     <div className="bg-surface-lighter rounded-[2rem] overflow-hidden border-t border-white/10 relative h-full pt-16 pb-6 shadow-2xl">
                        {/* Top Banner */}
                        <div className="absolute top-0 left-0 w-full h-20 flex justify-between items-start px-6 pt-5 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none">
                           <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${upcomingTicket.category === 'voucher' ? 'bg-slate-400' : (upcomingTicket.status === 'live' ? 'bg-primary shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]')}`}></div>
                              <span className="text-xs font-bold uppercase tracking-wider text-gray-300 font-mono">
                                {upcomingTicket.category === 'voucher' ? 'Voucher' : (upcomingTicket.status === 'live' ? "Today's Show" : "Upcoming")}
                              </span>
                           </div>
                           <span className="text-[10px] font-bold text-gray-400 border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm font-mono">
                             {upcomingTicket.category === 'voucher' ? 'VALID' : (upcomingTicket.status === 'live' ? 'D-DAY' : 'D-45')}
                           </span>
                        </div>

                        <div className="px-5 mt-4">
                           <div className="flex gap-4 items-start mb-6 pointer-events-none">
                              <div 
                                 className="w-20 h-28 bg-cover bg-center shrink-0 rounded-xl shadow-lg border border-white/5 opacity-80"
                                 style={{ backgroundImage: `url('${upcomingTicket.image}')` }}
                              ></div>
                              <div className="flex-1 pt-1">
                                 <h3 className="font-serif text-xl font-bold leading-tight mb-1 text-gray-200">{upcomingTicket.title}</h3>
                                 <p className="text-xs text-gray-500 mb-4 font-mono">{upcomingTicket.location}</p>
                                 <div className="space-y-2">
                                    {upcomingTicket.category === 'voucher' ? (
                                        <p className="text-lg font-bold text-primary font-mono tracking-tighter">
                                            {formatKRW(upcomingTicket.balance || 0)}
                                        </p>
                                    ) : (
                                        <>
                                            <p className="text-xs font-medium text-gray-400 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px] text-gray-500">calendar_today</span>
                                                <span className="font-mono">{upcomingTicket.fullDate}</span>
                                            </p>
                                            <p className="text-xs font-medium text-gray-400 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[16px] text-gray-500">confirmation_number</span>
                                                <span className="font-mono">{upcomingTicket.seats}</span>
                                            </p>
                                        </>
                                    )}
                                 </div>
                              </div>
                           </div>
                           <button 
                              className="w-full h-12 bg-white/10 backdrop-blur-md border border-white/10 rounded-xl font-semibold flex items-center justify-center gap-2 group-hover:bg-white/20 group-hover:text-white transition-all pointer-events-none text-gray-300"
                           >
                              <span className="material-symbols-outlined text-[20px]">touch_app</span>
                              <span className="text-xs uppercase tracking-wide">Touch for details</span>
                           </button>
                        </div>
                     </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center pt-20 text-gray-400 dark:text-gray-500">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">account_balance_wallet</span>
                <p className="text-sm">Wallet is empty</p>
              </div>
            )}
          </div>
        )}

        {/* History Tab Content (Merged) */}
        {activeTab === 'history' && (
          <div className="animate-fade-in space-y-4">
             <div className="relative py-4 mb-2">
               <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-white/10"></div>
               </div>
               <div className="relative flex justify-center">
                  <span className="bg-gray-100 dark:bg-background-dark px-4 text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] font-mono">Transactions</span>
               </div>
            </div>

            {historyTickets.length > 0 ? (
              historyTickets.map((t) => {
                const isGift = t.isGift;
                
                return (
                  <div key={t.id} className="group relative bg-white dark:bg-surface-card rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-primary/50 transition-all shadow-sm mb-4">
                     {/* Gift Indication Strip */}
                     {isGift && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-lotte-red"></div>}

                     <div className={`flex p-4 gap-4 items-center ${isGift ? 'pl-5' : ''}`}>
                        {/* Thumbnail */}
                        <div 
                           className={`w-14 h-14 rounded-xl bg-cover bg-center shadow-inner shrink-0 ${!isGift ? 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100' : ''}`}
                           style={{ backgroundImage: `url('${t.image}')` }}
                        ></div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-start mb-0.5">
                              <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate pr-2">{t.title}</h3>
                              
                              {/* Status Badge */}
                              {isGift ? (
                                 <span className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-50 dark:bg-red-500/10 text-lotte-red border border-red-100 dark:border-red-500/20">
                                    <span className="material-symbols-outlined text-[10px]">redeem</span>
                                    Sent
                                 </span>
                              ) : (
                                 <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-white/10 text-gray-500 border border-gray-200 dark:border-white/5">
                                    Watched
                                 </span>
                              )}
                           </div>

                           <div className="flex flex-col gap-0.5">
                                 {isGift ? (
                                    <>
                                       <div className="flex items-center gap-1.5 mb-1">
                                          <p className="text-xs text-gray-500 dark:text-gray-400">To.</p>
                                          <p className="text-sm font-bold text-gray-900 dark:text-white">{t.recipientName}</p>
                                       </div>
                                       <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/5 pt-2 mt-1">
                                          <p className="text-[10px] text-gray-400 font-mono">
                                             {t.category === 'voucher' ? `₩${t.balance?.toLocaleString()}` : t.fullDate}
                                          </p>
                                          <div className="flex gap-2">
                                            <button 
                                                onClick={(e) => handleCancelClick(e, t)}
                                                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-[10px] font-bold text-gray-600 dark:text-gray-400 transition-colors border border-gray-200 dark:border-white/5"
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                onClick={(e) => handleResendSMS(e, t.recipientName)}
                                                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 dark:bg-white/10 hover:bg-lotte-red hover:text-white text-[10px] font-bold text-gray-500 transition-colors border border-gray-200 dark:border-white/5"
                                            >
                                                <span className="material-symbols-outlined text-[12px]">sms</span>
                                                Resend
                                            </button>
                                          </div>
                                       </div>
                                    </>
                                 ) : (
                                    <>
                                       <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{t.location}</p>
                                       <p className="text-[10px] text-gray-400 font-mono mt-0.5">{t.date}</p>
                                    </>
                                 )}
                           </div>
                        </div>
                        
                        {/* Chevron for non-gifts (view details) */}
                        {!isGift && (
                           <div className="flex items-center justify-center">
                              <span className="material-symbols-outlined text-gray-300 dark:text-white/20 group-hover:text-primary transition-colors">chevron_right</span>
                           </div>
                        )}
                     </div>
                  </div>
                );
              })
            ) : (
               <div className="flex flex-col items-center justify-center pt-20 text-gray-500 opacity-60">
                 <span className="material-symbols-outlined text-4xl mb-4 opacity-50">history</span>
                 <p className="text-sm font-medium">No history available</p>
               </div>
            )}
          </div>
        )}

        {/* Canceled Tab Content */}
        {activeTab === 'canceled' && (
          <div className="animate-fade-in flex flex-col items-center justify-center pt-24 text-gray-500 opacity-60 w-full">
             {canceledTickets.length > 0 ? (
                <div className="w-full space-y-3">
                    {canceledTickets.map(t => (
                    <div key={t.id} className="w-full bg-white dark:bg-surface-card p-4 rounded-xl border border-gray-200 dark:border-white/5 opacity-50">
                        <div className="flex justify-between items-start">
                             <div>
                                <p className="text-gray-900 dark:text-white font-bold text-sm">{t.title}</p>
                                {t.isGift && <p className="text-[10px] text-gray-500 mt-0.5">Gift to {t.recipientName}</p>}
                             </div>
                             <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded border border-red-100 dark:border-red-900/30">Canceled</span>
                        </div>
                    </div>
                    ))}
                </div>
             ) : (
               <>
                 <div className="size-16 rounded-full bg-gray-200 dark:bg-white/5 flex items-center justify-center mb-4">
                   <span className="material-symbols-outlined text-3xl">event_busy</span>
                 </div>
                 <p className="text-sm font-medium">No canceled tickets found</p>
               </>
             )}
          </div>
        )}
      </main>

       {/* Cancel Confirmation Modal */}
       {showCancelModal && ticketToCancel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
            onClick={() => !isCanceling && setShowCancelModal(false)}
          ></div>

          <div className="relative w-full max-w-sm bg-white dark:bg-surface-card rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="p-8 flex flex-col items-center">
               <div className="size-16 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-4 text-gray-600 dark:text-white">
                  <span className="material-symbols-outlined text-3xl">cancel</span>
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 font-serif">Cancel Gift</h3>
               <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 text-center leading-relaxed">
                  Are you sure you want to cancel the gift to <span className="text-gray-900 dark:text-white font-bold">{ticketToCancel.recipientName}</span>?
                  <br/>The amount will be refunded to your balance.
               </p>
               
               <div className="flex gap-3 w-full">
                   <button 
                      onClick={() => setShowCancelModal(false)}
                      disabled={isCanceling}
                      className="flex-1 h-12 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors text-sm uppercase tracking-wide"
                   >
                      Keep Gift
                   </button>
                   <button 
                      onClick={confirmCancel}
                      disabled={isCanceling}
                      className="flex-1 h-12 bg-lotte-red text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition-colors text-sm uppercase tracking-wide flex items-center justify-center"
                   >
                      {isCanceling ? <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Yes, Cancel'}
                   </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
