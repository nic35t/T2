
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
      <h3 className="text-xl font-serif font-bold text-white mb-4 pr-6 flex justify-between items-end">
        {title}
        <span className="text-xs font-sans font-bold text-primary uppercase tracking-widest cursor-pointer">View All</span>
      </h3>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pr-6 pb-4">
        {events.map((evt) => (
          <div 
            key={evt.id} 
            onClick={() => onNavigate?.(AppScreen.EVENT_DETAILS, evt)}
            className="min-w-[160px] w-[160px] group cursor-pointer"
          >
            <div className="h-[220px] rounded-xl overflow-hidden mb-3 relative border border-white/5 shadow-lg group-hover:border-primary/50 transition-colors">
               <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${evt.image}')` }}></div>
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
               <span className="absolute bottom-3 left-3 text-[10px] font-bold text-white bg-black/50 backdrop-blur-md px-2 py-1 rounded border border-white/10">
                  {evt.category === 'voucher' ? 'Premium' : evt.tags[0]}
               </span>
            </div>
            <h4 className="text-sm font-bold text-white leading-tight mb-1 truncate">{evt.title}</h4>
            <p className="text-xs text-gray-500">{evt.location}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative w-full min-h-screen flex flex-col bg-[#0F0F12] overflow-x-hidden pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-auto min-h-[96px] items-center justify-between px-6 pt-[env(safe-area-inset-top,24px)] bg-gradient-to-b from-black/90 to-transparent pointer-events-none pb-4 transition-all">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between pointer-events-auto">
          <button className="flex size-10 items-center justify-start text-white hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
          <div className="flex items-center justify-center">
            <span className="text-xl font-serif font-bold tracking-[0.15em] text-white drop-shadow-lg">L.TICKET</span>
          </div>
          <button 
             onClick={() => onNavigate?.(AppScreen.SEARCH)}
             className="size-10 flex items-center justify-end text-white hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">search</span>
          </button>
        </div>
      </header>

      {/* Hero Carousel */}
      <section 
        className="relative w-full h-[75vh] overflow-hidden"
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
                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0F0F12_100%)] opacity-80"></div>
             </div>
             <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F12] via-[#0F0F12]/40 to-transparent"></div>
          </div>
        ))}

        {/* Hero Content */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end pb-20 px-6 max-w-7xl mx-auto">
           <div key={activeIndex} className="animate-fade-in-up">
              <div className="flex items-center gap-2 mb-4">
                <span className={`inline-block size-1.5 rounded-full ${isVoucher ? 'bg-primary' : 'bg-red-600 animate-pulse'}`}></span>
                <span className="text-white/80 font-bold tracking-[0.2em] uppercase text-[10px]">
                  {isVoucher ? "OFFICIAL PARTNER" : "LIVE PREMIERE"}
                </span>
              </div>
              
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
                className="relative h-14 px-8 rounded-full overflow-hidden flex items-center justify-center border border-white/20 bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 active:scale-[0.98] group"
              >
                <span className="font-bold text-sm tracking-[0.15em] uppercase text-white group-hover:text-primary transition-colors">
                  {isVoucher ? "Buy Gift" : "Reserve Seats"}
                </span>
                <span className="material-symbols-outlined ml-2 text-white/50 group-hover:text-primary transition-colors">arrow_forward</span>
              </button>
           </div>
           
           {/* Pagination */}
           <div className="flex gap-2 mt-8">
              {EVENTS.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all duration-500 ${idx === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`}
                />
              ))}
           </div>
        </div>
      </section>

      {/* Curated Sections */}
      <div className="relative z-30 -mt-10 bg-gradient-to-b from-transparent to-[#0F0F12]">
         <Section title="Date Course (Gangnam)" events={EVENTS.filter(e => e.category === 'performance')} />
         <Section title="Premium Gifts" events={EVENTS.filter(e => e.category === 'voucher')} />
         <Section title="Critics' Choice" events={[EVENTS[0], EVENTS[3], EVENTS[4]].filter(Boolean)} />
         
         <div className="px-6 py-8 flex justify-center">
            <p className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">L.TICKET Collection 2023</p>
         </div>
      </div>
    </div>
  );
};
