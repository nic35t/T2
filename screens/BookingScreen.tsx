
import React, { useState, useEffect } from 'react';
import { AppScreen, EventData, NavigationHandler, TicketData, SeatGrade } from '../types';
import { useAppContext } from '../context/AppContext';

interface BookingScreenProps {
  event: EventData;
  onNavigate: NavigationHandler;
  onBack: () => void;
}

export const BookingScreen: React.FC<BookingScreenProps> = ({ event, onNavigate, onBack }) => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const { addTicket, addPoints, bookedSeats, bookSeat, addNotification, userPoints, usePoints, userBalance, useBalance } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [takenSeats, setTakenSeats] = useState<Set<string>>(new Set());

  // Gift State
  const [isGift, setIsGift] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [recipientName, setRecipientName] = useState(''); // Store recipient name
  const [recipientPhone, setRecipientPhone] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Asset Logic
  const [pointsToUse, setPointsToUse] = useState<number>(0);
  const [cashToUse, setCashToUse] = useState<number>(0);

  // Load taken seats from context for this specific event
  useEffect(() => {
    if (bookedSeats[event.id]) {
      setTakenSeats(new Set(bookedSeats[event.id]));
    }
  }, [bookedSeats, event.id]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

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
    if (takenSeats.has(seatId)) return;
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

  const handleInitialClick = () => {
    if (!selectedSeat) return;
    if (takenSeats.has(selectedSeat)) {
        alert("This seat has just been booked by another user.");
        return;
    }
    
    // Reset assets
    setPointsToUse(0);
    setCashToUse(0);

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

  const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const val = parseInt(e.target.value) || 0;
     const remainingAfterCash = Math.max(0, getFinalPrice() - cashToUse);
     const maxPoints = Math.min(userPoints, remainingAfterCash);
     setPointsToUse(Math.min(Math.max(0, val), maxPoints));
  };

  const handleCashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const val = parseInt(e.target.value) || 0;
     const remainingAfterPoints = Math.max(0, getFinalPrice() - pointsToUse);
     const maxCash = Math.min(userBalance, remainingAfterPoints);
     setCashToUse(Math.min(Math.max(0, val), maxCash));
  };

  const handleUseAllPoints = () => {
     const remainingAfterCash = Math.max(0, getFinalPrice() - cashToUse);
     const maxPoints = Math.min(userPoints, remainingAfterCash);
     setPointsToUse(maxPoints);
  };

  const handleUseAllCash = () => {
     const remainingAfterPoints = Math.max(0, getFinalPrice() - pointsToUse);
     const maxCash = Math.min(userBalance, remainingAfterPoints);
     setCashToUse(maxCash);
  };

  const handleConfirmBooking = () => {
    if (!selectedSeat) return;

    setIsProcessing(true);

    const finalPrice = getFinalPrice();
    const originalPrice = getOriginalPrice();
    const actualPaid = finalPrice - pointsToUse - cashToUse;
    const savedAmount = (originalPrice - finalPrice) + pointsToUse; // Total saved (discount + points)
    const pointsEarned = actualPaid * 0.1; // 10% Accumulation on actual paid amount

    const row = selectedSeat.charAt(0);
    const grade = getSeatInfo(row).grade;

    // Simulate API Call
    setTimeout(() => {
      // 1. Lock the seat in the "Backend" (Context)
      const success = bookSeat(event.id, selectedSeat);
      
      if (!success) {
          setIsProcessing(false);
          alert("Booking failed. Please try again.");
          return;
      }

      // 2. Use points/cash if any
      if (pointsToUse > 0) usePoints(pointsToUse);
      if (cashToUse > 0) useBalance(cashToUse);

      // 3. Create the ticket object (for both self and gift)
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
        status: 'upcoming', // Gift is technically 'upcoming' until used, but we filter by isGift
        type: `${grade} Seat`,
        isGift: isGift,
        recipientName: isGift ? recipientName : undefined
      };

      // 4. Save to wallet (History)
      addTicket(newTicket);

      // 5. Notifications
      if (isGift) {
        addNotification({
            id: `gift-${Date.now()}`,
            title: 'Ticket Gift Sent',
            message: `You sent a ticket for ${event.title} to ${recipientName}.`,
            time: 'Just now',
            read: false,
            type: 'success'
         });
      }

      addPoints(pointsEarned);
      setIsProcessing(false);
      setShowConfirm(false);
      
      // Navigate to Success Screen
      onNavigate(AppScreen.BOOKING_SUCCESS, {
        title: isGift ? 'Ticket Gift Sent' : event.title,
        totalPaid: actualPaid + cashToUse, // Cash used is technically part of the paid amount, but displayed as separate deduction? Usually users see Total Paid as Credit Card charge. Let's assume actualPaid is external.
        totalSaved: savedAmount,
        pointsEarned: pointsEarned,
        isVoucher: false,
        isGift: isGift
      });
    }, 1500);
  };

  const originalPrice = getOriginalPrice();
  const finalPrice = getFinalPrice();
  const points = finalPrice * 0.1;

  return (
    <div className="relative h-screen bg-gray-50 dark:bg-[#0F0F12] text-gray-900 dark:text-white flex flex-col animate-fade-in font-sans transition-colors duration-300">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full font-bold shadow-2xl z-[100] animate-fade-in-up border border-gray-200">
           {toastMessage}
        </div>
      )}

      <header className="flex items-center justify-between px-4 h-auto min-h-[64px] pt-[env(safe-area-inset-top,16px)] pb-2 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0F0F12] z-20">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <button onClick={onBack} className="text-gray-900 dark:text-white hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span className="font-serif font-bold text-lg">Select Seat</span>
          <button className="text-gray-300 dark:text-white/40 cursor-not-allowed">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto relative no-scrollbar">
        <div className="max-w-4xl mx-auto w-full">
          {/* Stage */}
          <div className="sticky top-0 z-10 w-full pt-12 pb-16 bg-gradient-to-b from-gray-50 via-gray-50 to-transparent dark:from-[#0F0F12] dark:via-[#0F0F12] dark:to-transparent flex flex-col items-center pointer-events-none transition-colors duration-300">
            <div className="w-[80%] md:w-[60%] h-12 border-t-4 border-lotte-red/50 rounded-t-[100%] shadow-[0_-15px_40px_rgba(218,41,28,0.2)] mb-4 relative">
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-bold text-lotte-red uppercase tracking-[0.4em]">STAGE</div>
            </div>
          </div>

          {/* Seats */}
          <div className="w-full overflow-x-auto no-scrollbar pb-8 flex justify-center">
            <div className="flex flex-col gap-6 md:gap-10 items-center min-w-max px-8">
              {rows.map((row) => {
                 const seatInfo = getSeatInfo(row);
                 return (
                    <div key={row} className="flex gap-3 md:gap-6 justify-center items-center relative">
                      <div className="absolute -left-8 text-xs font-bold text-gray-400 dark:text-gray-600 font-mono w-4 text-center">{row}</div>
                      {cols.map((col) => {
                        const seatId = `${row}${col}`;
                        const isTaken = takenSeats.has(seatId);
                        const isSelected = selectedSeat === seatId;
                        
                        return (
                          <button
                            key={seatId}
                            disabled={isTaken}
                            onClick={() => handleSeatClick(seatId)}
                            className={`
                              relative size-9 md:size-11 lg:size-14 rounded-full flex items-center justify-center text-[10px] md:text-xs lg:text-sm font-bold transition-all duration-300 ease-out font-mono group
                              ${isTaken 
                                ? 'bg-gray-200 dark:bg-white/5 text-transparent cursor-not-allowed border border-gray-200 dark:border-white/5 relative opacity-30' 
                                : isSelected 
                                  ? `${seatInfo.color} text-black shadow-lg scale-125 z-10 border-2 border-white ring-4 ring-primary/20` 
                                  : `bg-transparent border ${seatInfo.grade === 'R' ? 'border-gray-400 dark:border-white' : seatInfo.borderColor} text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white hover:scale-110 opacity-70 hover:opacity-100`
                              }
                            `}
                          >
                            {isSelected && (
                               <span className="absolute inset-0 rounded-full bg-white/40 animate-pulse"></span>
                            )}
                            {isTaken && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-sm text-gray-400 dark:text-gray-500">close</span>
                                </span>
                            )}
                            <span className="relative z-10">
                              {isTaken ? '' : isSelected ? '✓' : ''}
                            </span>
                          </button>
                        );
                      })}
                      <div className="absolute -right-8 text-xs font-bold text-gray-400 dark:text-gray-600 font-mono w-4 text-center">{row}</div>
                    </div>
                 );
              })}
            </div>
          </div>

          {/* --- Selection Details Card --- */}
          {selectedSeat && (
            <div className="px-6 md:px-8 animate-fade-in-up pb-32">
              <div className="bg-white dark:bg-surface-card border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl max-w-md mx-auto transition-colors overflow-hidden relative">
                 {/* Decorative Top Border */}
                 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                {(() => { // IIFE to calculate seatInfo once
                  const seatInfo = getSeatInfo(selectedSeat.charAt(0));
                  const gradeTextColor = seatInfo.grade === 'VIP' ? 'text-primary' : seatInfo.grade === 'R' ? 'text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400';
                  
                  return (
                    <>
                      {/* Header */}
                      <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-surface-card">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">Seat Selection</h3>
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${seatInfo.color} bg-opacity-10 ${gradeTextColor} border ${seatInfo.borderColor} border-opacity-30`}>
                            {seatInfo.grade} Class
                          </span>
                        </div>
                        <div className="flex items-baseline gap-3">
                           <span className="text-4xl font-mono font-bold text-gray-900 dark:text-white tracking-tighter">{selectedSeat}</span>
                           <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Row {selectedSeat.charAt(0)}</span>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="p-6 bg-gray-50 dark:bg-black/20 space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 dark:text-gray-400 font-medium">Original Price</span>
                          <span className="font-mono text-gray-400 dark:text-gray-500 line-through decoration-gray-400/50 decoration-1">{formatKRW(originalPrice)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base text-lotte-red">loyalty</span>
                            Membership Benefit
                          </span>
                          <span className="font-mono text-lotte-red font-bold">-{formatKRW(originalPrice - finalPrice)}</span>
                        </div>

                        <div className="h-px bg-gray-200 dark:bg-white/10 my-2"></div>

                        <div className="flex justify-between items-center">
                          <span className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-tight">Final Payment</span>
                          <span className="font-mono font-bold text-2xl text-gray-900 dark:text-white tracking-tight">{formatKRW(finalPrice)}</span>
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="px-6 py-4 bg-gradient-to-r from-[#F3E5AB]/20 to-primary/10 dark:from-primary/5 dark:to-primary/10 border-t border-primary/10 flex justify-between items-center">
                         <div className="flex items-center gap-2 text-primary-dim dark:text-primary">
                            <span className="material-symbols-outlined text-xl">stars</span>
                            <span className="text-xs font-bold uppercase tracking-wider">L-Point Accumulation</span>
                         </div>
                         <span className="font-mono font-bold text-lg text-primary-dim dark:text-primary">+{points.toLocaleString()} P</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Benefits Bar (Visual Aid for savings) - Hidden when Gift is active to save space/confusion or keep it */}
      {selectedSeat && !isGift && (
        <div className="absolute bottom-[calc(9.5rem+env(safe-area-inset-bottom))] w-full px-6 z-30 animate-fade-in-up md:hidden">
           <div className="max-w-4xl mx-auto bg-gradient-to-r from-white to-gray-50 dark:from-surface-card dark:to-surface-card/80 border-l-4 border-lotte-red p-3 rounded-r-xl backdrop-blur-md shadow-lg">
              <div className="flex justify-between items-center">
                 <span className="text-lotte-red font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">loyalty</span>
                    Benefit Applied
                 </span>
                 <span className="text-gray-900 dark:text-white font-bold text-sm">
                    Total Value: {formatKRW((originalPrice - finalPrice) + points)}
                 </span>
              </div>
           </div>
        </div>
      )}

      {/* Checkout Bar */}
      <div className="bg-white dark:bg-[#1E1E24] border-t border-gray-200 dark:border-white/10 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] safe-area-bottom z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex justify-between md:flex-col items-center md:items-start flex-1">
            <div className="flex flex-col">
              <p className="text-gray-900 dark:text-white font-serif font-bold text-xl lg:text-2xl">{event.title}</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs font-bold mt-0.5 uppercase tracking-widest font-mono">
                {selectedSeat ? (
                   <>Row {selectedSeat.charAt(0)} · Seat {selectedSeat.charAt(1)} <span className="text-gray-800 dark:text-white ml-2 opacity-50">({getSeatInfo(selectedSeat.charAt(0)).grade})</span></>
                ) : 'Select your position'}
              </p>
            </div>
            
            <div className="text-right md:mt-2">
                {selectedSeat ? (
                   <div className="flex flex-col items-end">
                      <p className="text-xs text-gray-400 dark:text-gray-500 line-through decoration-black/30 dark:decoration-white/30">{formatKRW(originalPrice)}</p>
                      <div className="flex items-baseline gap-2">
                         <span className="text-xs font-bold text-white bg-lotte-red px-1 rounded">20% OFF</span>
                         <p className="text-3xl lg:text-4xl font-medium font-mono tracking-tighter text-gray-900 dark:text-white">{formatKRW(finalPrice)}</p>
                      </div>
                   </div>
                ) : (
                   <p className="text-3xl lg:text-4xl font-medium font-mono tracking-tighter text-gray-200 dark:text-white/20">₩0</p>
                )}
            </div>
          </div>
          
          <div className="w-full md:max-w-xs flex flex-col gap-3">
             {/* Gift Toggle */}
             {selectedSeat && (
                <div 
                   onClick={() => setIsGift(!isGift)}
                   className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${isGift ? 'bg-red-50 dark:bg-red-900/10 border-lotte-red' : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/5'}`}
                >
                   <div className="flex items-center gap-2">
                      <div className={`size-8 rounded-full flex items-center justify-center transition-colors ${isGift ? 'bg-lotte-red text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-400'}`}>
                         <span className="material-symbols-outlined text-[18px]">redeem</span>
                      </div>
                      <span className={`text-xs font-bold ${isGift ? 'text-lotte-red' : 'text-gray-500 dark:text-gray-400'}`}>Gift to Friend</span>
                   </div>
                   <div className={`w-10 h-6 rounded-full relative transition-colors ${isGift ? 'bg-lotte-red' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <div className={`absolute top-1 size-4 rounded-full bg-white transition-transform shadow-sm ${isGift ? 'left-5' : 'left-1'}`}></div>
                   </div>
                </div>
             )}

             <button 
               disabled={!selectedSeat || isProcessing}
               onClick={handleInitialClick}
               className={`
                 w-full h-14 rounded-2xl font-bold text-sm uppercase tracking-[0.2em] shadow-lg transition-all flex items-center justify-center gap-2
                 ${selectedSeat && !isProcessing
                   ? 'bg-lotte-red text-white hover:bg-red-700 hover:shadow-[0_0_20px_rgba(218,41,28,0.4)]' 
                   : 'bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-white/30 cursor-not-allowed border border-gray-200 dark:border-white/5'}
               `}
             >
               {isProcessing ? (
                 <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
               ) : (
                 isGift ? 'Send Gift' : 'Confirm Booking'
               )}
             </button>
          </div>
        </div>
      </div>

      {/* Gift Input Modal */}
      {showGiftModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setShowGiftModal(false)}></div>
            <div className="relative w-full max-w-sm bg-white dark:bg-surface-card rounded-3xl border border-gray-200 dark:border-white/10 p-6 shadow-2xl animate-fade-in-up">
               <div className="flex items-center gap-3 mb-4">
                 <div className="size-10 rounded-full bg-lotte-red/10 flex items-center justify-center text-lotte-red">
                   <span className="material-symbols-outlined">redeem</span>
                 </div>
                 <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white">Gift Ticket</h3>
               </div>
               <p className="text-xs text-gray-500 mb-6">Enter the recipient's details to send the ticket.</p>
               <form onSubmit={handleGiftSubmit} className="space-y-4">
                  <div>
                     <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Recipient Name</label>
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
                     <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Mobile Number</label>
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
                     <button type="submit" className="w-full h-12 bg-lotte-red text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition-colors">Confirm Recipient</button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* Final Confirmation Modal */}
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
               <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 text-center">Confirm {isGift ? 'gift' : 'booking'} of {formatKRW(finalPrice - pointsToUse - cashToUse)}.</p>
               
               <div className="w-full bg-gray-100 dark:bg-black/30 rounded-xl p-4 mb-6 border border-gray-200 dark:border-white/5">
                  <div className="flex justify-between text-sm mb-1">
                     <span className="text-gray-500">Seat</span>
                     <span className="text-gray-900 dark:text-white font-bold">{selectedSeat} ({getSeatInfo(selectedSeat!.charAt(0)).grade})</span>
                  </div>
                  {isGift && (
                     <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Recipient</span>
                        <span className="text-gray-900 dark:text-white font-bold">{recipientName}</span>
                     </div>
                  )}

                  {/* Asset Input Section */}
                  <div className="my-3 py-3 border-y border-gray-200 dark:border-white/5 space-y-3">
                     
                     {/* L-Ticket Cash */}
                     <div>
                        <div className="flex justify-between text-sm mb-1">
                           <span className="text-gray-500 font-bold">L-Ticket Cash</span>
                           <span className="text-gray-500 text-xs">Held: {formatKRW(userBalance)}</span>
                        </div>
                        <div className="flex gap-2">
                           <input 
                              type="number" 
                              value={cashToUse > 0 ? cashToUse : ''}
                              onChange={handleCashChange}
                              placeholder="0"
                              className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded px-3 py-1.5 text-right text-sm font-mono focus:outline-none focus:border-primary text-gray-900 dark:text-white"
                           />
                           <button 
                              onClick={handleUseAllCash}
                              className="px-3 py-1 bg-gray-200 dark:bg-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                           >
                              MAX
                           </button>
                        </div>
                     </div>

                     {/* L-Point */}
                     <div>
                        <div className="flex justify-between text-sm mb-1">
                           <span className="text-gray-500 font-bold">L-Point</span>
                           <span className="text-gray-500 text-xs">Held: {userPoints.toLocaleString()} P</span>
                        </div>
                        <div className="flex gap-2">
                           <input 
                              type="number" 
                              value={pointsToUse > 0 ? pointsToUse : ''}
                              onChange={handlePointChange}
                              placeholder="0"
                              className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded px-3 py-1.5 text-right text-sm font-mono focus:outline-none focus:border-primary text-gray-900 dark:text-white"
                           />
                           <button 
                              onClick={handleUseAllPoints}
                              className="px-3 py-1 bg-gray-200 dark:bg-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                           >
                              MAX
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-between text-sm">
                     <span className="text-gray-500">Total Payment</span>
                     <span className="text-lotte-red font-bold text-lg">{formatKRW(finalPrice - pointsToUse - cashToUse)}</span>
                  </div>
               </div>

               <button 
                  onClick={handleConfirmBooking}
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
