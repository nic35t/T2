
import React, { useState, useEffect } from 'react';
import { AppScreen, EventData, NavigationHandler, TicketData } from '../types';
import { useAppContext } from '../context/AppContext';

interface VoucherPurchaseScreenProps {
  event: EventData;
  onNavigate: NavigationHandler;
  onBack: () => void;
}

export const VoucherPurchaseScreen: React.FC<VoucherPurchaseScreenProps> = ({ event, onNavigate, onBack }) => {
  const [amount, setAmount] = useState(100000);
  const [isGift, setIsGift] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Gift details
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  
  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { addTicket, chargeBalance, addNotification } = useAppContext();

  const denominations = [
     { val: 10000, bonus: 500 },
     { val: 30000, bonus: 1500 },
     { val: 50000, bonus: 2500 },
     { val: 100000, bonus: 5000 }
  ];

  const currentOption = denominations.find(d => d.val === amount) || denominations[3];
  const totalPoints = currentOption.val + currentOption.bonus;
  const bonusRate = (currentOption.bonus / currentOption.val) * 100;

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const formatKRW = (val: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val);
  };

  const handleInitialConfirm = () => {
    if (isGift) {
       setShowGiftModal(true);
    } else {
       setShowConfirm(true);
    }
  };

  const handleGiftSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     setShowGiftModal(false);
     setToastMessage('🎁 Recipient verified! Link will be sent via SMS.');
     setShowConfirm(true);
  };

  const handleFinalPayment = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      // 1. Create Ticket object (works for both self and gift to track history)
      const newVoucher: TicketData = {
        id: `v-${Date.now()}`,
        eventId: event.id,
        category: 'voucher',
        title: event.title,
        location: 'All Branches',
        fullDate: `Valid until 2029.12.31`,
        balance: totalPoints,
        image: event.image,
        status: 'active',
        type: 'Digital Voucher',
        isGift: isGift,
        recipientName: isGift ? recipientName : undefined
      };
      
      addTicket(newVoucher);

      if (!isGift) {
         // Case 1: Buying for Self - Charge balance
         chargeBalance(totalPoints);
      } else {
         // Case 2: Gifting - Just notify
         addNotification({
            id: `gift-${Date.now()}`,
            title: 'Gift Sent',
            message: `You sent a ${formatKRW(totalPoints)} voucher to ${recipientName}.`,
            time: 'Just now',
            read: false,
            type: 'success'
         });
      }

      setIsProcessing(false);
      setShowConfirm(false);
      
      onNavigate(AppScreen.BOOKING_SUCCESS, {
        title: isGift ? 'Voucher Gift Sent' : 'Voucher Purchase',
        totalPaid: amount,
        totalSaved: 0,
        pointsEarned: currentOption.bonus,
        isVoucher: true
      });
    }, 1500);
  };

  return (
    <div className="relative h-screen bg-gray-50 dark:bg-[#0F0F12] text-gray-900 dark:text-white flex flex-col animate-fade-in font-sans transition-colors duration-300">
      
      {/* React Toast */}
      {toastMessage && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full font-bold shadow-2xl z-[100] animate-fade-in-up border border-gray-200">
           {toastMessage}
        </div>
      )}

      <header className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0F0F12] z-20 transition-colors">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <button onClick={onBack} className="text-gray-900 dark:text-white hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span className="font-serif font-bold text-lg">Purchase Voucher</span>
          <div className="size-6"></div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto relative no-scrollbar p-6">
        <div className="max-w-xl mx-auto w-full space-y-8">
           
           {/* Product Summary */}
           <div className="flex items-center gap-4 bg-white dark:bg-surface-card p-4 rounded-2xl border border-gray-200 dark:border-white/5 shadow-sm transition-colors">
              <div className="size-16 rounded-xl bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${event.image}')` }}></div>
              <div>
                 <h2 className="font-bold text-gray-900 dark:text-white text-lg">{event.title}</h2>
                 <p className="text-xs text-primary font-bold uppercase tracking-wider">Premium Digital Asset</p>
              </div>
           </div>

           {/* Denomination Selection - Premium Cards */}
           <div className="space-y-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Select Amount</label>
              <div className="grid grid-cols-1 gap-3">
                 {denominations.map((opt) => {
                    const isSelected = amount === opt.val;
                    return (
                        <button
                          key={opt.val}
                          onClick={() => setAmount(opt.val)}
                          className={`relative h-20 rounded-xl px-5 flex items-center justify-between transition-all duration-300 group overflow-hidden ${
                             isSelected 
                             ? 'bg-gradient-to-r from-primary to-[#F3E5AB] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-[1.02] border-none' 
                             : 'bg-white dark:bg-surface-card text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 hover:border-primary/30 dark:hover:border-white/30'
                          }`}
                        >
                           {/* Shine Effect */}
                           {isSelected && <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>}
                           
                           <div className="flex flex-col items-start relative z-10">
                              <span className={`font-bold text-xl font-mono tracking-tight ${isSelected ? 'text-black' : 'text-gray-900 dark:text-white'}`}>{formatKRW(opt.val)}</span>
                           </div>
                           <div className="flex flex-col items-end relative z-10">
                              <span className={`font-bold text-sm ${isSelected ? 'text-black' : 'text-primary'}`}>+{formatKRW(opt.bonus)}</span>
                              <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-black/20 text-black' : 'bg-primary/20 text-primary'}`}>
                                 {bonusRate}% BONUS
                              </div>
                           </div>
                        </button>
                    );
                 })}
              </div>
           </div>

           {/* Gifting Option */}
           <div className="bg-gradient-to-r from-white to-gray-100 dark:from-surface-card dark:to-surface-card/50 p-5 rounded-2xl border border-gray-200 dark:border-white/5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                 <div className="size-10 rounded-full bg-lotte-red/10 dark:bg-lotte-red/20 flex items-center justify-center text-lotte-red shadow-sm">
                    <span className="material-symbols-outlined">redeem</span>
                 </div>
                 <div>
                    <p className="font-bold text-sm text-gray-900 dark:text-white">Gift to Friend</p>
                    <p className="text-xs text-gray-500">Send via SMS instantly</p>
                 </div>
              </div>
              <div 
                 onClick={() => setIsGift(!isGift)}
                 className={`w-12 h-7 rounded-full relative transition-colors cursor-pointer ${isGift ? 'bg-lotte-red' : 'bg-gray-300 dark:bg-gray-700'}`}
              >
                 <div className={`absolute top-1 size-5 rounded-full bg-white transition-transform ${isGift ? 'left-6' : 'left-1'} shadow-sm`}></div>
              </div>
           </div>

           {/* Calculation Summary */}
           <div className="border-t border-dashed border-gray-200 dark:border-white/10 pt-6">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-gray-500 dark:text-gray-400 text-sm">Payment Amount</span>
                 <span className="text-gray-900 dark:text-white font-bold">{formatKRW(amount)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                 <span className="text-primary text-sm">Bonus Charged ({bonusRate}%)</span>
                 <span className="text-primary font-bold">+{formatKRW(currentOption.bonus)}</span>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
                 <span className="text-gray-900 dark:text-white font-bold text-lg">Total Charge Value</span>
                 <span className="text-3xl font-mono font-bold text-primary">{formatKRW(totalPoints)}</span>
              </div>
           </div>

           <div className="h-20"></div>
        </div>
      </div>

      {/* Checkout Bar */}
      <div className="bg-white dark:bg-[#1E1E24] border-t border-gray-200 dark:border-white/10 p-6 pb-10 safe-area-bottom z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transition-colors">
        <button 
           onClick={handleInitialConfirm}
           className="w-full max-w-xl mx-auto h-14 rounded-2xl font-bold text-sm uppercase tracking-[0.1em] shadow-lg transition-all bg-lotte-red text-white hover:bg-red-700 active:scale-[0.98] flex items-center justify-center gap-2"
        >
           <span>{isGift ? 'Send Gift' : 'Purchase & Charge'}</span>
           <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>

      {/* Gift Input Modal */}
      {showGiftModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setShowGiftModal(false)}></div>
            <div className="relative w-full max-w-sm bg-white dark:bg-surface-card rounded-3xl border border-gray-200 dark:border-white/10 p-6 shadow-2xl animate-fade-in-up">
               <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-4">Recipient Details</h3>
               <form onSubmit={handleGiftSubmit} className="space-y-4">
                  <div>
                     <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Name</label>
                     <input 
                        required 
                        type="text" 
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full h-12 bg-gray-100 dark:bg-black/30 border border-transparent dark:border-white/10 rounded-xl px-4 text-gray-900 dark:text-white focus:border-primary focus:outline-none focus:bg-white dark:focus:bg-black/50 transition-colors" 
                        placeholder="Friend's Name" 
                    />
                  </div>
                  <div>
                     <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Phone Number</label>
                     <input 
                        required 
                        type="tel" 
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        className="w-full h-12 bg-gray-100 dark:bg-black/30 border border-transparent dark:border-white/10 rounded-xl px-4 text-gray-900 dark:text-white focus:border-primary focus:outline-none focus:bg-white dark:focus:bg-black/50 transition-colors" 
                        placeholder="010-XXXX-XXXX" 
                     />
                  </div>
                  <div className="pt-2">
                     <button type="submit" className="w-full h-12 bg-lotte-red text-white font-bold rounded-xl shadow-lg">Confirm Recipient</button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/80 dark:bg-black/90 backdrop-blur-md"
            onClick={() => !isProcessing && setShowConfirm(false)}
          ></div>

          <div className="relative w-full max-w-sm bg-white dark:bg-surface-card rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="p-8 flex flex-col items-center">
               <div className="size-16 rounded-full bg-lotte-red/10 dark:bg-lotte-red/20 flex items-center justify-center mb-4 text-lotte-red animate-pulse-slow">
                  <span className="material-symbols-outlined text-3xl">fingerprint</span>
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Authenticate Payment</h3>
               <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 text-center">Confirm purchase of {formatKRW(amount)} voucher.</p>
               
               <div className="w-full bg-gray-100 dark:bg-black/30 rounded-xl p-4 mb-6 border border-gray-200 dark:border-white/5">
                  <div className="flex justify-between text-sm mb-1">
                     <span className="text-gray-500">Method</span>
                     <span className="text-gray-900 dark:text-white">L.PAY Card (88**)</span>
                  </div>
                  {isGift && (
                     <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Recipient</span>
                        <span className="text-gray-900 dark:text-white font-bold">{recipientName}</span>
                     </div>
                  )}
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-500">Total</span>
                     <span className="text-lotte-red font-bold">{formatKRW(amount)}</span>
                  </div>
               </div>

               <button 
                  onClick={handleFinalPayment}
                  disabled={isProcessing}
                  className="w-full h-14 bg-lotte-red text-white font-bold rounded-xl shadow-[0_0_20px_rgba(218,41,28,0.3)] transition-all active:scale-[0.98] uppercase tracking-wide text-sm flex items-center justify-center gap-2"
               >
                  {isProcessing ? <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Confirm Payment'}
               </button>
               <button onClick={() => setShowConfirm(false)} className="mt-4 text-xs text-gray-500 underline">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
