
import React, { useState } from 'react';
import { AppScreen, EventData, NavigationHandler } from './types';
import { EVENTS } from './constants';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CuratedScreen } from './screens/CuratedScreen';
import { TicketsScreen } from './screens/TicketsScreen';
import { MyScreen } from './screens/MyScreen';
import { CustomerCenterScreen } from './screens/CustomerCenterScreen';
import { EventDetailsScreen } from './screens/EventDetailsScreen';
import { BookingScreen } from './screens/BookingScreen';
import { BookingSuccessScreen } from './screens/BookingSuccessScreen';
import { TicketQRScreen } from './screens/TicketQRScreen';
import { CastListScreen } from './screens/CastListScreen';
import { VoucherDetailsScreen } from './screens/VoucherDetailsScreen';
import { VoucherPurchaseScreen } from './screens/VoucherPurchaseScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { BottomNav } from './components/BottomNav';
import { AppProvider } from './context/AppContext';

const AppContent: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [selectedData, setSelectedData] = useState<any>(null);

  const handleNavigate: NavigationHandler = (screen, data) => {
    if (data) setSelectedData(data);
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.SPLASH:
        return <SplashScreen onComplete={() => handleNavigate(AppScreen.ONBOARDING)} />;
      case AppScreen.ONBOARDING:
        return <OnboardingScreen onComplete={() => handleNavigate(AppScreen.HOME)} />;
      case AppScreen.HOME:
        return <HomeScreen onNavigate={handleNavigate} />;
      case AppScreen.SEARCH:
        return <CuratedScreen onNavigate={handleNavigate} />;
      case AppScreen.TICKETS:
        return <TicketsScreen onNavigate={handleNavigate} />;
      case AppScreen.MY: // Renamed from PROFILE
        return <MyScreen onNavigate={handleNavigate} />;
      case AppScreen.CUSTOMER_CENTER: 
        return <CustomerCenterScreen initialTab={selectedData?.initialTab} onBack={() => handleNavigate(AppScreen.MY)} />;
      case AppScreen.EVENT_DETAILS:
        if (selectedData?.category === 'voucher') {
          return <VoucherDetailsScreen 
                   event={selectedData || EVENTS[0]} 
                   onNavigate={handleNavigate} 
                   onBack={() => handleNavigate(AppScreen.HOME)} 
                 />;
        }
        return <EventDetailsScreen 
                 event={selectedData || EVENTS[0]} 
                 onNavigate={handleNavigate} 
                 onBack={() => handleNavigate(AppScreen.HOME)} 
               />;
      case AppScreen.BOOKING:
        if (selectedData?.category === 'voucher') {
          return <VoucherPurchaseScreen 
                   event={selectedData || EVENTS[0]} 
                   onNavigate={handleNavigate} 
                   onBack={() => handleNavigate(AppScreen.EVENT_DETAILS, selectedData)} 
                 />;
        }
        return <BookingScreen 
                 event={selectedData || EVENTS[0]} 
                 onNavigate={handleNavigate} 
                 onBack={() => handleNavigate(AppScreen.EVENT_DETAILS, selectedData)} 
               />;
      case AppScreen.BOOKING_SUCCESS:
        return <BookingSuccessScreen 
                 data={selectedData} 
                 onNavigate={handleNavigate} 
               />;
      case AppScreen.TICKET_QR:
        return <TicketQRScreen 
                 ticket={selectedData} 
                 onNavigate={handleNavigate} 
                 onBack={() => handleNavigate(AppScreen.TICKETS)} 
               />;
      case AppScreen.CAST_LIST:
        return <CastListScreen 
                 event={selectedData?.event || EVENTS[0]} 
                 onBack={() => handleNavigate(AppScreen.EVENT_DETAILS, selectedData?.event)} 
               />;
      case AppScreen.NOTIFICATIONS:
        return <NotificationsScreen onBack={() => handleNavigate(AppScreen.TICKETS)} />;
      case AppScreen.LOGIN:
         return <HomeScreen onNavigate={handleNavigate} />;
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  const hideBottomNav = [
    AppScreen.SPLASH, 
    AppScreen.ONBOARDING, 
    AppScreen.LOGIN, 
    AppScreen.EVENT_DETAILS,
    AppScreen.BOOKING,
    AppScreen.BOOKING_SUCCESS,
    AppScreen.TICKET_QR,
    AppScreen.CAST_LIST,
    AppScreen.NOTIFICATIONS,
    AppScreen.CUSTOMER_CENTER,
    AppScreen.VOUCHER_DETAILS,
    AppScreen.VOUCHER_PURCHASE
  ].includes(currentScreen);

  return (
    <div className="relative min-h-screen bg-[#0F0F12] text-white font-sans overflow-x-hidden">
      <div className="mx-auto w-full min-h-screen relative">
        {renderScreen()}
      </div>
      
      {!hideBottomNav && (
        <BottomNav 
          currentScreen={currentScreen} 
          onNavigate={(screen) => handleNavigate(screen)} 
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
