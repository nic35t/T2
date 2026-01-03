
import React, { useState, useEffect } from 'react';
import { NoticeData } from '../types';
import { useAppContext } from '../context/AppContext';

type CustomerView = 'MENU' | 'NOTICE' | 'GUIDE' | 'FAQ' | 'INQUIRY' | 'TERMS';

interface CustomerCenterScreenProps {
  initialTab?: 'NOTICE' | 'GUIDE' | 'FAQ' | 'INQUIRY' | 'TERMS';
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

export const CustomerCenterScreen: React.FC<CustomerCenterScreenProps> = ({ initialTab, onBack }) => {
  // If initialTab is provided, start there. Otherwise start at MENU.
  const [currentView, setCurrentView] = useState<CustomerView>(initialTab || 'MENU');
  
  // Specific state for Inquiry
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryContent, setInquiryContent] = useState('');
  
  // Specific state for FAQ
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Specific state for Terms
  const [activeTermTab, setActiveTermTab] = useState<'SERVICE' | 'PRIVACY'>('SERVICE');
  
  const { inquiries, addInquiry } = useAppContext();

  // Handle Hardware/Software Back Button Logic
  const handleBack = () => {
    // If we started with a specific tab (deep link from My Page), exit app/screen on back
    if (initialTab && currentView === initialTab) {
      onBack();
      return;
    }
    // If we are deep inside a view but didn't start there, go back to MENU
    if (currentView !== 'MENU') {
      setCurrentView('MENU');
      return;
    }
    // Default exit
    onBack();
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    addInquiry(inquirySubject, inquiryContent);
    setInquirySubject('');
    setInquiryContent('');
    alert("Inquiry submitted successfully!");
  };

  const getHeaderTitle = () => {
    switch (currentView) {
      case 'NOTICE': return 'Notices & Events';
      case 'GUIDE': return 'User Guide';
      case 'FAQ': return 'FAQ';
      case 'INQUIRY': return '1:1 Inquiry';
      case 'TERMS': return 'Terms & Policies';
      default: return 'Customer Center';
    }
  };

  // --- Render Components ---

