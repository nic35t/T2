
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TicketData, ReviewData, CouponData } from '../types';
import { MY_TICKETS, IMAGES } from '../constants';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}

export interface InquiryData {
  id: string;
  subject: string;
  content: string;
  date: string;
  status: 'PENDING' | 'ANSWERED';
  answer?: string;
}

interface AppContextType {
  tickets: TicketData[];
  addTicket: (ticket: TicketData) => void;
  cancelTicket: (ticketId: string) => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  // Favorites Logic
  likedEvents: Set<string>;
  toggleLike: (eventId: string) => void;
  // Notifications Logic
  notifications: NotificationItem[];
  addNotification: (notification: NotificationItem) => void; 
  markAsRead: (id: string) => void;
  unreadCount: number;
  // Wallet Logic
  userBalance: number; 
  userPoints: number; 
  chargeBalance: (amount: number) => void;
  useBalance: (amount: number) => void; 
  addPoints: (amount: number) => void;
  usePoints: (amount: number) => void;
  // Deep Logic: Seat Booking & Inquiries
  bookedSeats: Record<string, string[]>; 
  bookSeat: (eventId: string, seatId: string) => boolean;
  inquiries: InquiryData[];
  addInquiry: (subject: string, content: string) => void;
  // Theme Logic
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  // Reviews & Coupons
  myReviews: ReviewData[];
  coupons: CouponData[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- State Initialization with LocalStorage ---
  
  const [tickets, setTickets] = useState<TicketData[]>(() => {
    const saved = localStorage.getItem('lticket_tickets');
    return saved ? JSON.parse(saved) : MY_TICKETS;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('lticket_loggedin') === 'true';
  });

  const [likedEvents, setLikedEvents] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('lticket_likes');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [userBalance, setUserBalance] = useState(() => {
    const saved = localStorage.getItem('lticket_balance');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [userPoints, setUserPoints] = useState(() => {
    const saved = localStorage.getItem('lticket_points');
    return saved ? parseInt(saved, 10) : 2450;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('lticket_notifications');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Welcome Gift', message: 'You received a 10% discount coupon for your first booking.', time: 'Just now', read: false, type: 'success' },
      { id: '2', title: 'Ticket Alert', message: 'The Phantom of the Opera is selling fast! Book now.', time: '2 hours ago', read: false, type: 'alert' },
      { id: '3', title: 'System Update', message: 'L.TICKET v2.4.0 is now live with enhanced wallet features.', time: '1 day ago', read: true, type: 'info' },
    ];
  });

  const [bookedSeats, setBookedSeats] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('lticket_booked_seats');
    const defaultSeats: Record<string, string[]> = {
      '1': ['B4', 'C5', 'D2'], // Phantom
    };
    return saved ? JSON.parse(saved) : defaultSeats;
  });

  const [inquiries, setInquiries] = useState<InquiryData[]>(() => {
    const saved = localStorage.getItem('lticket_inquiries');
    return saved ? JSON.parse(saved) : [];
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('lticket_theme');
    // Default to 'dark' if not present
    return saved ? (saved === 'dark' ? 'dark' : 'light') : 'dark';
  });

  // Mock Data for Reviews and Coupons (Not persisted for prototype simplicity)
  const [myReviews] = useState<ReviewData[]>([
    { 
      id: 'mr1', eventId: '1', eventTitle: 'The Phantom of the Opera', eventImage: IMAGES.phantom, 
      userId: 'me', userName: 'Alex Thespian', rating: 5, date: '2023.10.25', 
      content: 'The stage production was magnificent. The falling chandelier scene gave me chills!', likes: 24 
    },
    { 
      id: 'mr2', eventId: '2', eventTitle: 'Chicago', eventImage: IMAGES.chicago, 
      userId: 'me', userName: 'Alex Thespian', rating: 4, date: '2023.09.15', 
      content: 'Great jazz numbers, but the seating view was slightly obstructed. Still a must-watch.', likes: 10 
    }
  ]);

  const [coupons] = useState<CouponData[]>([
    { 
      id: 'c1', title: 'New Member Welcome', description: '10% off for your first booking', 
      amount: 10, unit: 'PERCENT', validUntil: '2024.12.31', status: 'active' 
    },
    { 
      id: 'c2', title: 'Birthday Special', description: '5,000 KRW discount on any performance', 
      amount: 5000, unit: 'KRW', minPurchase: 50000, validUntil: '2023.12.31', status: 'active' 
    },
    { 
      id: 'c3', title: 'Early Bird', description: '20% off for reservations 2 months in advance', 
      amount: 20, unit: 'PERCENT', validUntil: '2023.09.30', status: 'expired' 
    }
  ]);

