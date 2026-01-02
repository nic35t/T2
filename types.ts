
export interface EventData {
  id: string;
  category: 'performance' | 'voucher';
  title: string;
  location: string;
  date: string;
  time?: string;
  price: number;
  originalPrice?: number;
  image: string;
  tags: string[];
  status?: 'selling-fast' | 'limited-run' | 'sold-out' | 'new-arrival';
  description?: string;
  featured?: boolean;
}

export interface TicketData {
  id: string;
  eventId: string;
  category: 'performance' | 'voucher';
  title: string;
  location?: string;
  date?: string;
  fullDate?: string;
  time?: string;
  seats?: string;
  balance?: number;
  image: string;
  status: 'live' | 'upcoming' | 'past' | 'canceled' | 'active';
  type: string;
  qrCode?: string;
  count?: number;
  // New fields for gifting history
  isGift?: boolean;
  recipientName?: string;
}

export interface ReviewData {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1~5
  date: string;
  content: string;
  images?: string[];
  likes: number;
}

export interface NoticeData {
  id: string;
  title: string;
  category: 'NOTICE' | 'EVENT' | 'WINNER';
  date: string;
  content: string;
  isImportant?: boolean;
}

export interface SeatGrade {
  grade: 'VIP' | 'R' | 'S';
  priceModifier: number; // Additive value
  color: string; // Tailwind class for background
  borderColor: string;
}

export enum AppScreen {
  SPLASH = 'SPLASH',
  ONBOARDING = 'ONBOARDING',
  LOGIN = 'LOGIN',
  HOME = 'HOME',
  SEARCH = 'SEARCH', // Curated List
  TICKETS = 'TICKETS',
  MY = 'MY', // Renamed from PROFILE
  EVENT_DETAILS = 'EVENT_DETAILS',
  BOOKING = 'BOOKING',
  BOOKING_SUCCESS = 'BOOKING_SUCCESS', // New
  TICKET_QR = 'TICKET_QR',
  CAST_LIST = 'CAST_LIST',
  NOTIFICATIONS = 'NOTIFICATIONS',
  CUSTOMER_CENTER = 'CUSTOMER_CENTER', // New
  VOUCHER_DETAILS = 'VOUCHER_DETAILS',
  VOUCHER_PURCHASE = 'VOUCHER_PURCHASE',
}

export type NavigationHandler = (screen: AppScreen, data?: any) => void;
