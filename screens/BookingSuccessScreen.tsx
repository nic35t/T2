
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
  };
}

export const BookingSuccessScreen: React.FC<BookingSuccessScreenProps> = ({ onNavigate, data }) => {
  const isVoucher = data?.isVoucher || false;

  useEffect(() => {
    // Auto redirect after 5 seconds if no interaction
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-primary/10 rounded-full blur-[100px] animate-pulse-slow"></div>

      {/* Confetti (Simple CSS Animation) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {[...Array(20)].map((_, i) => (
            <div 
               key={i} 
               className="absolute w-2 h-4 bg-primary/80"
               style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
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
          <div className="size-24 rounded-full bg-gradient-to-tr from-primary to-[#F3E5AB] flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.6)]">
            <span className="material-symbols-outlined text-5xl text-black">check</span>
          </div>
          <div className="absolute inset-0 rounded-full border border-white/50 animate-ping opacity-50"></div>
        </div>

        <h1 className="text-3xl font-serif font-bold mb-2 text-white">
          {isVoucher ? 'Charge Complete' : 'Booking Confirmed'}
        </h1>
        <p className="text-gray-400 mb-8 font-light">
          {isVoucher ? 'Your points are ready to use.' : 'Your seat has been successfully reserved.'}
        </p>

        {/* Benefit Card */}
        <div className="bg-[#1E1E24] rounded-2xl p-6 border border-white/10 shadow-2xl mb-8 transform hover:scale-105 transition-transform duration-300">
           <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">{data?.title || 'Purchase Summary'}</p>
           
           <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-4">
              <span className="text-gray-400 text-sm">Payment</span>
              <span className="text-2xl font-bold font-mono text-white">{formatKRW(data?.totalPaid || 0)}</span>
           </div>

           <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-1.5 text-blue-400">
                    <span className="material-symbols-outlined text-base">savings</span>
                    <span>Discount Applied</span>
                 </div>
                 <span className="font-bold text-blue-400">-{formatKRW(data?.totalSaved || 0)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                 <div className="flex items-center gap-1.5 text-primary">
                    <span className="material-symbols-outlined text-base">loyalty</span>
                    <span>Points Earned</span>
                 </div>
                 <span className="font-bold text-primary">+{data?.pointsEarned?.toLocaleString()} P</span>
              </div>
           </div>
           
           <div className="mt-4 pt-4 bg-primary/10 -mx-6 -mb-6 p-4 rounded-b-2xl flex justify-between items-center">
              <span className="text-primary font-bold text-sm uppercase tracking-wide">Total Benefit Value</span>
              <span className="text-primary font-bold text-lg">{formatKRW((data?.totalSaved || 0) + (data?.pointsEarned || 0))}</span>
           </div>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={() => onNavigate(AppScreen.TICKETS)}
            className="w-full h-14 bg-white text-black font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-colors uppercase tracking-widest text-sm"
          >
            View My Wallet
          </button>
          <button 
            onClick={() => onNavigate(AppScreen.HOME)}
            className="w-full h-14 bg-transparent text-gray-500 font-bold rounded-xl hover:text-white transition-colors text-sm"
          >
            Go Home
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
