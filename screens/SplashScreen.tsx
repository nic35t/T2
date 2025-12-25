
import React, { useEffect } from 'react';
import { IMAGES } from '../constants';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background-dark font-spline text-white">
      {/* Background Layers */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-white/5 rounded-full blur-[120px] opacity-30 animate-pulse-slow"></div>
        <img 
          alt="Cinematic grain texture" 
          className="absolute inset-0 h-full w-full object-cover mix-blend-overlay opacity-[0.12]" 
          src={IMAGES.texture} 
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent,_rgba(18,18,18,0.4),_#121212)]"></div>
      </div>

      {/* Center Content */}
      <div className="z-10 flex flex-col items-center gap-8 animate-rise">
        <div className="relative flex justify-center items-end h-16 w-16">
          <div 
            className="absolute bottom-0 w-full h-full bg-gradient-to-t from-transparent via-white/5 to-white/20 blur-md" 
            style={{ clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)" }}
          ></div>
          <div className="relative flex flex-col items-center">
            <div className="w-10 h-[2px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.9)] z-20"></div>
            <div className="w-[2px] h-12 bg-gradient-to-t from-transparent via-white/40 to-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
          </div>
        </div>
        <h1 className="text-white font-serif text-[20px] tracking-[0.35em] font-medium uppercase leading-none select-none drop-shadow-lg">
          L.TICKET
        </h1>
      </div>

      {/* Bottom Loader */}
      <div className="absolute bottom-20 z-10 w-full flex justify-center opacity-0 animate-[fadeIn_1s_ease-out_0.8s_forwards]">
        <div className="h-[1px] w-12 bg-white/10 overflow-hidden relative rounded-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent w-full h-full animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};
