
import React from 'react';
import { IMAGES } from '../constants';

interface ProfileDetailsScreenProps {
  onBack: () => void;
}

export const ProfileDetailsScreen: React.FC<ProfileDetailsScreenProps> = ({ onBack }) => {
  return (
    <div className="bg-gray-50 dark:bg-background min-h-screen text-gray-900 dark:text-white font-sans animate-fade-in transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-4 h-16 flex items-center gap-4 transition-colors">
         <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
         </button>
         <h1 className="text-lg font-serif font-bold">My Profile</h1>
      </header>

      <main className="p-6 pb-20 max-w-md mx-auto w-full">
         <div className="flex flex-col items-center mb-8 animate-fade-in-up">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-surface-card shadow-2xl mb-4 relative ring-2 ring-gray-100 dark:ring-white/10">
               <img src={IMAGES.profile} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">Alex Thespian</h2>
            <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
               <span className="material-symbols-outlined text-[16px] text-blue-600 dark:text-blue-400">link</span>
               <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Linked Account</span>
            </div>
         </div>

         <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <section>
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">Basic Information</h3>
               <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                  {[
                     { label: 'Name', value: 'Alex Thespian' },
                     { label: 'Phone', value: '010-1234-5678' },
                     { label: 'Email', value: 'alex.thespian@gmail.com' },
                     { label: 'Birthdate', value: '1995.08.24' },
                  ].map((item, idx, arr) => (
                     <div key={item.label} className={`p-4 flex justify-between items-center ${idx < arr.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''}`}>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{item.value}</span>
                     </div>
                  ))}
               </div>
            </section>

             <section>
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">Membership</h3>
               <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="size-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center shadow-md">
                        <span className="material-symbols-outlined text-white text-xl">workspace_premium</span>
                     </div>
                     <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">Gold Member</p>
                        <p className="text-xs text-gray-500">Since 2023</p>
                     </div>
                  </div>
                  <button className="text-xs font-bold text-primary border border-primary/30 px-3 py-1.5 rounded-full hover:bg-primary/5 transition-colors">
                     Benefits
                  </button>
               </div>
            </section>

            <div className="pt-4 flex flex-col gap-3">
               <button className="w-full py-3 text-sm font-medium text-gray-900 dark:text-white bg-gray-100 dark:bg-white/5 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                  Edit Profile
               </button>
               <button className="w-full py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors">
                  Unlink Account
               </button>
            </div>
         </div>
      </main>
    </div>
  );
};
