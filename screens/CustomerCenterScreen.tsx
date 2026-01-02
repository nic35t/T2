
import React, { useState } from 'react';
import { NoticeData } from '../types';
import { useAppContext } from '../context/AppContext';

interface CustomerCenterScreenProps {
  initialTab?: 'NOTICE' | 'FAQ' | 'INQUIRY';
  onBack: () => void;
}

const MOCK_NOTICES: NoticeData[] = [
  { id: '1', title: 'L.TICKET V2.0 Update Announcement', category: 'NOTICE', date: '2023.11.01', content: 'L.TICKET has been updated to V2.0. Experience the new features.', isImportant: true },
  { id: '2', title: '[Event] Review Event Winners', category: 'WINNER', date: '2023.10.28', content: 'Here are the winners of the October Review Event.' },
  { id: '3', title: 'System Maintenance Notice (11/05)', category: 'NOTICE', date: '2023.10.25', content: 'Scheduled maintenance from 02:00 to 04:00 AM.' },
];

const MOCK_FAQS = [
  { id: 'f1', q: 'How can I cancel my ticket?', a: 'You can cancel your ticket in My L.TICKET > Ticket Wallet. Cancellation fees may apply.' },
  { id: 'f2', q: 'Where can I find my QR code?', a: 'The QR code is available in your Ticket Wallet. Click on the ticket to view details.' },
  { id: 'f3', q: 'Do you offer group discounts?', a: 'Group discounts are available for parties of 10 or more. Please contact our 1:1 Inquiry for details.' },
];

export const CustomerCenterScreen: React.FC<CustomerCenterScreenProps> = ({ initialTab = 'NOTICE', onBack }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryContent, setInquiryContent] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  
  const { inquiries, addInquiry } = useAppContext();

  const renderTabButton = (tab: typeof activeTab, label: string) => {
    const isActive = activeTab === tab;
    return (
      <button 
        onClick={() => setActiveTab(tab)}
        className={`flex-1 py-4 relative transition-colors ${isActive ? 'text-primary font-bold' : 'text-gray-500 font-medium hover:text-gray-900 dark:hover:text-white'}`}
      >
        {label}
        {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-glow"></div>}
      </button>
    );
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry(inquirySubject, inquiryContent);
    setInquirySubject('');
    setInquiryContent('');
    // No alert - pure UI feedback happens via the list update below
  };

  return (
    <div className="bg-gray-50 dark:bg-background min-h-screen text-gray-900 dark:text-white font-sans animate-fade-in flex flex-col transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-4 h-16 flex items-center gap-4 transition-colors">
         <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
         </button>
         <h1 className="text-lg font-serif font-bold">Customer Center</h1>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-white/5 bg-white dark:bg-background sticky top-16 z-40 transition-colors">
        {renderTabButton('NOTICE', 'Notices')}
        {renderTabButton('FAQ', 'FAQ')}
        {renderTabButton('INQUIRY', '1:1 Inquiry')}
      </div>

      <main className="flex-1 p-4 pb-20 overflow-y-auto no-scrollbar">
        {activeTab === 'NOTICE' && (
          <div className="space-y-3 animate-fade-in-up">
             {MOCK_NOTICES.map(notice => (
               <div key={notice.id} className="bg-white dark:bg-surface-card border border-gray-200 dark:border-white/5 rounded-xl p-4 hover:border-primary/30 dark:hover:border-white/10 transition-colors shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                     <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${notice.isImportant ? 'bg-red-500/10 text-red-500' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}>
                        {notice.category}
                     </span>
                     <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">{notice.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{notice.title}</h3>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'FAQ' && (
          <div className="space-y-3 animate-fade-in-up">
            {MOCK_FAQS.map(faq => (
              <div key={faq.id} className="bg-white dark:bg-surface-card border border-gray-200 dark:border-white/5 rounded-xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full p-4 flex justify-between items-center text-left"
                >
                  <span className="text-sm font-bold text-gray-900 dark:text-white pr-4"><span className="text-primary mr-2">Q.</span>{faq.q}</span>
                  <span className={`material-symbols-outlined text-gray-400 dark:text-gray-500 transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                {expandedFaq === faq.id && (
                  <div className="p-4 pt-0 bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-white/5">
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed"><span className="text-primary font-bold mr-2">A.</span>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'INQUIRY' && (
          <div className="animate-fade-in-up pb-10">
            <div className="bg-white/80 dark:bg-surface-card/50 p-4 rounded-xl border border-gray-200 dark:border-white/5 mb-6 shadow-sm">
               <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  We will respond to your inquiry within 24 hours. <br/>
                  Operating Hours: Mon-Fri, 09:00 - 18:00
               </p>
            </div>
            
            <form onSubmit={handleSubmitInquiry} className="space-y-4 mb-10 border-b border-gray-200 dark:border-white/10 pb-10">
               <h3 className="text-sm font-serif font-bold text-gray-900 dark:text-white">New Inquiry</h3>
               <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Subject</label>
                  <input 
                    type="text" 
                    value={inquirySubject}
                    onChange={(e) => setInquirySubject(e.target.value)}
                    required
                    className="w-full h-12 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 text-gray-900 dark:text-white focus:border-primary focus:outline-none transition-colors text-sm shadow-sm" 
                    placeholder="Enter the subject" 
                  />
               </div>
               <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Message</label>
                  <textarea 
                    value={inquiryContent}
                    onChange={(e) => setInquiryContent(e.target.value)}
                    required
                    className="w-full h-40 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white focus:border-primary focus:outline-none transition-colors text-sm resize-none shadow-sm" 
                    placeholder="Describe your issue in detail" 
                  />
               </div>
               <button 
                  type="submit"
                  className="w-full h-14 bg-gradient-to-r from-primary to-[#B8962E] text-black font-bold rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] mt-2 uppercase tracking-wide text-sm"
               >
                  Submit Inquiry
               </button>
            </form>

            {/* Inquiry History */}
            <h3 className="text-sm font-serif font-bold text-gray-900 dark:text-white mb-4">My Inquiries ({inquiries.length})</h3>
            <div className="space-y-3">
              {inquiries.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-8">No inquiry history.</p>
              ) : (
                inquiries.map((inq) => (
                  <div key={inq.id} className="bg-white dark:bg-surface-card border border-gray-200 dark:border-white/5 rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase mr-2 ${inq.status === 'PENDING' ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300' : 'bg-primary/20 text-primary'}`}>
                            {inq.status}
                         </span>
                         <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">{inq.date}</span>
                       </div>
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{inq.subject}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{inq.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
