
import React from 'react';
import { AppScreen, EventData, NavigationHandler } from '../types';
import { IMAGES } from '../constants';

interface CastMember {
  name: string;
  role: string;
  image: string;
}

interface CastListScreenProps {
  event: EventData;
  onBack: () => void;
}

export const CastListScreen: React.FC<CastListScreenProps> = ({ event, onBack }) => {
  const castMembers: CastMember[] = [
    { name: 'Julian R. Knight', role: 'The Phantom', image: 'https://i.pravatar.cc/150?u=phantom1' },
    { name: 'Elena Vance', role: 'Christine Daaé', image: 'https://i.pravatar.cc/150?u=phantom2' },
    { name: 'Markus Sterling', role: 'Raoul', image: 'https://i.pravatar.cc/150?u=phantom3' },
    { name: 'Sarah Jenkins', role: 'Carlotta Giudicelli', image: 'https://i.pravatar.cc/150?u=phantom4' },
    { name: 'David Bowie', role: 'Monsieur André', image: 'https://i.pravatar.cc/150?u=phantom5' },
    { name: 'Clara Oswald', role: 'Madame Giry', image: 'https://i.pravatar.cc/150?u=phantom6' },
    { name: 'Peter Capaldi', role: 'Monsieur Firmin', image: 'https://i.pravatar.cc/150?u=phantom7' },
    { name: 'Rose Tyler', role: 'Meg Giry', image: 'https://i.pravatar.cc/150?u=phantom8' },
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-background text-gray-900 dark:text-white pb-20 animate-fade-in font-sans overflow-hidden transition-colors duration-300">
      {/* Texture Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: `url('${IMAGES.texture}')`, backgroundSize: 'cover' }}
      ></div>

      <header className="sticky top-0 left-0 right-0 z-50 flex h-16 items-center px-4 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto w-full flex items-center">
          <button 
            onClick={onBack}
            className="size-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <div className="flex-1 text-center pr-10">
            <h1 className="text-lg md:text-xl font-serif font-bold tracking-tight">Cast & Crew</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 lg:p-12 relative z-10">
        <div className="mb-12 lg:text-center">
          <p className="text-[10px] md:text-xs text-primary font-bold uppercase tracking-[0.3em] mb-2">{event.title}</p>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white">Leading Artists</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-10">
          {castMembers.map((member, idx) => (
            <div 
              key={member.name} 
              className="bg-white/60 dark:bg-surface-card/50 backdrop-blur-md border border-gray-200 dark:border-white/5 rounded-[32px] p-6 flex flex-col items-center text-center animate-fade-in-up hover:border-primary/20 transition-all group shadow-sm"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="size-24 lg:size-32 rounded-full overflow-hidden border-2 border-gray-200 dark:border-primary/20 mb-5 shadow-lg group-hover:border-primary transition-all duration-500">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <h3 className="text-base lg:text-lg font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
              <p className="text-[10px] lg:text-xs text-gray-500 uppercase tracking-[0.2em] font-medium">{member.role}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-12 border-t border-gray-200 dark:border-white/10 max-w-3xl mx-auto">
          <h3 className="text-xl lg:text-3xl font-serif font-bold mb-8 lg:text-center text-gray-900 dark:text-white">Production Team</h3>
          <div className="space-y-6">
            {[
              { role: 'Director', name: 'Althea Black' },
              { role: 'Musical Director', name: 'Sebastian Thorne' },
              { role: 'Choreography', name: 'Lyra Vance' },
              { role: 'Lighting Design', name: 'James Clear' },
              { role: 'Costume Design', name: 'Valentina Rossi' }
            ].map((crew) => (
              <div key={crew.role} className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-white/5 last:border-0 hover:bg-gray-100 dark:hover:bg-white/[0.02] px-4 rounded-xl transition-all">
                <span className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">{crew.role}</span>
                <span className="text-base lg:text-xl font-bold text-gray-900 dark:text-white">{crew.name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
