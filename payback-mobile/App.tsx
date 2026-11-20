import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from './src/store/useAuthStore';
import { SplashScreen } from './src/features/splash/SplashScreen';
import { OnboardingScreen } from './src/features/onboarding/OnboardingScreen';
import { LoginScreen } from './src/features/auth/LoginScreen';
import { RegisterScreen } from './src/features/auth/RegisterScreen';
import { DashboardScreen } from './src/features/dashboard/DashboardScreen';
import { TransactionsScreen } from './src/features/transactions/TransactionsScreen';
import { CardsScreen } from './src/features/cards/CardsScreen';
import { BillPaymentsScreen } from './src/features/payments/BillPaymentsScreen';
import { TransferScreen } from './src/features/transfers/TransferScreen';
import { ProfileScreen } from './src/features/profile/ProfileScreen';
import { NotificationsScreen } from './src/features/notifications/NotificationsScreen';
import { SupportScreen } from './src/features/support/SupportScreen';
import { BottomTabBar, TabScreenType } from './src/components/navigation/BottomTabBar';

type AppFlow =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'register'
  | 'main'
  | 'transfers'
  | 'bills'
  | 'notifications'
  | 'support';

export default function App() {
  const [currentFlow, setCurrentFlow] = useState<AppFlow>('splash');
  const [activeTab, setActiveTab] = useState<TabScreenType>('home');
  const { isAuthenticated, logout } = useAuthStore();

  // Screen transitions
  const handleSplashDone = () => {
    if (isAuthenticated) {
      setCurrentFlow('main');
    } else {
      setCurrentFlow('onboarding');
    }
  };

  const handleOnboardingComplete = () => {
    setCurrentFlow('login');
  };

  const handleAuthSuccess = () => {
    setCurrentFlow('main');
  };

  const handleLogout = () => {
    logout();
    setCurrentFlow('login');
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar style="dark" />

      {/* 1. Splash Screen */}
      {currentFlow === 'splash' && <SplashScreen onFinish={handleSplashDone} />}

      {/* 2. Onboarding Screen */}
      {currentFlow === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}

      {/* 3. Login Screen */}
      {currentFlow === 'login' && (
        <LoginScreen
          onLoginSuccess={handleAuthSuccess}
          onNavigateToRegister={() => setCurrentFlow('register')}
        />
      )}

      {/* 4. Registration Screen */}
      {currentFlow === 'register' && (
        <RegisterScreen
          onRegisterSuccess={handleAuthSuccess}
          onNavigateToLogin={() => setCurrentFlow('login')}
        />
      )}

      {/* 5-8. Main App with Bottom Navigation */}
      {currentFlow === 'main' && (
        <View style={styles.mainLayout}>
          <View style={styles.screenContent}>
            {activeTab === 'home' && (
              <DashboardScreen
                onNavigateToTransfers={() => setCurrentFlow('transfers')}
                onNavigateToBills={() => setCurrentFlow('bills')}
                onNavigateToCards={() => setActiveTab('cards')}
                onNavigateToTransactions={() => setActiveTab('transactions')}
                onNavigateToNotifications={() => setCurrentFlow('notifications')}
                onNavigateToProfile={() => setActiveTab('profile')}
              />
            )}
            {activeTab === 'cards' && (
              <CardsScreen onGoBack={() => setActiveTab('home')} />
            )}
            {activeTab === 'transactions' && (
              <TransactionsScreen onGoBack={() => setActiveTab('home')} />
            )}
            {activeTab === 'profile' && (
              <ProfileScreen
                onLogout={handleLogout}
                onNavigateToNotifications={() => setCurrentFlow('notifications')}
                onNavigateToSupport={() => setCurrentFlow('support')}
              />
            )}
          </View>

          {/* Bottom Tabs */}
          <BottomTabBar currentTab={activeTab} onSelectTab={setActiveTab} />
        </View>
      )}

      {/* Modal / Deep Screens */}
      {currentFlow === 'transfers' && (
        <TransferScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {currentFlow === 'bills' && (
        <BillPaymentsScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {currentFlow === 'notifications' && (
        <NotificationsScreen onGoBack={() => setCurrentFlow('main')} />
      )}

      {currentFlow === 'support' && (
        <SupportScreen onGoBack={() => setCurrentFlow('main')} />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mainLayout: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
  },
});
