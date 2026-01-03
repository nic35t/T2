
import React from 'react';
import { useAppContext } from '../context/AppContext';

interface CouponsScreenProps {
  onBack: () => void;
}

export const CouponsScreen: React.FC<CouponsScreenProps> = ({ onBack }) => {
  const { coupons } = useAppContext();

  const formatAmount = (amount: number, unit: 'KRW' | 'PERCENT') => {
     if (unit === 'PERCENT') return `${amount}%`;
     return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  const sortedCoupons = [...coupons].sort((a, b) => {
     if (a.status === 'active' && b.status !== 'active') return -1;
     if (a.status !== 'active' && b.status === 'active') return 1;
     return 0;
  });

  return (
    <div className="bg-gray-50 dark:bg-background min-h-screen text-gray-900 dark:text-white font-sans animate-fade-in transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-4 h-16 flex items-center gap-4 transition-colors">
         <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
         </button>
         <h1 className="text-lg font-serif font-bold">Discount Coupons</h1>
      </header>

      <main className="p-4 space-y-4 pb-20">
         {sortedCoupons.length > 0 ? (
            sortedCoupons.map((coupon) => {
               const isActive = coupon.status === 'active';
               return (
                <div key={coupon.id} className={`relative flex overflow-hidden rounded-xl border transition-colors shadow-sm ${isActive ? 'bg-white dark:bg-surface-card border-gray-200 dark:border-white/5' : 'bg-gray-100 dark:bg-white/5 border-transparent opacity-60 grayscale'}`}>
                   {/* Left Side: Amount */}
                   <div className={`w-28 flex flex-col items-center justify-center p-2 border-r border-dashed ${isActive ? 'bg-primary/5 dark:bg-primary/10 border-gray-200 dark:border-white/10 text-primary' : 'bg-gray-200 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-500'}`}>
                      <span className="text-2xl font-bold font-mono tracking-tight">{formatAmount(coupon.amount, coupon.unit)}</span>
                      <span className="text-[10px] font-bold uppercase">OFF</span>
                   </div>

                   {/* Right Side: Info */}
                   <div className="flex-1 p-4 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-1">
                         <h3 className="font-bold text-sm text-gray-900 dark:text-white">{coupon.title}</h3>
                         {!isActive && (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-gray-500">
                               {coupon.status}
                            </span>
                         )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{coupon.description}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">Valid until {coupon.validUntil}</p>
                   </div>
                   
                   {/* Decorative Circles */}
                   <div className="absolute -top-1.5 left-[6.8rem] size-3 rounded-full bg-gray-50 dark:bg-background z-10"></div>
                   <div className="absolute -bottom-1.5 left-[6.8rem] size-3 rounded-full bg-gray-50 dark:bg-background z-10"></div>
                </div>
               );
            })
         ) : (
            <div className="flex flex-col items-center justify-center pt-32 text-gray-400 dark:text-gray-500">
               <span className="material-symbols-outlined text-4xl mb-4 opacity-50">local_offer</span>
               <p className="text-sm">No coupons available.</p>
            </div>
         )}
      </main>
    </div>
  );
};
