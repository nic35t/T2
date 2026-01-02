
import React, { useEffect } from 'react';
import { AppScreen, NavigationHandler } from '../types';

interface BookingSuccessScreenProps {
  onNavigate: NavigationHandler;
  data?: {
    title: string;
    totalPaid: number;
    totalSaved: number;
    pointsEarned: number;
    isVoucher?: boolean;
    isGift?: boolean;
  };
}

export const BookingSuccessScreen: React.FC<BookingSuccessScreenProps> = ({ onNavigate, data }) => {
  const isVoucher = data?.isVoucher || false;
  const isGift = data?.isGift || false;

  useEffect(() => {
    // Auto redirect after 6 seconds if no interaction
    const timer = setTimeout(() => {
      onNavigate(AppScreen.TICKETS);
    }, 6000);
    return () => clearTimeout(timer);
  }, [onNavigate]);

  const formatKRW = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  return (
    <div className="relative h-screen w-full bg-[#0F0F12] flex flex-col items-center justify-center overflow-hidden text-white">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-lotte-red/10 rounded-full blur-[100px] animate-pulse-slow"></div>

      {/* Confetti (Simple CSS Animation) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {[...Array(25)].map((_, i) => (
            <div 
               key={i} 
               className={`absolute w-1.5 h-3 ${i % 2 === 0 ? 'bg-primary' : 'bg-lotte-red'}`}
               style={{
                  left: `${Math.random() * 100}%`,
                  top: `-20px`,
                  animation: `fall ${2 + Math.random() * 3}s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                  transform: `rotate(${Math.random() * 360}deg)`
               }}
            ></div>
         ))}
      </div>

      <div className="relative z-10 w-full max-w-md px-8 text-center animate-fade-in-up">
        {/* Success Icon */}
        <div className="mb-8 relative inline-block">
          <div className="size-24 rounded-full bg-gradient-to-tr from-lotte-red to-[#FF6B6B] flex items-center justify-center shadow-[0_0_40px_rgba(218,41,28,0.5)]">
            <span className="material-symbols-outlined text-5xl text-white">check_circle</span>
          </div>
          <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-50"></div>
        </div>

        <h1 className="text-3xl font-serif font-bold mb-2 text-white">
          {isGift ? 'Gift Sent' : (isVoucher ? 'Charge Complete' : 'Booking Confirmed')}
        </h1>
        <p className="text-gray-400 mb-8 font-light">
          {isGift ? 'Recipient will receive a text message.' : (isVoucher ? 'Your points are ready to use.' : 'See you at the venue.')}
        </p>

        {/* Benefit Card */}
        <div className="bg-surface-card rounded-2xl p-6 border border-white/10 shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-300 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-lotte-red"></div>
           
           <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">{data?.title || 'Purchase Summary'}</p>
           
           <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-4">
              <span className="text-gray-400 text-sm">Total Paid</span>
              <span className="text-2xl font-bold font-mono text-white">{formatKRW(data?.totalPaid || 0)}</span>
           </div>

           <div className="space-y-3">
              {!isVoucher && (
                <div className="flex justify-between items-center text-sm">
                   <div className="flex items-center gap-1.5 text-blue-400">
                      <span className="material-symbols-outlined text-base">savings</span>
                      <span>You Saved (20%)</span>
                   </div>
                   <span className="font-bold text-blue-400">-{formatKRW(data?.totalSaved || 0)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-1.5 text-primary">
                    <span className="material-symbols-outlined text-base">monetization_on</span>
                    <span>{isVoucher ? 'Bonus Points (5%)' : 'L-Point Earned (10%)'}</span>
                 </div>
                 <span className="font-bold text-primary">+{data?.pointsEarned?.toLocaleString()} P</span>
              </div>
           </div>
        </div>

        <div className="flex flex-col gap-3">
          {!isGift && (
            <button 
              onClick={() => onNavigate(AppScreen.TICKETS)}
              className="w-full h-14 bg-lotte-red text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              <span>View Ticket Asset</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          )}
          
          <button 
            onClick={() => onNavigate(AppScreen.HOME)}
            className={`w-full h-14 ${isGift ? 'bg-lotte-red text-white shadow-lg' : 'bg-transparent text-gray-500 hover:text-white'} font-bold rounded-xl transition-colors text-sm uppercase tracking-widest`}
          >
            Return Home
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
