
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TicketData } from '../types';
import { MY_TICKETS } from '../constants';

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
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  // Favorites Logic
  likedEvents: Set<string>;
  toggleLike: (eventId: string) => void;
  // Notifications Logic
  notifications: NotificationItem[];
  addNotification: (notification: NotificationItem) => void; // Added helper
  markAsRead: (id: string) => void;
  unreadCount: number;
  // Wallet Logic
  userBalance: number; 
  userPoints: number; 
  chargeBalance: (amount: number) => void;
  addPoints: (amount: number) => void;
  // Deep Logic: Seat Booking & Inquiries
  bookedSeats: Record<string, string[]>; // eventId -> ['A1', 'B2']
  bookSeat: (eventId: string, seatId: string) => boolean;
  inquiries: InquiryData[];
  addInquiry: (subject: string, content: string) => void;
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
    // Pre-fill some seats for realism
    const defaultSeats: Record<string, string[]> = {
      '1': ['B4', 'C5', 'D2'], // Phantom
    };
    return saved ? JSON.parse(saved) : defaultSeats;
  });

  const [inquiries, setInquiries] = useState<InquiryData[]>(() => {
    const saved = localStorage.getItem('lticket_inquiries');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Persistence Effects ---

  useEffect(() => localStorage.setItem('lticket_tickets', JSON.stringify(tickets)), [tickets]);
  useEffect(() => localStorage.setItem('lticket_loggedin', String(isLoggedIn)), [isLoggedIn]);
  useEffect(() => localStorage.setItem('lticket_likes', JSON.stringify(Array.from(likedEvents))), [likedEvents]);
  useEffect(() => localStorage.setItem('lticket_balance', String(userBalance)), [userBalance]);
  useEffect(() => localStorage.setItem('lticket_points', String(userPoints)), [userPoints]);
  useEffect(() => localStorage.setItem('lticket_notifications', JSON.stringify(notifications)), [notifications]);
  useEffect(() => localStorage.setItem('lticket_booked_seats', JSON.stringify(bookedSeats)), [bookedSeats]);
  useEffect(() => localStorage.setItem('lticket_inquiries', JSON.stringify(inquiries)), [inquiries]);

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

  const addNotification = (notification: NotificationItem) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const chargeBalance = (amount: number) => {
    setUserBalance(prev => prev + amount);
  };

  const addPoints = (amount: number) => {
    setUserPoints(prev => prev + amount);
  };

  const login = () => setIsLoggedIn(true);
  
  const logout = () => {
    setIsLoggedIn(false);
    // Optional: Clear local storage on logout? 
    // For now, we keep data persistence as requested.
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
      addPoints,
      bookedSeats,
      bookSeat,
      inquiries,
      addInquiry
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
