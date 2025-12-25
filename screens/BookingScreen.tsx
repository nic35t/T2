
import React, { useState } from 'react';
import { AppScreen, EventData, NavigationHandler, TicketData, SeatGrade } from '../types';
import { useAppContext } from '../context/AppContext';

interface BookingScreenProps {
  event: EventData;
  onNavigate: NavigationHandler;
  onBack: () => void;
}

export const BookingScreen: React.FC<BookingScreenProps> = ({ event, onNavigate, onBack }) => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const { addTicket, addPoints } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatKRW = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  const rows = ['A', 'B', 'C', 'D', 'E', 'F'];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  // Logic to determine Seat Grade based on Row
  const getSeatInfo = (row: string): SeatGrade => {
     if (['A', 'B'].includes(row)) {
        return { grade: 'VIP', priceModifier: 30000, color: 'bg-[#D4AF37]', borderColor: 'border-[#D4AF37]' };
     } else if (['C', 'D'].includes(row)) {
        return { grade: 'R', priceModifier: 0, color: 'bg-white', borderColor: 'border-white' };
     } else {
        return { grade: 'S', priceModifier: -30000, color: 'bg-gray-500', borderColor: 'border-gray-500' };
     }
  };

  const handleSeatClick = (seatId: string) => {
    setSelectedSeat(prev => prev === seatId ? null : seatId);
  };

  const getOriginalPrice = () => {
    if (!selectedSeat) return 0;
    const row = selectedSeat.charAt(0);
    const info = getSeatInfo(row);
    // Base logic: Event price + modifier
    // Mocking an "Original" price higher than displayed for the "Discount" logic
    return (event.price + info.priceModifier) * 1.25; 
  };

  const getFinalPrice = () => {
    if (!selectedSeat) return 0;
    const row = selectedSeat.charAt(0);
    const info = getSeatInfo(row);
    return event.price + info.priceModifier;
  };

  const handleConfirmBooking = () => {
    if (!selectedSeat) return;

    setIsProcessing(true);

    const finalPrice = getFinalPrice();
    const originalPrice = getOriginalPrice();
    const savedAmount = originalPrice - finalPrice;
    const pointsEarned = finalPrice * 0.1; // 10% Accumulation

    const row = selectedSeat.charAt(0);
    const grade = getSeatInfo(row).grade;

    // Simulate API Call
    setTimeout(() => {
      const newTicket: TicketData = {
        id: `t-${Date.now()}`,
        eventId: event.id,
        category: 'performance',
        title: event.title,
        location: event.location,
        date: event.date === 'Tonight' ? '2023. 10. 25' : event.date,
        fullDate: event.date === 'Tonight' ? '2023. 10. 25 (Wed)' : `2023. ${event.date} (Sat)`,
        time: event.time || '19:30',
        seats: `Row ${row} · Seat ${selectedSeat.charAt(1)}`,
        image: event.image,
        status: 'upcoming',
        type: `${grade} Seat`
      };

      addTicket(newTicket);
      addPoints(pointsEarned);
      setIsProcessing(false);
      
      // Navigate to Success Screen instead of Tickets
      onNavigate(AppScreen.BOOKING_SUCCESS, {
        title: event.title,
        totalPaid: finalPrice,
        totalSaved: savedAmount,
        pointsEarned: pointsEarned,
        isVoucher: false
      });
    }, 1500);
  };

  const originalPrice = getOriginalPrice();
  const finalPrice = getFinalPrice();
  const points = finalPrice * 0.1;

  return (
    <div className="relative h-screen bg-[#0F0F12] text-white flex flex-col animate-fade-in font-sans">
      <header className="flex items-center justify-between px-4 h-auto min-h-[64px] pt-[env(safe-area-inset-top,16px)] pb-2 border-b border-white/5 bg-[#0F0F12] z-20">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <button onClick={onBack} className="text-white hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span className="font-serif font-bold text-lg">Select Seat</span>
          <button className="text-white/40 cursor-not-allowed">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto relative no-scrollbar">
        <div className="max-w-4xl mx-auto w-full">
          {/* Stage */}
          <div className="sticky top-0 z-10 w-full pt-12 pb-16 bg-gradient-to-b from-[#0F0F12] via-[#0F0F12] to-transparent flex flex-col items-center pointer-events-none">
            <div className="w-[80%] md:w-[60%] h-12 border-t-4 border-lotte-red/50 rounded-t-[100%] shadow-[0_-15px_40px_rgba(218,41,28,0.2)] mb-4 relative">
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-bold text-lotte-red uppercase tracking-[0.4em]">STAGE</div>
            </div>
          </div>

          {/* Seats */}
          <div className="w-full overflow-x-auto no-scrollbar pb-40 flex justify-center">
            <div className="flex flex-col gap-6 md:gap-10 items-center min-w-max px-8">
              {rows.map((row) => {
                 const seatInfo = getSeatInfo(row);
                 return (
                    <div key={row} className="flex gap-3 md:gap-6 justify-center items-center relative">
                      <div className="absolute -left-8 text-xs font-bold text-gray-600 font-mono w-4 text-center">{row}</div>
                      {cols.map((col) => {
                        const seatId = `${row}${col}`;
                        const isTaken = (row === 'B' && col === 4) || (row === 'C' && col === 5) || (row === 'D' && col === 2);
                        const isSelected = selectedSeat === seatId;
                        
                        return (
                          <button
                            key={seatId}
                            disabled={isTaken}
                            onClick={() => handleSeatClick(seatId)}
                            className={`
                              relative size-9 md:size-11 lg:size-14 rounded-full flex items-center justify-center text-[10px] md:text-xs lg:text-sm font-bold transition-all duration-300 ease-out font-mono group
                              ${isTaken 
                                ? 'bg-white/5 text-transparent cursor-not-allowed border border-white/5' 
                                : isSelected 
                                  ? `${seatInfo.color} text-black shadow-[0_0_25px_rgba(255,255,255,0.4)] scale-125 z-10 border-2 border-white ring-4 ring-primary/20` 
                                  : `bg-transparent border ${seatInfo.borderColor} text-gray-400 hover:bg-white/10 hover:text-white hover:scale-110 opacity-70 hover:opacity-100`
                              }
                            `}
                          >
                            {isSelected && (
                               <span className="absolute inset-0 rounded-full bg-white/40 animate-pulse"></span>
                            )}
                            <span className="relative z-10">
                              {isTaken ? 'X' : isSelected ? '✓' : ''}
                            </span>
                          </button>
                        );
                      })}
                      <div className="absolute -right-8 text-xs font-bold text-gray-600 font-mono w-4 text-center">{row}</div>
                    </div>
                 );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Bar (Visual Aid for savings) */}
      {selectedSeat && (
        <div className="absolute bottom-[calc(9.5rem+env(safe-area-inset-bottom))] w-full px-6 z-30 animate-fade-in-up">
           <div className="max-w-4xl mx-auto bg-gradient-to-r from-surface-card to-surface-card/80 border-l-4 border-lotte-red p-3 rounded-r-xl backdrop-blur-md shadow-lg">
              <div className="flex justify-between items-center">
                 <span className="text-lotte-red font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">loyalty</span>
                    Dual Benefit Applied
                 </span>
                 <span className="text-white font-bold text-sm">
                    Total Value: {formatKRW((originalPrice - finalPrice) + points)}
                 </span>
              </div>
           </div>
        </div>
      )}

      {/* Checkout Bar */}
      <div className="bg-[#1E1E24] border-t border-white/10 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] safe-area-bottom z-30">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex justify-between md:flex-col items-center md:items-start flex-1">
            <div className="flex flex-col">
              <p className="text-white font-serif font-bold text-xl lg:text-2xl">{event.title}</p>
              <p className="text-gray-400 text-xs font-bold mt-0.5 uppercase tracking-widest font-mono">
                {selectedSeat ? (
                   <>Row {selectedSeat.charAt(0)} · Seat {selectedSeat.charAt(1)} <span className="text-white ml-2 opacity-50">({getSeatInfo(selectedSeat.charAt(0)).grade})</span></>
                ) : 'Select your position'}
              </p>
            </div>
            
            <div className="text-right md:mt-2">
                {selectedSeat ? (
                   <div className="flex flex-col items-end">
                      <p className="text-xs text-gray-500 line-through decoration-white/30">{formatKRW(originalPrice)}</p>
                      <div className="flex items-baseline gap-2">
                         <span className="text-xs font-bold text-white bg-lotte-red px-1 rounded">20% OFF</span>
                         <p className="text-3xl lg:text-4xl font-medium font-mono tracking-tighter text-white">{formatKRW(finalPrice)}</p>
                      </div>
                      <p className="text-[11px] text-primary font-bold mt-1 flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                         <span className="material-symbols-outlined text-[12px]">monetization_on</span>
                         Earn {formatKRW(points)} L-Point (10%)
                      </p>
                   </div>
                ) : (
                   <p className="text-3xl lg:text-4xl font-medium font-mono tracking-tighter text-white/20">₩0</p>
                )}
            </div>
          </div>
          <button 
            disabled={!selectedSeat || isProcessing}
            onClick={handleConfirmBooking}
            className={`
              w-full md:max-w-xs h-16 rounded-2xl font-bold text-sm uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-2
              ${selectedSeat && !isProcessing
                ? 'bg-lotte-red text-white hover:bg-red-700 hover:shadow-[0_0_20px_rgba(218,41,28,0.4)]' 
                : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'}
            `}
          >
            {isProcessing ? (
              <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
