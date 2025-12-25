
import React, { createContext, useContext, useState, ReactNode } from 'react';
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
  markAsRead: (id: string) => void;
  unreadCount: number;
  // Wallet Logic
  userBalance: number; // Cash Balance
  userPoints: number; // L-Point
  chargeBalance: (amount: number) => void;
  addPoints: (amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<TicketData[]>(MY_TICKETS);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set());
  const [userBalance, setUserBalance] = useState(0);
  const [userPoints, setUserPoints] = useState(2450); // Starting points
  
  // Mock Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', title: 'Welcome Gift', message: 'You received a 10% discount coupon for your first booking.', time: 'Just now', read: false, type: 'success' },
    { id: '2', title: 'Ticket Alert', message: 'The Phantom of the Opera is selling fast! Book now.', time: '2 hours ago', read: false, type: 'alert' },
    { id: '3', title: 'System Update', message: 'L.TICKET v2.4.0 is now live with enhanced wallet features.', time: '1 day ago', read: true, type: 'info' },
  ]);

  const addTicket = (ticket: TicketData) => {
    setTickets((prev) => [ticket, ...prev]);
    // Add a notification for the purchase
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

  const chargeBalance = (amount: number) => {
    setUserBalance(prev => prev + amount);
  };

  const addPoints = (amount: number) => {
    setUserPoints(prev => prev + amount);
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
      markAsRead,
      unreadCount,
      userBalance,
      userPoints,
      chargeBalance,
      addPoints
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
