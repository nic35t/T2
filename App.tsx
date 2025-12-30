
import React, { useState, useEffect } from 'react';
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

  // Initialize History API handling
  useEffect(() => {
    // Initial push for the splash screen
    window.history.replaceState({ screen: AppScreen.SPLASH, data: null }, '');

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.screen) {
        setCurrentScreen(event.state.screen);
        setSelectedData(event.state.data);
      } else {
        // Fallback for initial state or empty history
        setCurrentScreen(AppScreen.HOME);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate: NavigationHandler = (screen, data) => {
    // Update local state
    if (data) setSelectedData(data);
    setCurrentScreen(screen);

    // Push new state to history but DO NOT change the URL.
    // This avoids SecurityError in sandboxed/cross-origin environments.
    // The state object itself is sufficient for handling back/forward navigation.
    window.history.pushState({ screen, data }, '');
  };

  const handleBack = () => {
    window.history.back();
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
        return <CustomerCenterScreen initialTab={selectedData?.initialTab} onBack={handleBack} />;
      case AppScreen.EVENT_DETAILS:
        if (selectedData?.category === 'voucher') {
          return <VoucherDetailsScreen 
                   event={selectedData || EVENTS[0]} 
                   onNavigate={handleNavigate} 
                   onBack={handleBack} 
                 />;
        }
        return <EventDetailsScreen 
                 event={selectedData || EVENTS[0]} 
                 onNavigate={handleNavigate} 
                 onBack={handleBack} 
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
                 onBack={handleBack} 
               />;
      case AppScreen.CAST_LIST:
        return <CastListScreen 
                 event={selectedData?.event || EVENTS[0]} 
                 onBack={handleBack} 
               />;
      case AppScreen.NOTIFICATIONS:
        return <NotificationsScreen onBack={handleBack} />;
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