
import React, { useState } from 'react';
import { AppScreen, EventData, NavigationHandler, ReviewData } from '../types';
import { useAppContext } from '../context/AppContext';

interface EventDetailsScreenProps {
  event: EventData;
  onNavigate: NavigationHandler;
  onBack: () => void;
}

const MOCK_REVIEWS: ReviewData[] = [
  { id: 'r1', userId: 'user1', userName: 'Sarah K.', rating: 5, date: '2023.10.22', content: 'Absolutely breathtaking! The visuals and performance were top-notch.', likes: 12 },
  { id: 'r2', userId: 'user2', userName: 'Mike R.', rating: 4, date: '2023.10.20', content: 'Great show, but the seating was a bit tight. The music made up for it though.', likes: 4 },
  { id: 'r3', userId: 'user3', userName: 'Emily W.', rating: 5, date: '2023.10.18', content: 'A masterpiece. I would watch it again in a heartbeat.', likes: 8 },
];

export const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({ event, onNavigate, onBack }) => {
  const { likedEvents, toggleLike } = useAppContext();
  const isLiked = likedEvents.has(event.id);
  const [activeTab, setActiveTab] = useState<'info' | 'reviews'>('info');

  const formatKRW = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `L.TICKET - ${event.title}`,
          text: `Check out ${event.title} at ${event.location}!`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      alert(`Link copied to clipboard! (Simulated)\n\nCheck out ${event.title}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-white animate-fade-in font-sans">
      {/* Sticky Header with Safe Area */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-auto min-h-[64px] items-center justify-between px-4 pt-[env(safe-area-inset-top,16px)] pb-2 lg:px-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
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
              favorite
            </span>
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Column: Hero Image (Sticky on Desktop) */}
        <div className="relative h-[60vh] md:h-[50vh] lg:h-screen lg:w-1/2 lg:sticky lg:top-0 shrink-0">
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
              <span className="material-symbols-outlined text-[18px] lg:text-[22px] text-primary">location_on</span>
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="lg:w-1/2 lg:bg-background/40 flex flex-col">
          {/* Tabs */}
          <div className="sticky top-[env(safe-area-inset-top,64px)] z-40 bg-background/95 backdrop-blur-xl border-b border-white/10 flex px-6">
             <button 
               onClick={() => setActiveTab('info')}
               className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest relative transition-colors ${activeTab === 'info' ? 'text-primary' : 'text-gray-500 hover:text-white'}`}
             >
                Info & Cast
                {activeTab === 'info' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-glow"></div>}
             </button>
             <button 
               onClick={() => setActiveTab('reviews')}
               className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest relative transition-colors ${activeTab === 'reviews' ? 'text-primary' : 'text-gray-500 hover:text-white'}`}
             >
                Reviews (24)
                {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-glow"></div>}
             </button>
          </div>

          <div className="px-6 py-10 lg:p-20 space-y-12 flex-1 pb-32">
            
            {activeTab === 'info' ? (
              <div className="animate-fade-in space-y-12">
                {/* Info Grid - Modern Mono Style */}
                <div className="grid grid-cols-3 gap-4 md:gap-8 lg:gap-12 border-b border-white/10 pb-8">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-widest font-bold font-sans">Date</span>
                    <span className="text-sm lg:text-lg font-medium font-mono tracking-tight">{event.date}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-widest font-bold font-sans">Time</span>
                    <span className="text-sm lg:text-lg font-medium font-mono tracking-tight">{event.time}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-widest font-bold font-sans">Runtime</span>
                    <span className="text-sm lg:text-lg font-medium font-mono tracking-tight">160min</span>
                  </div>
                </div>

                {/* Synopsis */}
                <div className="space-y-4 lg:space-y-6">
                  <h3 className="text-xl lg:text-2xl font-serif font-bold">Synopsis</h3>
                  <p className="text-gray-400 text-base lg:text-lg leading-relaxed font-light lg:font-normal">
                    {event.description || "A romance and tragedy that blurs the boundaries of stage performance, a feast of breathtaking visuals. Meet the masterpiece that will offer an unforgettable evening."}
                  </p>
                </div>

                {/* Cast */}
                <div className="space-y-6 lg:space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl lg:text-2xl font-serif font-bold">Cast</h3>
                    <button 
                      onClick={() => onNavigate(AppScreen.CAST_LIST, { event })}
                      className="text-xs lg:text-sm font-bold text-primary uppercase tracking-widest hover:text-white transition-colors"
                    >
                      See All
                    </button>
                  </div>
                  <div className="flex gap-6 lg:gap-10 overflow-x-auto no-scrollbar pb-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex flex-col items-center gap-3 shrink-0 group cursor-pointer">
                        <div className="size-20 lg:size-24 rounded-full bg-white/5 border border-white/10 overflow-hidden group-hover:border-primary transition-all shadow-lg">
                          <img src={`https://i.pravatar.cc/150?u=${event.id}${i}`} alt="Cast" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                        </div>
                        <span className="text-[11px] lg:text-xs text-gray-400 group-hover:text-white font-medium">Artist</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in space-y-6">
                 {/* Reviews Summary */}
                 <div className="flex items-center gap-4 bg-surface-card p-6 rounded-2xl border border-white/5">
                    <div className="text-center">
                       <span className="block text-3xl font-bold font-serif text-white">4.8</span>
                       <span className="text-[10px] text-gray-500 uppercase tracking-wide">Out of 5.0</span>
                    </div>
                    <div className="flex-1 h-12 border-l border-white/10 pl-6 flex flex-col justify-center">
                       <div className="flex text-primary mb-1">
                          {[1,2,3,4,5].map(star => <span key={star} className="material-symbols-outlined text-lg font-filled">star</span>)}
                       </div>
                       <p className="text-xs text-gray-400">Based on 24 verified reviews</p>
                    </div>
                 </div>

                 {/* Review List */}
                 <div className="space-y-4">
                    {MOCK_REVIEWS.map((review) => (
                       <div key={review.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                          <div className="flex justify-between items-start mb-2">
                             <div className="flex items-center gap-2">
                                <div className="size-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">
                                   {review.userName.charAt(0)}
                                </div>
                                <div>
                                   <p className="text-sm font-bold text-white">{review.userName}</p>
                                   <div className="flex items-center gap-1">
                                      <div className="flex text-primary text-[10px]">
                                        {[...Array(review.rating)].map((_, i) => <span key={i} className="material-symbols-outlined font-filled text-[12px]">star</span>)}
                                      </div>
                                      <span className="text-[10px] text-gray-500">• {review.date}</span>
                                   </div>
                                </div>
                             </div>
                             <div className="flex items-center gap-1 text-gray-500 text-xs">
                                <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                                {review.likes}
                             </div>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed pl-10">
                             {review.content}
                          </p>
                       </div>
                    ))}
                 </div>
              </div>
            )}
            
            <div className="h-20 lg:hidden"></div>
          </div>
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:p-6 bg-background/90 backdrop-blur-xl border-t border-white/10 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] lg:text-xs text-gray-500 uppercase font-bold tracking-[0.2em]">TOTAL PRICE</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-4xl font-medium font-mono text-white tracking-tighter">{formatKRW(event.price)}</span>
              <span className="text-xs lg:text-sm text-gray-500 font-sans">/ person (VIP)</span>
            </div>
          </div>
          <button 
            onClick={() => onNavigate(AppScreen.BOOKING, event)}
            className="flex-1 max-w-xl h-14 lg:h-16 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm lg:text-base font-bold uppercase tracking-widest rounded-2xl shadow-glow hover:bg-white/20 active:scale-[0.98] transition-all"
          >
            Select Seat
          </button>
        </div>
      </div>
    </div>
  );
};
