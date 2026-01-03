
import React from 'react';
import { useAppContext } from '../context/AppContext';

interface MyReviewsScreenProps {
  onBack: () => void;
}

export const MyReviewsScreen: React.FC<MyReviewsScreenProps> = ({ onBack }) => {
  const { myReviews } = useAppContext();

  return (
    <div className="bg-gray-50 dark:bg-background min-h-screen text-gray-900 dark:text-white font-sans animate-fade-in transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-4 h-16 flex items-center gap-4 transition-colors">
         <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
         </button>
         <h1 className="text-lg font-serif font-bold">My Reviews</h1>
      </header>

      <main className="p-4 space-y-4 pb-20">
         {myReviews.length > 0 ? (
            myReviews.map((review) => (
                <div key={review.id} className="bg-white dark:bg-surface-card rounded-2xl p-5 border border-gray-200 dark:border-white/5 shadow-sm transition-colors">
                   {/* Header linked to Event */}
                   <div className="flex gap-4 items-center mb-4 pb-4 border-b border-gray-100 dark:border-white/5">
                      <div 
                         className="w-12 h-16 bg-cover bg-center rounded-lg shadow-sm"
                         style={{ backgroundImage: `url('${review.eventImage}')` }}
                      ></div>
                      <div>
                         <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{review.eventTitle}</h3>
                         <div className="flex items-center gap-2 mt-1">
                            <div className="flex text-primary text-[10px]">
                               {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`material-symbols-outlined text-[14px] ${i < review.rating ? 'font-filled' : 'text-gray-300 dark:text-white/20'}`}>star</span>
                               ))}
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono">{review.date}</span>
                         </div>
                      </div>
                   </div>

                   {/* Content */}
                   <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                      {review.content}
                   </p>

                   {/* Footer */}
                   <div className="flex justify-between items-center text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                         <span className="material-symbols-outlined text-[14px]">thumb_up</span>
                         <span>{review.likes} Helpful</span>
                      </div>
                      <button className="text-gray-500 dark:text-gray-400 hover:text-primary transition-colors">Edit</button>
                   </div>
                </div>
            ))
         ) : (
            <div className="flex flex-col items-center justify-center pt-32 text-gray-400 dark:text-gray-500">
               <span className="material-symbols-outlined text-4xl mb-4 opacity-50">rate_review</span>
               <p className="text-sm">No reviews written yet.</p>
            </div>
         )}
      </main>
    </div>
  );
};
