
import React, { useState } from 'react';
import { EVENTS, IMAGES } from '../constants';
import { AppScreen, NavigationHandler } from '../types';
import { useAppContext } from '../context/AppContext';

interface CuratedScreenProps {
  onNavigate?: NavigationHandler;
}

type FilterType = 'all' | 'performance' | 'voucher';

export const CuratedScreen: React.FC<CuratedScreenProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { likedEvents, toggleLike } = useAppContext();

  // Extract all unique tags from events
  const allTags = Array.from(new Set(EVENTS.flatMap(e => e.tags))).sort();
  
  // Tag display logic
  const INITIAL_DISPLAY_COUNT = 7;
  const visibleTags = isExpanded ? allTags : allTags.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMoreTags = allTags.length > INITIAL_DISPLAY_COUNT;

  const filteredEvents = EVENTS.filter(e => {
    // Filter by Category
    if (filter !== 'all' && e.category !== filter) return false;
    // Filter by Tag
    if (selectedTag && !e.tags.includes(selectedTag)) return false;
    // Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return e.title.toLowerCase().includes(query) || 
             e.location.toLowerCase().includes(query) ||
             e.tags.some(t => t.toLowerCase().includes(query));
    }
    return true;
  });

  const formatKRW = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case 'selling-fast': return { label: 'Selling Fast', className: 'bg-[#e50914] text-white shadow-[0_4px_10px_rgba(229,9,20,0.4)]' };
      case 'limited-run': return { label: 'Limited Run', className: 'bg-[#ff9900] text-black shadow-[0_4px_10px_rgba(255,153,0,0.4)]' };
      case 'sold-out': return { label: 'Sold Out', className: 'bg-gray-600 text-white shadow-[0_4px_10px_rgba(75,85,99,0.4)]' };
      case 'new-arrival': return { label: 'New Arrival', className: 'bg-[#00c853] text-white shadow-[0_4px_10px_rgba(0,200,83,0.4)]' };
      default: return null;
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col pb-28 bg-background overflow-hidden">
      {/* Texture Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url('${IMAGES.texture}')`, backgroundSize: 'cover' }}
      ></div>

      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-5 bg-background/80 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          {!isSearchOpen ? (
            <>
              <button 
                 onClick={() => onNavigate?.(AppScreen.HOME)}
                 className="flex size-10 items-center justify-start text-white/80 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">arrow_back</span>
              </button>
              
              <div className="flex items-center justify-center group cursor-pointer" onClick={() => onNavigate?.(AppScreen.HOME)}>
                <span className="text-xl font-serif font-bold tracking-[0.15em] text-white group-hover:text-primary transition-colors">L.TICKET</span>
              </div>

              <button 
                onClick={() => setIsSearchOpen(true)}
                className="flex size-10 items-center justify-end text-white/80 hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">search</span>
              </button>
            </>
          ) : (
            <div className="flex items-center w-full gap-3 animate-fade-in">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-500 text-[20px]">search</span>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search titles, venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 bg-white/10 rounded-full pl-10 pr-4 text-sm text-white placeholder-gray-500 border border-white/10 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <button 
                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                className="text-sm font-bold text-gray-400 hover:text-white whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex flex-col pt-24 px-4 w-full max-w-7xl mx-auto relative z-10">
        {/* Centered Filters Section - Only show if not searching */}
        {!searchQuery && (
          <div className="mb-10 flex flex-col items-center justify-center gap-6 animate-fade-in-up">
            {/* Category Tabs */}
            <div className="flex items-center gap-2 bg-surface-card p-1.5 rounded-full border border-white/10 shadow-2xl overflow-x-auto max-w-[90vw] no-scrollbar">
               {(['all', 'performance', 'voucher'] as FilterType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => { setFilter(f); setSelectedTag(null); }}
                    className={`min-w-[80px] px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${filter === f ? 'bg-white text-black shadow-lg scale-105' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                  >
                    {f === 'all' ? 'All' : f === 'performance' ? 'Shows' : 'Gifts'}
                  </button>
               ))}
            </div>

            {/* Tags Filter */}
            <div className="flex flex-col items-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex flex-wrap justify-center gap-2 max-w-2xl px-4 transition-all duration-500 ease-in-out">
                {visibleTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all duration-300 ${
                      selectedTag === tag 
                        ? 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(212,175,55,0.3)]' 
                        : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
              
              {hasMoreTags && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest mt-1 py-1 px-3 rounded-full hover:bg-white/5"
                >
                  <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
                  <span className={`material-symbols-outlined text-[16px] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
              )}
            </div>
          </div>
        )}

        {searchQuery && (
          <div className="mb-6 px-2">
            <h2 className="text-lg font-serif font-bold text-white">
              Search Results <span className="text-primary text-sm font-sans font-normal ml-2">({filteredEvents.length})</span>
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 pb-10">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => {
              const statusConfig = getStatusConfig(event.status);
              const isLiked = likedEvents.has(event.id);
              
              return (
                <article 
                   key={event.id} 
                   onClick={() => onNavigate?.(AppScreen.EVENT_DETAILS, event)}
                   className="animate-fade-in-up cursor-pointer group" 
                   style={{ animationDelay: `${index * 0.1}s` }}
                >
                   <div className="relative w-full h-full bg-surface-card rounded-[32px] overflow-hidden shadow-xl border border-white/10 flex flex-col group active:scale-[0.98] transition-all duration-300 hover:border-primary/40">
                      {/* Card Header */}
                      <div className="h-[72px] px-6 flex items-center justify-between bg-white/[0.02] border-b border-white/5 relative z-20">
                         <div className="flex flex-col justify-center gap-0.5">
                            <span className={`text-[10px] font-bold tracking-widest uppercase ${event.category === 'voucher' ? 'text-blue-400' : 'text-primary'}`}>
                               {event.category === 'voucher' ? 'Premium Gift' : `${event.date} • ${event.time}`}
                            </span>
                            <h2 className="text-lg font-bold text-white tracking-tight truncate max-w-[200px] font-serif">{event.title}</h2>
                         </div>
                         <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(event.id);
                            }}
                            className={`size-10 rounded-full flex items-center justify-center border transition-all duration-300 ${isLiked ? 'bg-primary text-black border-primary' : 'bg-white/5 border-white/5 text-white/80 hover:bg-white/10'}`}
                         >
                            <span className={`material-symbols-outlined text-[20px] ${isLiked ? 'font-filled' : ''}`}>
                               {isLiked ? 'check' : 'add'}
                            </span>
                         </button>
                      </div>

                      <div className="relative flex flex-col flex-1">
                         <div className="relative aspect-[16/10] w-full overflow-hidden">
                            <div 
                               className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                               style={{ backgroundImage: `url('${event.image}')` }}
                            ></div>
                            {event.category === 'voucher' && <div className="absolute inset-0 bg-black/40"></div>}
                            <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-black/30 opacity-60"></div>
                            
                            {/* Status Badge */}
                            {statusConfig && (
                              <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full backdrop-blur-md text-[10px] font-bold uppercase tracking-wider border border-white/10 ${statusConfig.className}`}>
                                {statusConfig.label}
                              </div>
                            )}

                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                               <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                                  <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                                  <span className="text-xs font-bold text-white">{event.location}</span>
                               </div>
                            </div>
                         </div>
                         
                         <div className="p-6 flex flex-col flex-1 bg-surface-card">
                            <div className="flex justify-between items-start mb-4">
                               <div className="flex items-center gap-2 flex-wrap">
                                  {event.tags.map(tag => (
                                     <span key={tag} className={`px-2.5 py-1 rounded border text-[10px] font-bold uppercase transition-colors ${selectedTag === tag ? 'bg-primary/20 border-primary text-primary' : 'border-white/10 bg-white/5 text-gray-300'}`}>
                                        {tag}
                                     </span>
                                  ))}
                               </div>
                               <button 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    toggleLike(event.id);
                                  }} 
                                  className={`material-symbols-outlined transition-colors cursor-pointer text-[22px] ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}
                                  style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
                               >
                                  favorite
                               </button>
                            </div>
                            
                            {event.description && (
                               <p className="text-sm text-gray-400 leading-relaxed mb-6 line-clamp-3 font-light">
                                  {event.description}
                               </p>
                            )}

                            <div className="mt-auto pt-5 border-t border-dashed border-white/10">
                               <div className="flex items-center justify-between">
                                  <div className="flex flex-col">
                                     <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Price</p>
                                     <div className="flex items-baseline gap-2">
                                        <p className="text-xl font-bold text-white">{formatKRW(event.price)}</p>
                                     </div>
                                  </div>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onNavigate?.(AppScreen.BOOKING, event);
                                    }}
                                    className="h-11 px-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold hover:bg-white/20 transition-all tracking-wider uppercase shadow-lg flex items-center gap-2"
                                  >
                                     <span>{event.category === 'voucher' ? 'Buy Gift' : 'Book Now'}</span>
                                     <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                  </button>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500 opacity-60">
              <span className="material-symbols-outlined text-4xl mb-4">search_off</span>
              <p className="text-sm">No items found matching your criteria</p>
              <button 
                onClick={() => {setFilter('all'); setSelectedTag(null); setSearchQuery('');}} 
                className="mt-4 px-4 py-2 bg-white/5 rounded-full text-xs font-bold hover:bg-white/10 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
        
        <div className="h-24 flex items-center justify-center opacity-30 mt-10">
          <span className="text-xs font-bold text-white uppercase tracking-[0.3em]">End of Collection</span>
        </div>
      </main>
    </div>
  );
};
