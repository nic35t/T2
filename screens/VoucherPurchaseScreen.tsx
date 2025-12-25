
import React, { useState } from 'react';
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
  
  const { addTicket, updateBalance } = useAppContext();

  const denominations = [
     { val: 10000, bonus: 500 },
     { val: 30000, bonus: 1500 },
     { val: 50000, bonus: 2500 },
     { val: 100000, bonus: 5000 }
  ];

  const currentOption = denominations.find(d => d.val === amount) || denominations[3];
  const totalPoints = currentOption.val + currentOption.bonus;
  const bonusRate = (currentOption.bonus / currentOption.val) * 100;

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
     // Show toast simulation?
     alert("SMS Sent to Recipient!"); 
     setShowConfirm(true);
  };

  const handleFinalPayment = () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      // Create new Voucher Ticket
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
        type: 'Digital Voucher'
      };

      if (!isGift) {
         addTicket(newVoucher);
         updateBalance(totalPoints);
      }

      setIsProcessing(false);
      setShowConfirm(false);
      
      onNavigate(AppScreen.BOOKING_SUCCESS, {
        title: 'Voucher Purchase',
        totalPaid: amount,
        totalSaved: 0,
        pointsEarned: currentOption.bonus,
        isVoucher: true
      });
    }, 1500);
  };

  return (
    <div className="relative h-screen bg-[#0F0F12] text-white flex flex-col animate-fade-in font-sans">
      <header className="flex items-center justify-between px-4 h-16 border-b border-white/5 bg-[#0F0F12] z-20">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <button onClick={onBack} className="text-white hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span className="font-serif font-bold text-lg">Purchase Voucher</span>
          <div className="size-6"></div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto relative no-scrollbar p-6">
        <div className="max-w-xl mx-auto w-full space-y-8">
           
           {/* Product Summary */}
           <div className="flex items-center gap-4 bg-[#1E1E24] p-4 rounded-2xl border border-white/5 shadow-lg">
              <div className="size-16 rounded-xl bg-cover bg-center shrink-0" style={{ backgroundImage: `url('${event.image}')` }}></div>
              <div>
                 <h2 className="font-bold text-white text-lg">{event.title}</h2>
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
                             ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-[1.02] border-none' 
                             : 'bg-[#1E1E24] text-white border border-white/10 hover:border-white/30'
                          }`}
                        >
                           {/* Shine Effect */}
                           {isSelected && <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>}
                           
                           <div className="flex flex-col items-start relative z-10">
                              <span className={`font-bold text-xl font-mono tracking-tight ${isSelected ? 'text-black' : 'text-white'}`}>{formatKRW(opt.val)}</span>
                              <span className={`text-xs ${isSelected ? 'text-black/70' : 'text-gray-500'}`}>Base Amount</span>
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
           <div className="bg-gradient-to-r from-[#1E1E24] to-[#25252b] p-5 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                    <span className="material-symbols-outlined">redeem</span>
                 </div>
                 <div>
                    <p className="font-bold text-sm text-white">Gift to Friend</p>
                    <p className="text-xs text-gray-500">Send via SMS instantly</p>
                 </div>
              </div>
              <div 
                 onClick={() => setIsGift(!isGift)}
                 className={`w-12 h-7 rounded-full relative transition-colors cursor-pointer ${isGift ? 'bg-primary' : 'bg-gray-700'}`}
              >
                 <div className={`absolute top-1 size-5 rounded-full bg-white transition-transform ${isGift ? 'left-6' : 'left-1'}`}></div>
              </div>
           </div>

           {/* Calculation Summary */}
           <div className="border-t border-dashed border-white/10 pt-6">
              <div className="flex justify-between items-center mb-2">
                 <span className="text-gray-400 text-sm">Pay</span>
                 <span className="text-white font-bold">{formatKRW(amount)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                 <span className="text-primary text-sm">Bonus ({bonusRate}%)</span>
                 <span className="text-primary font-bold">+{formatKRW(currentOption.bonus)}</span>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                 <span className="text-white font-bold text-lg">Total Charge</span>
                 <span className="text-3xl font-mono font-bold text-primary">{formatKRW(totalPoints)}</span>
              </div>
           </div>

           <div className="h-20"></div>
        </div>
      </div>

      {/* Checkout Bar */}
      <div className="bg-[#1E1E24] border-t border-white/10 p-6 pb-10 safe-area-bottom z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <button 
           onClick={handleInitialConfirm}
           className="w-full max-w-xl mx-auto h-14 rounded-2xl font-bold text-sm uppercase tracking-[0.1em] shadow-lg transition-all bg-white text-black hover:bg-gray-200 active:scale-[0.98] flex items-center justify-center gap-2"
        >
           <span>{isGift ? 'Send Gift' : 'Purchase & Charge'}</span>
           <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>

      {/* Gift Input Modal */}
      {showGiftModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowGiftModal(false)}></div>
            <div className="relative w-full max-w-sm bg-[#1E1E24] rounded-3xl border border-white/10 p-6 shadow-2xl animate-fade-in-up">
               <h3 className="text-xl font-serif font-bold text-white mb-4">Recipient Details</h3>
               <form onSubmit={handleGiftSubmit} className="space-y-4">
                  <div>
                     <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Name</label>
                     <input required type="text" className="w-full h-12 bg-black/30 border border-white/10 rounded-xl px-4 text-white focus:border-primary focus:outline-none" placeholder="Friend's Name" />
                  </div>
                  <div>
                     <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Phone Number</label>
                     <input required type="tel" className="w-full h-12 bg-black/30 border border-white/10 rounded-xl px-4 text-white focus:border-primary focus:outline-none" placeholder="010-XXXX-XXXX" />
                  </div>
                  <div className="pt-2">
                     <button type="submit" className="w-full h-12 bg-primary text-black font-bold rounded-xl">Confirm Recipient</button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => !isProcessing && setShowConfirm(false)}
          ></div>

          <div className="relative w-full max-w-sm bg-[#1E1E24] rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="p-8 flex flex-col items-center">
               <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary animate-pulse-slow">
                  <span className="material-symbols-outlined text-3xl">fingerprint</span>
               </div>
               <h3 className="text-xl font-bold text-white mb-2">Authenticate Payment</h3>
               <p className="text-gray-400 text-sm mb-6 text-center">Confirm purchase of {formatKRW(amount)} voucher.</p>
               
               <div className="w-full bg-black/30 rounded-xl p-4 mb-6 border border-white/5">
                  <div className="flex justify-between text-sm mb-1">
                     <span className="text-gray-500">Method</span>
                     <span className="text-white">L.PAY Card (88**)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-500">Total</span>
                     <span className="text-primary font-bold">{formatKRW(amount)}</span>
                  </div>
               </div>

               <button 
                  onClick={handleFinalPayment}
                  disabled={isProcessing}
                  className="w-full h-14 bg-gradient-to-r from-primary to-[#B8962E] text-black font-bold rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all active:scale-[0.98] uppercase tracking-wide text-sm flex items-center justify-center gap-2"
               >
                  {isProcessing ? <span className="size-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span> : 'Confirm Payment'}
               </button>
               <button onClick={() => setShowConfirm(false)} className="mt-4 text-xs text-gray-500 underline">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