  const renderMenu = () => (
    <div className="p-4 space-y-3 animate-fade-in-up">
      {[
        { id: 'NOTICE', icon: 'campaign', label: 'Notices & Events', sub: 'Check latest news' },
        { id: 'GUIDE', icon: 'menu_book', label: 'User Guide', sub: 'How to use L.TICKET' },
        { id: 'FAQ', icon: 'help', label: 'FAQ', sub: 'Frequently asked questions' },
        { id: 'INQUIRY', icon: 'support_agent', label: '1:1 Inquiry', sub: 'Personalized support' },
        { id: 'TERMS', icon: 'policy', label: 'Terms & Policies', sub: 'Service usage rules' },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setCurrentView(item.id as CustomerView)}
          className="w-full flex items-center gap-4 p-5 bg-white dark:bg-surface-card border border-gray-200 dark:border-white/5 rounded-2xl hover:border-primary/30 transition-all shadow-sm group text-left"
        >
          <div className="size-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-2xl">{item.icon}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-base">{item.label}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.sub}</p>
          </div>
          <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">chevron_right</span>
        </button>
      ))}

      <div className="mt-8 p-4 rounded-xl bg-gray-100 dark:bg-white/5 text-center">
        <p className="text-xs text-gray-500">Operating Hours: Mon-Fri, 09:00 - 18:00</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">1588-0000</p>
      </div>
    </div>
  );

  const renderNotices = () => (
    <div className="p-4 space-y-3 animate-fade-in-up">
      {MOCK_NOTICES.map(notice => (
        <div key={notice.id} className="bg-white dark:bg-surface-card border border-gray-200 dark:border-white/5 rounded-xl p-4 hover:border-primary/30 dark:hover:border-white/10 transition-colors shadow-sm cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${notice.isImportant ? 'bg-red-500/10 text-red-500' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'}`}>
                {notice.category}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">{notice.date}</span>
          </div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{notice.title}</h3>
          <p className="text-xs text-gray-500 mt-2 line-clamp-2">{notice.content}</p>
        </div>
      ))}
    </div>
  );

  const renderGuide = () => (
    <div className="p-4 space-y-6 animate-fade-in-up">
      <div className="space-y-4">
        {[
          { step: '01', title: 'Ticket Booking', desc: 'Select your desired performance and seats. We support various payment methods including L.PAY.' },
          { step: '02', title: 'Mobile Ticket', desc: 'Your ticket is issued directly to your Ticket Wallet. No physical exchange needed.' },
          { step: '03', title: 'Entry', desc: 'Present the dynamic QR code at the gate. Screenshots are not accepted for security.' },
          { step: '04', title: 'Cancellation', desc: 'Cancel anytime before the show. Refund policies vary by event time.' },
        ].map((guide) => (
          <div key={guide.step} className="flex gap-4 items-start bg-white dark:bg-surface-card p-5 rounded-2xl border border-gray-200 dark:border-white/5">
             <div className="text-2xl font-black text-gray-200 dark:text-white/10 font-serif shrink-0">{guide.step}</div>
             <div>
               <h3 className="font-bold text-gray-900 dark:text-white mb-1">{guide.title}</h3>
               <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{guide.desc}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFAQ = () => (
    <div className="p-4 space-y-3 animate-fade-in-up">
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-2">
        {['All', 'Booking', 'Payment', 'Ticket', 'Account'].map((tag, i) => (
           <button key={tag} className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border ${i === 0 ? 'bg-primary border-primary text-black' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400'}`}>
             {tag}
           </button>
        ))}
      </div>
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
  );

  const renderInquiry = () => (
    <div className="p-4 animate-fade-in-up pb-10">
      <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20 mb-6">
          <div className="flex gap-2 items-start">
             <span className="material-symbols-outlined text-blue-500 text-lg mt-0.5">info</span>
             <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
                We will respond to your inquiry within 24 hours. <br/>
                Operating Hours: Mon-Fri, 09:00 - 18:00
             </p>
          </div>
      </div>
      
      <form onSubmit={handleSubmitInquiry} className="space-y-4 mb-10 border-b border-gray-200 dark:border-white/10 pb-10">
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
            className="w-full h-14 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg mt-2 uppercase tracking-wide text-sm hover:bg-black dark:hover:bg-gray-200 transition-colors"
          >
            Submit Inquiry
          </button>
      </form>

      {/* Inquiry History */}
      <div className="flex justify-between items-center mb-4">
         <h3 className="text-sm font-serif font-bold text-gray-900 dark:text-white">My Inquiries</h3>
         <span className="text-xs text-primary font-bold">{inquiries.length}</span>
      </div>
      
      <div className="space-y-3">
        {inquiries.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-surface-card rounded-xl border border-gray-200 dark:border-white/5 border-dashed">
             <span className="material-symbols-outlined text-gray-300 text-4xl mb-2">history</span>
             <p className="text-xs text-gray-500">No inquiry history.</p>
          </div>
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
  );

  const renderTerms = () => (
    <div className="p-4 animate-fade-in-up h-full flex flex-col">
       <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl mb-6">
          <button 
             onClick={() => setActiveTermTab('SERVICE')}
             className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTermTab === 'SERVICE' ? 'bg-white dark:bg-surface-card text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
          >
             Terms of Service
          </button>
          <button 
             onClick={() => setActiveTermTab('PRIVACY')}
             className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${activeTermTab === 'PRIVACY' ? 'bg-white dark:bg-surface-card text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}
          >
             Privacy Policy
          </button>
       </div>
       
       <div className="flex-1 bg-white dark:bg-surface-card border border-gray-200 dark:border-white/5 rounded-2xl p-5 overflow-y-auto shadow-sm max-h-[60vh]">
          {activeTermTab === 'SERVICE' ? (
             <div className="space-y-4 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Article 1 (Purpose)</h4>
                <p>The purpose of these Terms and Conditions is to prescribe the rights, obligations, and responsibilities of the company and users in using the digital ticketing service (L.TICKET).</p>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-4">Article 2 (Ticket Purchase)</h4>
                <p>1. Users can purchase tickets through the methods provided by the company.<br/>2. The company may restrict purchases if the user has a history of fraudulent activity.</p>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-4">Article 3 (Refund Policy)</h4>
                <p>Refunds are available up to 2 hours before the performance. A cancellation fee may apply depending on the time of cancellation.</p>
             </div>
          ) : (
             <div className="space-y-4 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">1. Personal Information Collected</h4>
                <p>We collect the following personal information for service provision: Name, Phone Number, Email, Payment Information.</p>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-4">2. Purpose of Collection</h4>
                <p>- Ticket issuance and identification<br/>- Payment processing and settlement<br/>- Customer consultation and dispute resolution</p>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-4">3. Retention Period</h4>
                <p>Personal information is retained until the purpose of collection is achieved or as required by relevant laws.</p>
             </div>
          )}
       </div>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-background min-h-screen text-gray-900 dark:text-white font-sans animate-fade-in flex flex-col transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 px-4 h-16 flex items-center gap-4 transition-colors">
         <button onClick={handleBack} className="size-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
         </button>
         <h1 className="text-lg font-serif font-bold">{getHeaderTitle()}</h1>
      </header>

      <main className="flex-1 pb-20 overflow-y-auto no-scrollbar">
        {currentView === 'MENU' && renderMenu()}
        {currentView === 'NOTICE' && renderNotices()}
        {currentView === 'GUIDE' && renderGuide()}
        {currentView === 'FAQ' && renderFAQ()}
        {currentView === 'INQUIRY' && renderInquiry()}
        {currentView === 'TERMS' && renderTerms()}
      </main>
    </div>
  );
};
