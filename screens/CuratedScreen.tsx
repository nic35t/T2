
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { EVENTS, IMAGES } from '../constants';
import { AppScreen, NavigationHandler, EventData } from '../types';
import { useAppContext } from '../context/AppContext';

interface CuratedScreenProps {
  onNavigate?: NavigationHandler;
}

type FilterType = 'all' | 'performance' | 'voucher';
type LayoutType = 'grid' | 'list';
type SortType = 'newest' | 'ending-soon' | 'most-reviews';

const sortLabels: Record<SortType, string> = {
  'newest': 'Newest',
  'ending-soon': 'Ending Soon',
  'most-reviews': 'Most Reviews'
};

const getSortableDate = (eventDate: string): Date => {
    if (eventDate.toLowerCase().includes('valid')) {
        return new Date('2999-12-31');
    }
    if (eventDate === 'Tonight') {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return today;
    }
    const currentYear = new Date().getFullYear();
    const parsedDate = new Date(`${eventDate} ${currentYear}`);
    if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
    }
    return new Date('2998-12-31');
}

const getReviewScore = (event: EventData) => (parseInt(event.id) * 37) % 100;

export const CuratedScreen: React.FC<CuratedScreenProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const [layout, setLayout] = useState<LayoutType>('grid');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { likedEvents, toggleLike } = useAppContext();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allTags = Array.from(new Set(EVENTS.flatMap(e => e.tags))).sort();
  const INITIAL_DISPLAY_COUNT = 7;
  const visibleTags = isExpanded ? allTags : allTags.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMoreTags = allTags.length > INITIAL_DISPLAY_COUNT;

  const processedEvents = useMemo(() => {
    let events = EVENTS.filter(e => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return e.title.toLowerCase().includes(query) || 
               e.location.toLowerCase().includes(query) ||
               e.tags.some(t => t.toLowerCase().includes(query));
      }
      if (filter !== 'all' && e.category !== filter) return false;
      if (selectedTag && !e.tags.includes(selectedTag)) return false;
      return true;
    });

    const sortedEvents = [...events];
    switch (sortBy) {
      case 'ending-soon':
        sortedEvents.sort((a, b) => getSortableDate(a.date).getTime() - getSortableDate(b.date).getTime());
        break;
      case 'most-reviews':
        sortedEvents.sort((a, b) => getReviewScore(b) - getReviewScore(a));
        break;
      case 'newest':
      default:
        sortedEvents.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
    }
    return sortedEvents;
  }, [filter, selectedTag, searchQuery, sortBy]);

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
  
  const handleSortSelect = (sortType: SortType) => {
    setSortBy(sortType);
    setIsSortOpen(false);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col pb-28 bg-[#F8F9FA] dark:bg-background overflow-hidden transition-colors duration-300">
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none dark:opacity-[0.03] opacity-[0.015]"
        style={{ backgroundImage: `url('${IMAGES.texture}')`, backgroundSize: 'cover' }}
      ></div>

      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between px-5 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 transition-all duration-300">
         {!isSearchOpen ? (
            <>
              <button 
                 onClick={() => onNavigate?.(AppScreen.HOME)}
                 className="flex size-10 items-center justify-start text-gray-900 dark:text-white/80 hover:text-primary dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">arrow_back</span>
              </button>
              
              <div className="flex items-center justify-center group cursor-pointer" onClick={() => onNavigate?.(AppScreen.HOME)}>
                <span className="text-xl font-serif font-bold tracking-[0.15em] text-gray-900 dark:text-white group-hover:text-primary transition-colors">L.TICKET</span>
              </div>

              <button 
                onClick={() => setIsSearchOpen(true)}
                className="flex size-10 items-center justify-end text-gray-900 dark:text-white/80 hover:text-primary dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">search</span>
              </button>
            </>
          ) : (
            <div className="flex items-center w-full gap-3 animate-fade-in">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">search</span>
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search titles, venues, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 bg-gray-100 dark:bg-white/10 rounded-full pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 border border-transparent dark:border-white/10 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <button 
                onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          )}
      </header>

      <main className="flex flex-col pt-20 px-4 w-full max-w-7xl mx-auto relative z-10">
        
        {!searchQuery && (
          <>
            <div className="px-1 py-4 flex justify-between items-center">
              {/* Sort Dropdown */}
              <div ref={sortDropdownRef} className="relative z-20">
                <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 bg-white dark:bg-surface-card px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-gray-300 hover:border-primary/50 hover:text-primary dark:hover:text-white transition-all shadow-sm">
                  <span className="material-symbols-outlined text-[18px] text-primary/80">sort</span>
                  <span>{sortLabels[sortBy]}</span>
                  <span className={`material-symbols-outlined text-[18px] text-gray-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                {isSortOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#1E1E24] rounded-xl border border-gray-100 dark:border-white/10 shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
                    {(Object.keys(sortLabels) as SortType[]).map(key => (
                      <button key={key} onClick={() => handleSortSelect(key)} className={`w-full text-left px-5 py-3 text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-between ${sortBy === key ? 'text-primary' : 'text-gray-600 dark:text-gray-400'}`}>
                        {sortLabels[key]}
                        {sortBy === key && <span className="material-symbols-outlined text-sm">check</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Layout Toggle */}
              <div className="flex items-center bg-white dark:bg-surface-card p-1 rounded-full border border-gray-200 dark:border-white/10 shadow-sm">
                <button onClick={() => setLayout('grid')} className={`p-2 rounded-full transition-all duration-300 ${layout === 'grid' ? 'bg-gray-100 dark:bg-white text-black shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
                  <span className="material-symbols-outlined text-[20px] block">grid_view</span>
                </button>
                <button onClick={() => setLayout('list')} className={`p-2 rounded-full transition-all duration-300 ${layout === 'list' ? 'bg-gray-100 dark:bg-white text-black shadow-sm' : 'text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
                  <span className="material-symbols-outlined text-[20px] block">view_list</span>
                </button>
              </div>
            </div>

            <div className="mb-6 flex flex-col items-center justify-center gap-6 animate-fade-in-up">
              <div className="flex items-center gap-2 bg-white dark:bg-surface-card p-1.5 rounded-full border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-2xl overflow-x-auto max-w-[90vw] no-scrollbar">
                 {(['all', 'performance', 'voucher'] as FilterType[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => { setFilter(f); setSelectedTag(null); }}
                      className={`min-w-[80px] px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${filter === f ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg scale-105' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'}`}
                    >
                      {f === 'all' ? 'All' : f === 'performance' ? 'Shows' : 'Gifts'}
                    </button>
                 ))}
              </div>

              <div className="flex flex-col items-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="flex flex-wrap justify-center gap-2 max-w-2xl px-4 transition-all duration-500 ease-in-out">
                  {visibleTags.map(tag => (
                    <button key={tag} onClick={() => setSelectedTag(selectedTag === tag ? null : tag)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all duration-300 ${ selectedTag === tag ? 'bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/10' }`}>
                      #{tag}
                    </button>
                  ))}
                </div>
                
                {hasMoreTags && ( <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors uppercase tracking-widest mt-1 py-1 px-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"><span>{isExpanded ? 'Collapse' : 'Expand'}</span><span className={`material-symbols-outlined text-[16px] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span></button> )}
              </div>
            </div>
          </>
        )}

        {searchQuery && (
          <div className="mb-6 px-2">
            <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-white">Search Results <span className="text-primary text-sm font-sans font-normal ml-2">({processedEvents.length})</span></h2>
          </div>
        )}
        
        <div className={layout === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 pb-10" 
            : "flex flex-col gap-4 pb-10"}>
          {processedEvents.length > 0 ? (
            processedEvents.map((event, index) => {
              const statusConfig = getStatusConfig(event.status);
              const isLiked = likedEvents.has(event.id);
              
              if (layout === 'list') {
                return (
                  <article 
                    key={event.id} 
                    onClick={() => onNavigate?.(AppScreen.EVENT_DETAILS, event)}
                    className="animate-fade-in-up w-full bg-white dark:bg-surface-card rounded-2xl border border-gray-100 dark:border-white/5 flex overflow-hidden group active:scale-[0.99] transition-all duration-300 hover:border-primary/40 cursor-pointer shadow-card-light hover:shadow-card-hover dark:shadow-sm" 
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="w-32 md:w-40 shrink-0 relative overflow-hidden">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${event.image}')` }}></div>
                      <div className="absolute inset-0 bg-black/5 dark:bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="p-4 md:p-5 flex flex-col flex-1 relative">
                       {/* Top Row */}
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
                             {event.category === 'voucher' ? 'Premium Gift' : `${event.date} • ${event.time}`}
                          </p>
                          <h2 className="font-serif font-bold text-gray-900 dark:text-white text-lg line-clamp-1">{event.title}</h2>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); toggleLike(event.id); }} className={`material-symbols-outlined transition-colors cursor-pointer text-[20px] p-1 -mr-1 ${isLiked ? 'text-red-500' : 'text-gray-400 dark:text-gray-600 hover:text-red-400'}`} style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>favorite</button>
                      </div>

                      {/* Location & Tags */}
                      <p className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                         <span className="material-symbols-outlined text-[14px]">location_on</span>
                         {event.location}
                      </p>
                      
                      {/* Description Snippet */}
                      {event.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 hidden sm:block font-light leading-relaxed">
                          {event.description}
                        </p>
                      )}

                      <div className="flex gap-1.5 flex-wrap mb-2">
                         {event.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded border text-[9px] font-bold uppercase border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400">{tag}</span>
                         ))}
                      </div>

                      {/* Bottom Row */}
                      <div className="mt-auto flex justify-between items-end pt-3 border-t border-gray-100 dark:border-white/5">
                        <div className="flex flex-col">
                           <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Price from</p>
                           <p className="text-base font-bold text-gray-900 dark:text-white font-mono">{formatKRW(event.price)}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); onNavigate?.(AppScreen.BOOKING, event); }} className="h-9 px-5 rounded-full bg-gray-900 dark:bg-white/10 border border-transparent dark:border-white/20 text-white dark:text-white text-[10px] font-bold hover:bg-black dark:hover:bg-white/20 transition-all tracking-wider uppercase flex items-center gap-1 group/btn shadow-md dark:shadow-none">
                           <span>Book</span>
                           <span className="material-symbols-outlined text-[14px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              }
              
              // Grid View
              return (
                <article 
                    key={event.id} 
                    onClick={() => onNavigate?.(AppScreen.EVENT_DETAILS, event)}
                    className="animate-fade-in-up cursor-pointer group" 
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                   <div className="relative w-full h-full bg-white dark:bg-surface-card rounded-[32px] overflow-hidden shadow-card-light hover:shadow-card-hover dark:shadow-xl border border-gray-100 dark:border-white/10 flex flex-col group active:scale-[0.98] transition-all duration-300 hover:border-primary/40">
                      <div className="h-[72px] px-6 flex items-center justify-between bg-white dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 relative z-20">
                         <div className="flex flex-col justify-center gap-0.5">
                            <span className={`text-[10px] font-bold tracking-widest uppercase ${event.category === 'voucher' ? 'text-blue-500 dark:text-blue-400' : 'text-primary'}`}>{event.category === 'voucher' ? 'Premium Gift' : `${event.date} • ${event.time}`}</span>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight truncate max-w-[200px] font-serif">{event.title}</h2>
                         </div>
                         <button onClick={(e) => { e.stopPropagation(); toggleLike(event.id);}} className={`size-10 rounded-full flex items-center justify-center border transition-all duration-300 ${isLiked ? 'bg-primary text-black border-primary' : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/5 text-gray-400 dark:text-white/80 hover:bg-gray-50 dark:hover:bg-white/10'}`}>
                            <span className={`material-symbols-outlined text-[20px] ${isLiked ? 'font-filled' : ''}`}>{isLiked ? 'check' : 'add'}</span>
                         </button>
                      </div>
                      <div className="relative flex flex-col flex-1">
                         <div className="relative aspect-[16/10] w-full overflow-hidden">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${event.image}')` }}></div>
                            {event.category === 'voucher' && <div className="absolute inset-0 bg-black/20"></div>}
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/10 dark:from-surface-card dark:via-transparent dark:to-black/30 opacity-60"></div>
                            {statusConfig && ( <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full backdrop-blur-md text-[10px] font-bold uppercase tracking-wider border border-white/10 ${statusConfig.className}`}>{statusConfig.label}</div> )}
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                               <div className="flex items-center gap-1.5 bg-white/80 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 dark:border-white/10 shadow-sm">
                                  <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                                  <span className="text-xs font-bold text-gray-900 dark:text-white">{event.location}</span>
                               </div>
                            </div>
                         </div>
                         <div className="p-6 flex flex-col flex-1 bg-white dark:bg-surface-card">
                            <div className="flex justify-between items-start mb-4">
                               <div className="flex items-center gap-2 flex-wrap">
                                  {event.tags.map(tag => ( <span key={tag} className={`px-2.5 py-1 rounded border text-[10px] font-bold uppercase transition-colors ${selectedTag === tag ? 'bg-primary/10 dark:bg-primary/20 border-primary text-primary' : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-300'}`}>{tag}</span> ))}
                               </div>
                               <button onClick={(e) => { e.stopPropagation(); toggleLike(event.id);}} className={`material-symbols-outlined transition-colors cursor-pointer text-[22px] ${isLiked ? 'text-red-500' : 'text-gray-300 dark:text-gray-500 hover:text-red-400'}`} style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>favorite</button>
                            </div>
                            {event.description && (<p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6 line-clamp-3 font-light">{event.description}</p>)}
                            <div className="mt-auto pt-5 border-t border-dashed border-gray-200 dark:border-white/10">
                               <div className="flex items-center justify-between">
                                  <div className="flex flex-col">
                                     <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-0.5">Price</p>
                                     <div className="flex items-baseline gap-2"><p className="text-xl font-bold text-gray-900 dark:text-white">{formatKRW(event.price)}</p></div>
                                  </div>
                                  <button onClick={(e) => { e.stopPropagation(); onNavigate?.(AppScreen.BOOKING, event);}} className="h-11 px-6 rounded-full bg-gray-900 dark:bg-white/10 backdrop-blur-md border border-transparent dark:border-white/20 text-white text-[11px] font-bold hover:bg-black dark:hover:bg-white/20 transition-all tracking-wider uppercase shadow-lg flex items-center gap-2">
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
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 opacity-60">
              <span className="material-symbols-outlined text-4xl mb-4">search_off</span>
              <p className="text-sm">No items found matching your criteria.</p>
              <button onClick={() => {setFilter('all'); setSelectedTag(null); setSearchQuery('');}} className="mt-4 px-4 py-2 bg-gray-200 dark:bg-white/5 rounded-full text-xs font-bold hover:bg-gray-300 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-white">Clear All Filters</button>
            </div>
          )}
        </div>
        
        <div className="h-24 flex items-center justify-center opacity-30 mt-10">
          <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-[0.3em]">End of Collection</span>
        </div>
      </main>
    </div>
  );
};
