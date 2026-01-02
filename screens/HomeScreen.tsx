
import React, { useState, useEffect, useRef } from 'react';
import { IMAGES, EVENTS } from '../constants';
import { AppScreen, NavigationHandler, EventData } from '../types';

interface HomeScreenProps {
  onNavigate?: NavigationHandler;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(252);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Auto-rotate events
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % EVENTS.length);
    }, 8000); 
    return () => clearInterval(interval);
  }, [activeIndex]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 252));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % EVENTS.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + EVENTS.length) % EVENTS.length);

  const handleTouchStart = (e: React.TouchEvent) => touchStartX.current = e.targetTouches[0].clientX;
  const handleTouchMove = (e: React.TouchEvent) => touchEndX.current = e.targetTouches[0].clientX;
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) handleNext();
    if (touchStartX.current - touchEndX.current < -50) handlePrev();
  };

  const currentEvent = EVENTS[activeIndex];
  const isVoucher = currentEvent.category === 'voucher';

  // Section Components
  const Section = ({ title, events }: { title: string, events: EventData[] }) => (
    <div className="mb-10 pl-6">
      <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-4 pr-6 flex justify-between items-end">
        {title}
        <span 
          onClick={() => onNavigate?.(AppScreen.SEARCH)}
          className="text-xs font-sans font-bold text-primary uppercase tracking-widest cursor-pointer hover:opacity-80 transition-opacity"
        >
          View All
        </span>
      </h3>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pr-6 pb-4">
        {events.map((evt) => (
          <div 
            key={evt.id} 
            onClick={() => onNavigate?.(AppScreen.EVENT_DETAILS, evt)}
            className="min-w-[160px] w-[160px] group cursor-pointer"
          >
            <div className="h-[220px] rounded-xl overflow-hidden mb-3 relative border border-gray-200 dark:border-white/5 shadow-md dark:shadow-lg group-hover:border-primary/50 transition-colors bg-gray-100 dark:bg-surface-card">
               <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${evt.image}')` }}></div>
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
               <span className="absolute bottom-3 left-3 text-[10px] font-bold text-white bg-black/50 backdrop-blur-md px-2 py-1 rounded border border-white/10">
                  {evt.category === 'voucher' ? 'Premium' : evt.tags[0]}
               </span>
            </div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-1 truncate">{evt.title}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-500">{evt.location}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Ad Banner Component
  const AdBanner = () => (
    <div className="px-6 mb-10">
      <div className="relative w-full h-28 md:h-32 rounded-2xl overflow-hidden shadow-lg group cursor-pointer border border-gray-200 dark:border-white/5">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${IMAGES.ad_banner}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center px-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-primary/20 text-primary border border-primary/30 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider backdrop-blur-sm">Sponsored</span>
          </div>
          <h3 className="text-white font-serif text-lg font-bold mb-0.5">L.PAY Platinum Card</h3>
          <p className="text-gray-300 text-xs font-light">Get 20% instant discount on VIP seats</p>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/10 group-hover:bg-white/30 transition-colors">
          <span className="material-symbols-outlined text-white text-xl">credit_card</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-gray-50 dark:bg-[#0F0F12] overflow-x-hidden pb-24 transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-auto min-h-[96px] items-center justify-between px-6 pt-[env(safe-area-inset-top,24px)] bg-gradient-to-b from-black/60 to-transparent pointer-events-none pb-4 transition-all">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-auto">
          {/* Menu button removed as per user feedback since it had no function. 
              Added a spacer div to maintain centered layout for the Logo. */}
          <div className="flex size-10"></div>
          
          <div className="flex items-center justify-center">
            <span className="text-xl font-serif font-bold tracking-[0.15em] text-white drop-shadow-md">L.TICKET</span>
          </div>
          <button 
             onClick={() => onNavigate?.(AppScreen.SEARCH)}
             className="size-10 flex items-center justify-end text-white hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-3xl drop-shadow-md">search</span>
          </button>
        </div>
      </header>

      {/* Hero Carousel */}
      <section 
        className="relative w-full h-[75vh] overflow-hidden bg-gray-900"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {EVENTS.map((event, index) => (
          <div 
            key={event.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
             <div 
                className={`absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-[8000ms] ease-linear ${index === activeIndex ? 'scale-110' : 'scale-100'}`}
                style={{ backgroundImage: `url('${event.image}')` }}
             >
                {/* Vignette - Adjusted for Light/Dark Mode transition at bottom */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]"></div>
             </div>
             {/* Gradient to blend with background: Fades to gray-50 in light mode, #0F0F12 in dark mode */}
             <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/20 to-transparent dark:from-[#0F0F12] dark:via-[#0F0F12]/40 dark:to-transparent"></div>
          </div>
        ))}

        {/* Hero Content */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-20 px-6 max-w-7xl mx-auto">
           <div key={activeIndex} className="animate-fade-in-up">
              <div className="flex items-center gap-2 mb-4">
                <span className={`inline-block size-1.5 rounded-full ${isVoucher ? 'bg-primary' : 'bg-red-600 animate-pulse'}`}></span>
                <span className="text-white/90 font-bold tracking-[0.2em] uppercase text-[10px] drop-shadow-sm">
                  {isVoucher ? "OFFICIAL PARTNER" : "LIVE PREMIERE"}
                </span>
              </div>
              
              {/* Text shadow added for better visibility on light images if any, though images are darkened */}
              <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl leading-[0.9] max-w-lg">
                {currentEvent.title}
              </h1>
              
              {/* Countdown Bar */}
              {!isVoucher && (
                 <div className="flex items-center gap-4 mb-8 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 w-fit">
                    <span className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Ticket Closing</span>
                    <span className="text-sm font-mono font-bold text-primary">{formatTime(timeLeft)}</span>
                 </div>
              )}

              <button 
                onClick={() => onNavigate?.(AppScreen.EVENT_DETAILS, currentEvent)}
                className="relative h-14 px-8 rounded-full overflow-hidden flex items-center justify-center border border-white/30 bg-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/20 active:scale-[0.98] group shadow-lg"
              >
                <span className="font-bold text-sm tracking-[0.15em] uppercase text-white group-hover:text-primary transition-colors drop-shadow-sm">
                  {isVoucher ? "Buy Gift" : "Reserve Seats"}
                </span>
                <span className="material-symbols-outlined ml-2 text-white/70 group-hover:text-primary transition-colors">arrow_forward</span>
              </button>
           </div>
           
           {/* Pagination */}
           <div className="flex gap-2 mt-8">
              {EVENTS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-500 shadow-sm ${idx === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-white/40'}`}
                />
              ))}
           </div>
        </div>
      </section>

      {/* Curated Sections */}
      <div className="relative z-30 -mt-10">
         <Section title="Date Course (Gangnam)" events={EVENTS.filter(e => e.category === 'performance')} />
         
         {/* Native Ad Placement: Placed between sections for natural flow */}
         <AdBanner />
         
         <Section title="Premium Gifts" events={EVENTS.filter(e => e.category === 'voucher')} />
         <Section title="Critics' Choice" events={[EVENTS[0], EVENTS[3], EVENTS[4]].filter(Boolean)} />
         
         <div className="px-6 py-8 flex justify-center">
            <p className="text-[10px] text-gray-400 dark:text-gray-600 font-mono tracking-widest uppercase">L.TICKET Collection 2023</p>
         </div>
      </div>
    </div>
  );
};
