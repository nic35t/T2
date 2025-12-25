
import React from 'react';
import { AppScreen, EventData, NavigationHandler } from '../types';
import { useAppContext } from '../context/AppContext';

interface VoucherDetailsScreenProps {
  event: EventData;
  onNavigate: NavigationHandler;
  onBack: () => void;
}

export const VoucherDetailsScreen: React.FC<VoucherDetailsScreenProps> = ({ event, onNavigate, onBack }) => {
  const { likedEvents, toggleLike } = useAppContext();
  const isLiked = likedEvents.has(event.id);

  const formatKRW = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `L.TICKET - Premium Gift: ${event.title}`,
          text: `Send a premium L.TICKET gift voucher!`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      alert(`Link copied!`);
    }
  };

  const usageLocations = [
    { name: 'Lotte Dept. Store', icon: 'shopping_bag', desc: 'All branches incl. Avenuel & Young Plaza' },
    { name: 'Lotte Mart', icon: 'shopping_cart', desc: 'Lotte Mart, Super, and Fresh centers' },
    { name: 'Lotte Cinema', icon: 'movie', desc: 'Standard halls & Charlotte premium theaters' },
    { name: 'Lotte Hotels', icon: 'hotel', desc: 'Accommodation & F&B at all domestic chains' },
    { name: 'Lotte Duty Free', icon: 'flight_takeoff', desc: 'Offline stores (Passport required)' },
    { name: 'Lotte World', icon: 'attractions', desc: 'Adventure, Aquarium, and Water Park' },
  ];

  return (
    <div className="relative min-h-screen bg-background text-white animate-fade-in font-sans">
      {/* Sticky Header - Consistent with EventDetailsScreen */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-4 lg:px-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <button 
          onClick={onBack}
          className="pointer-events-auto size-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <div className="flex gap-3 pointer-events-auto">
          <button 
            onClick={handleShare}
            className="size-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">share</span>
          </button>
          <button 
             onClick={() => toggleLike(event.id)}
             className={`size-10 flex items-center justify-center rounded-full backdrop-blur-md transition-colors ${isLiked ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-white hover:bg-white/20'}`}
          >
            <span 
               className="material-symbols-outlined text-2xl transition-transform active:scale-90"
               style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
            >
               favorite_border
            </span>
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Column: Hero Image (Sticky on Desktop) */}
        <div className="relative h-[60vh] lg:h-screen lg:w-1/2 lg:sticky lg:top-0 shrink-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${event.image}')` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20 lg:bg-gradient-to-r lg:from-transparent lg:to-background/80"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-6 lg:p-12 lg:max-w-2xl">
            <div className="flex flex-wrap gap-2 mb-3 lg:mb-6">
              {event.tags.map(tag => (
                <span key={tag} className="px-3 py-1 lg:px-4 lg:py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] lg:text-xs font-bold uppercase backdrop-blur-sm font-mono tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-serif text-4xl lg:text-7xl font-bold leading-tight mb-2 lg:mb-4 drop-shadow-xl">{event.title}</h1>
            <div className="flex items-center gap-2 text-gray-300 text-sm lg:text-base">
              <span className="material-symbols-outlined text-[18px] lg:text-[22px] text-primary">storefront</span>
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="px-6 py-10 lg:p-20 space-y-12 lg:w-1/2 lg:bg-background/40">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 lg:gap-8 border-b border-white/10 pb-8">
            <div className="bg-surface-card p-4 rounded-2xl border border-white/5">
               <div className="flex items-center gap-2 mb-2 text-primary">
                  <span className="material-symbols-outlined">verified_user</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Validity</span>
               </div>
               <p className="text-lg font-bold font-mono">5 Years</p>
               <p className="text-xs text-gray-500">From date of purchase</p>
            </div>
            <div className="bg-surface-card p-4 rounded-2xl border border-white/5">
               <div className="flex items-center gap-2 mb-2 text-primary">
                  <span className="material-symbols-outlined">storefront</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Usage</span>
               </div>
               <p className="text-lg font-bold font-mono">Online & Offline</p>
               <p className="text-xs text-gray-500">Dept Store, Mart, Hotel</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif font-bold">Premium Gift</h3>
            <p className="text-gray-400 text-sm lg:text-base leading-relaxed font-light">
              {event.description}
              <br/><br/>
              Delivered instantly via L.TICKET mobile wallet. The recipient can use it immediately without exchanging for a physical card. Balance can be managed directly within the app.
            </p>
          </div>

          {/* Usage Info - Enhanced Grid */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif font-bold">Where to Use</h3>
                <span className="text-xs text-primary font-bold uppercase tracking-wider">24+ Affiliates</span>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {usageLocations.map(place => (
                   <div key={place.name} className="flex items-center gap-4 p-3 rounded-xl bg-surface-card border border-white/5 hover:border-primary/30 transition-all group">
                      <div className="size-12 rounded-full bg-[#2C2C2E] flex items-center justify-center text-gray-300 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                         <span className="material-symbols-outlined text-[20px]">{place.icon}</span>
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white block mb-0.5">{place.name}</span>
                        <span className="text-[10px] text-gray-500 block">{place.desc}</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Balance Check Info */}
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif font-bold">Balance Check</h3>
             </div>
             <div className="bg-surface-card p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-start gap-4">
                   <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                      <span className="material-symbols-outlined">account_balance_wallet</span>
                   </div>
                   <div className="space-y-3">
                      <p className="text-sm text-gray-300 font-medium">Real-time Balance Inquiry</p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                         Remaining balance is automatically updated after each use. You can check it:
                      </p>
                      <ul className="space-y-2">
                         <li className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="size-1.5 rounded-full bg-primary"></span>
                            In App: <span className="text-gray-300">My Wallet &gt; Voucher Card</span>
                         </li>
                         <li className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="size-1.5 rounded-full bg-primary"></span>
                            Linked Service: <span className="text-gray-300">L.POINT App &gt; Gift Cards</span>
                         </li>
                         <li className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="size-1.5 rounded-full bg-primary"></span>
                            Receipt: <span className="text-gray-300">Printed on purchase receipt</span>
                         </li>
                      </ul>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="h-40 hidden lg:block"></div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 lg:p-6 bg-background/90 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] lg:text-xs text-gray-500 uppercase font-bold tracking-[0.2em] font-sans">TOTAL PRICE</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-4xl font-medium font-mono text-white tracking-tighter">{formatKRW(event.price)}</span>
            </div>
          </div>
          <button 
            onClick={() => onNavigate(AppScreen.BOOKING, event)}
            className="flex-1 max-w-xl h-14 lg:h-16 bg-gradient-to-r from-primary to-[#B8962E] text-black text-sm lg:text-base font-bold uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            Purchase Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
