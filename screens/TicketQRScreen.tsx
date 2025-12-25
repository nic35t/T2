
import React, { useState, useRef } from 'react';
import { AppScreen, NavigationHandler, TicketData } from '../types';
import { IMAGES } from '../constants';

interface TicketQRScreenProps {
  ticket?: TicketData;
  onNavigate: NavigationHandler;
  onBack: () => void;
}

export const TicketQRScreen: React.FC<TicketQRScreenProps> = ({ ticket, onNavigate, onBack }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (max 15 degrees)
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;
    
    setRotation({ x: rotateX, y: rotateY });
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
     setRotation({ x: 0, y: 0 });
     setGlare({ x: 50, y: 50 });
  };

  const displayTitle = ticket?.title || 'Unknown Event';
  const displayDate = ticket?.date || 'Date N/A';
  const displayTime = ticket?.time || '';
  const displayId = ticket?.id?.toUpperCase() || 'NO-ID';

  return (
    <div className="relative h-screen w-full bg-[#0F0F12] flex flex-col animate-fade-in z-50 overflow-hidden perspective-1000">
      
      {/* Background Texture */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      {/* Close Button */}
      <button 
        onClick={onBack}
        className="absolute top-[env(safe-area-inset-top,24px)] right-6 size-10 rounded-full bg-[#1E1E24] text-white flex items-center justify-center z-20 border border-white/10 hover:border-primary/50 transition-colors mt-4"
      >
        <span className="material-symbols-outlined">close</span>
      </button>

      {/* Main Content */}
      <div 
        className="flex-1 flex flex-col items-center justify-center p-6 relative z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
         {/* 3D Container */}
         <div 
            ref={cardRef}
            className="w-full max-w-sm transition-transform duration-100 ease-out"
            style={{
               transformStyle: 'preserve-3d',
               transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
            }}
         >
            {/* The Ticket Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl relative">
               
               {/* Holographic Overlay */}
               <div 
                  className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay opacity-40"
                  style={{
                     background: `linear-gradient(${115 + rotation.x * 2}deg, transparent 20%, rgba(255, 255, 255, 0.6) 40%, rgba(212, 175, 55, 0.6) 60%, transparent 80%)`,
                     backgroundPosition: `${glare.x}% ${glare.y}%`,
                     backgroundSize: '200% 200%'
                  }}
               ></div>
               
               {/* Reflective Shine */}
                <div 
                  className="absolute inset-0 z-30 pointer-events-none opacity-20"
                  style={{
                     background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.8), transparent 60%)`
                  }}
                ></div>

               {/* Top Section */}
               <div className="p-8 pb-6 bg-[#1E1E24] flex flex-col items-center border-b-2 border-dashed border-gray-700 relative text-white">
                  {/* Punch Holes */}
                  <div className="absolute -left-4 bottom-[-10px] size-8 rounded-full bg-[#0F0F12]"></div>
                  <div className="absolute -right-4 bottom-[-10px] size-8 rounded-full bg-[#0F0F12]"></div>

                  <h2 className="font-serif text-2xl font-bold text-center mb-1 text-white">{displayTitle}</h2>
                  <p className="text-gray-400 text-sm font-medium mb-6">{displayDate} • {displayTime}</p>
                  
                  <div className="size-56 bg-white p-2 rounded-xl mb-4 relative overflow-hidden">
                     <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=LTICKET_SECURE')] bg-contain bg-no-repeat bg-center rendering-pixelated"></div>
                     {/* Scanner Line */}
                     <div className="absolute top-0 left-0 w-full h-1 bg-lotte-red/50 shadow-[0_0_15px_rgba(255,0,0,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                  </div>
                  
                  <p className="text-[10px] text-primary/80 font-mono tracking-[0.3em] mt-1 uppercase">Secure Digital Asset</p>
               </div>

               {/* Bottom Info */}
               <div className="bg-primary p-6 flex justify-between items-center text-black relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:10px_10px]"></div>
                  <div className="text-center flex-1 z-10">
                     <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">GATE</p>
                     <p className="text-xl font-bold font-display">3</p>
                  </div>
                  <div className="text-center flex-1 border-x border-black/10 z-10">
                     <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">ROW</p>
                     <p className="text-xl font-bold font-display">
                        {ticket?.seats?.includes('Row') ? ticket.seats.split('Row ')[1]?.charAt(0) : '-'}
                     </p>
                  </div>
                  <div className="text-center flex-1 z-10">
                     <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">SEAT</p>
                     <p className="text-xl font-bold font-display">
                        {ticket?.seats?.includes('Seat') ? ticket.seats.split('Seat ')[1] : 'Any'}
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Trust Indicator */}
         <div className="mt-12 flex items-center gap-2 text-white/30 animate-pulse">
            <span className="material-symbols-outlined text-lg">fingerprint</span>
            <span className="text-xs font-bold uppercase tracking-widest">L.TICKET Authenticated</span>
         </div>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 5%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          95% { top: 95%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