  // --- Persistence Effects ---

  useEffect(() => localStorage.setItem('lticket_tickets', JSON.stringify(tickets)), [tickets]);
  useEffect(() => localStorage.setItem('lticket_loggedin', String(isLoggedIn)), [isLoggedIn]);
  useEffect(() => localStorage.setItem('lticket_likes', JSON.stringify(Array.from(likedEvents))), [likedEvents]);
  useEffect(() => localStorage.setItem('lticket_balance', String(userBalance)), [userBalance]);
  useEffect(() => localStorage.setItem('lticket_points', String(userPoints)), [userPoints]);
  useEffect(() => localStorage.setItem('lticket_notifications', JSON.stringify(notifications)), [notifications]);
  useEffect(() => localStorage.setItem('lticket_booked_seats', JSON.stringify(bookedSeats)), [bookedSeats]);
  useEffect(() => localStorage.setItem('lticket_inquiries', JSON.stringify(inquiries)), [inquiries]);

  // Theme Effect
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('lticket_theme', theme);
  }, [theme]);

  // --- Actions ---

  const addTicket = (ticket: TicketData) => {
    setTickets((prev) => [ticket, ...prev]);
    const newNotif: NotificationItem = {
      id: `n-${Date.now()}`,
      title: 'Booking Confirmed',
      message: ticket.category === 'voucher' 
        ? `Voucher charged: ${new Intl.NumberFormat('ko-KR').format(ticket.balance || 0)} KRW`
        : `Your ticket for ${ticket.title} has been successfully issued.`,
      time: 'Just now',
      read: false,
      type: 'success'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const cancelTicket = (ticketId: string) => {
    const ticket = tickets.find(t => t.id === ticketId);
    setTickets((prev) => 
      prev.map(t => t.id === ticketId ? { ...t, status: 'canceled' } : t)
    );
    
    // Simulate Refund calculation
    const refundAmount = ticket?.balance || (ticket?.category === 'voucher' ? 50000 : 120000); 

    const newNotif: NotificationItem = {
        id: `n-${Date.now()}`,
        title: 'Gift Canceled',
        message: `Gift to ${ticket?.recipientName || 'friend'} canceled. Refund: ${new Intl.NumberFormat('ko-KR').format(refundAmount)} KRW.`,
        time: 'Just now',
        read: false,
        type: 'info'
    };
    setNotifications(prev => [newNotif, ...prev]);
    setUserBalance(prev => prev + refundAmount);
  };

  const addNotification = (notification: NotificationItem) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const chargeBalance = (amount: number) => {
    setUserBalance(prev => prev + amount);
  };

  const useBalance = (amount: number) => {
    setUserBalance(prev => Math.max(0, prev - amount));
  };

  const addPoints = (amount: number) => {
    setUserPoints(prev => prev + amount);
  };

  const usePoints = (amount: number) => {
    setUserPoints(prev => Math.max(0, prev - amount));
  };

  const login = () => setIsLoggedIn(true);
  
  const logout = () => {
    setIsLoggedIn(false);
  };

  const toggleLike = (eventId: string) => {
    setLikedEvents(prev => {
      const next = new Set(prev);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return next;
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // --- Deep Logic Functions ---

  const bookSeat = (eventId: string, seatId: string): boolean => {
    const currentTaken = bookedSeats[eventId] || [];
    if (currentTaken.includes(seatId)) return false;

    setBookedSeats(prev => ({
      ...prev,
      [eventId]: [...(prev[eventId] || []), seatId]
    }));
    return true;
  };

  const addInquiry = (subject: string, content: string) => {
    const newInquiry: InquiryData = {
      id: `inq-${Date.now()}`,
      subject,
      content,
      date: new Date().toLocaleDateString('ko-KR'),
      status: 'PENDING'
    };
    setInquiries(prev => [newInquiry, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{ 
      tickets, 
      addTicket, 
      cancelTicket,
      isLoggedIn, 
      login, 
      logout,
      likedEvents,
      toggleLike,
      notifications,
      addNotification,
      markAsRead,
      unreadCount,
      userBalance,
      userPoints,
      chargeBalance,
      useBalance,
      addPoints,
      usePoints,
      bookedSeats,
      bookSeat,
      inquiries,
      addInquiry,
      theme,
      toggleTheme,
      myReviews,
      coupons
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
