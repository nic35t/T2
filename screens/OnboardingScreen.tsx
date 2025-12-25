
import React, { useState } from 'react';
import { IMAGES } from '../constants';
import { useAppContext } from '../context/AppContext';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const { login } = useAppContext();

  // Step 0: Intro
  // Step 1: Curated Choice
  // Step 2: Login/Landing

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else handleComplete();
  };

  const handleSkip = () => {
    setStep(2); // Jump to login
  };

  const handleComplete = () => {
    login();
    onComplete();
  }

  if (step === 0) {
    return (
      <div className="relative h-screen w-full flex flex-col overflow-hidden bg-background">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            className="h-full w-full object-cover animate-[pulse_10s_ease-in-out_infinite] scale-110" 
            src={IMAGES.onboarding} 
            alt="Stage" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-transparent"></div>
        </div>

        <header className="relative z-20 w-full p-6 pt-[calc(2rem+env(safe-area-inset-top))] flex items-center justify-between animate-fade-in-up">
           <div className="w-16"></div> {/* Spacer for balance */}
           <span className="absolute left-1/2 -translate-x-1/2 text-xl font-serif font-bold tracking-[0.15em] text-white">L.TICKET</span>
          <button onClick={handleSkip} className="text-[#c9b992] text-sm font-bold tracking-wide py-2 px-3 hover:bg-white/10 border border-transparent hover:border-white/10 rounded-full transition-all backdrop-blur-sm">
            Skip
          </button>
        </header>

        <main className="relative z-10 flex-1 flex flex-col justify-end px-6 pb-[calc(3rem+env(safe-area-inset-bottom))] max-w-md mx-auto w-full">
          <div className="mb-6 text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-white text-4xl font-bold leading-[1.2] tracking-tight drop-shadow-xl font-serif">
              Beyond the Stage,<br />
              <span className="text-primary italic">A New Experience</span>
            </h1>
          </div>
          
          <div className="mb-10 text-center animate-fade-in-up px-4" style={{ animationDelay: '0.2s' }}>
            <p className="text-gray-300 text-sm font-light leading-relaxed">
              엄선된 고품격 공연의 세계로 초대합니다. 라이브 무대의 현장감을 그대로 담은 프리미엄 관람 경험을 즐겨보세요.
            </p>
          </div>

          <div className="flex w-full flex-row items-center justify-center gap-3 mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="h-1.5 w-6 rounded-full bg-primary shadow-glow"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-white/20"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-white/20"></div>
          </div>

          <div className="w-full animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <button 
              onClick={handleNext}
              className="group w-full h-14 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 active:scale-[0.98] text-white text-lg font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <span>Continue</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="relative h-screen w-full flex flex-col items-center justify-between py-6 overflow-hidden bg-background">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none z-0"></div>
         
         <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md px-6 z-10 my-4 animate-fade-in-up pt-[env(safe-area-inset-top)]">
            <div className="relative w-full group/card perspective-1000 transform transition-transform hover:scale-[1.02] duration-500">
               <div className="absolute inset-0 -z-10 bg-primary/20 blur-[40px] rounded-full scale-90 opacity-60"></div>
               <div className="relative flex flex-col w-full bg-surface-card rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <div className="relative w-full aspect-[3/4] bg-neutral-800">
                     <div 
                        className="w-full h-full bg-cover bg-center" 
                        style={{ backgroundImage: `url('${IMAGES.swanLake}')` }}
                     ></div>
                     <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-surface-card/20 to-transparent"></div>
                     <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-md border border-primary/30 text-[10px] font-bold text-[#e8dcc0] shadow-lg tracking-wide uppercase">
                           <span className="material-symbols-outlined text-[12px] text-primary">diamond</span>
                           Featured
                        </span>
                     </div>
                     <div className="absolute bottom-0 left-0 w-full p-6 pt-12 flex flex-col items-start justify-end">
                        <h2 className="text-white text-2xl font-bold leading-tight tracking-tight mb-2 drop-shadow-md font-serif">Swan Lake: The Noir Interpretation</h2>
                        <div className="flex items-center gap-3 text-xs font-medium text-[#c9b992] tracking-wide">
                           <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_today</span> Oct 14</span>
                           <span className="w-1 h-1 rounded-full bg-primary"></span>
                           <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">theater_comedy</span> Royal Theater</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="w-full max-w-md px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] z-10 shrink-0 flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-center space-y-3">
               <h1 className="text-white tracking-tight text-2xl font-bold leading-tight font-serif">Curated for Your Taste</h1>
               <p className="text-white/60 text-sm font-normal leading-relaxed px-2">
                  수많은 리스트 대신, 당신의 취향에 맞춘 엄선작만을 제안합니다. 작품의 깊이를 더해줄 몰입형 콘텐츠를 만나보세요.
               </p>
            </div>
            
            <div className="flex flex-row items-center justify-center gap-3">
               <div className="h-1.5 w-1.5 rounded-full bg-white/20"></div>
               <div className="h-1.5 w-6 rounded-full bg-primary shadow-glow transition-all duration-300"></div>
               <div className="h-1.5 w-1.5 rounded-full bg-white/20"></div>
            </div>

            <div className="flex flex-col gap-3 w-full">
               <button 
                  onClick={handleNext}
                  className="relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 active:scale-[0.98] transition-all text-white shadow-lg font-bold"
               >
                  <span className="text-base tracking-wide">Continue</span>
                  <span className="material-symbols-outlined absolute right-5 text-white/80">arrow_forward</span>
               </button>
               <button 
                  onClick={() => setStep(0)}
                  className="flex w-full cursor-pointer items-center justify-center h-12 text-[#c9b992] text-sm font-semibold tracking-wide hover:text-white transition-colors"
               >
                  Back
               </button>
            </div>
         </div>
      </div>
    );
  }

  // Step 2: Login
  return (
    <div className="relative flex h-screen w-full flex-col bg-background group/design-root overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[65%] z-0">
          <div 
             className="w-full h-full bg-center bg-cover bg-no-repeat opacity-80" 
             style={{ backgroundImage: `url('${IMAGES.spotlight}')` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-end h-full w-full max-w-md mx-auto px-6 pb-[calc(3rem+env(safe-area-inset-bottom))] pt-20">
          <div className="mb-10 text-center animate-fade-in-up">
            <h1 className="text-white tracking-tight text-4xl font-bold leading-[1.2] pb-4 drop-shadow-2xl font-serif">
              Your Curtain<br />Rises
            </h1>
            <p className="text-white/70 text-base font-light leading-relaxed px-4">
              L.TICKET만의 특별한 경험을 시작하세요. 프리미엄 공연 예술의 세계가 지금 펼쳐집니다.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <button 
              onClick={handleComplete}
              className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 active:scale-[0.98] transition-all text-white text-[17px] font-bold tracking-wide shadow-lg"
            >
              Get Started
            </button>
            <button 
              onClick={handleComplete}
              className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 bg-transparent border border-white/20 hover:bg-white/5 active:scale-[0.98] transition-all text-white/90 text-[17px] font-medium tracking-wide backdrop-blur-sm"
            >
              Log In
            </button>
            <button 
               onClick={handleComplete}
               className="mt-2 text-white/40 text-sm font-normal hover:text-white/60 transition-colors"
            >
              Browse as Guest
            </button>
          </div>

          <div className="flex justify-center gap-3 opacity-80 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
             <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
             <div className="w-6 h-1.5 rounded-full bg-primary shadow-glow"></div>
          </div>
        </div>
    </div>
  );
};
