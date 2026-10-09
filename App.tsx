import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { SplashScreen } from './src/screens/splash/SplashScreen';
import { getOnboardingCompleted } from './src/utils/onboardingStorage';

const linking = {
  prefixes: [
    'http://localhost:8081',
    'http://127.0.0.1:8081',
    'megamart://',
    'zestora://',
  ],
  config: {
    screens: {
      MainTabs: {
        screens: {
          HomeTab: '',
          ExploreTab: 'explore',
          CartTab: 'cart',
          OrdersTab: 'orders',
          ProfileTab: 'profile',
        },
      },
      ProductDetail: 'product/:productId',
      ProductList: 'category/:category',
      CategoryDetail: 'category-detail/:category',
      ShoppingCart: 'shopping-cart',
      FoodHome: 'food',
      FoodCart: 'food-cart',
      RestaurantDetail: 'restaurant/:restaurantId',
      Checkout: 'checkout',
      AddressSelection: 'address',
      MockPayment: 'payment',
      PaymentSuccess: 'payment-success',
      PaymentFailed: 'payment-failed',
      MyOrders: 'my-orders',
      OrderDetail: 'order/:orderId',
      TrackOrder: 'track/:orderId',
      Wishlist: 'wishlist',
      Notifications: 'notifications',
      Help: 'help',
      Settings: 'settings',
      Offers: 'offers',
      GlobalSearch: 'search',
      PhoneAuth: 'auth/phone',
      OtpVerify: 'auth/otp',
    },
  },
};

export default function App() {
  // Always shows Splash for ~4.5 seconds on every fresh launch / browser refresh
  const [showSplash, setShowSplash] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    getOnboardingCompleted().then((completed) => {
      setHasCompletedOnboarding(completed);
    });
  }, []);

  if (showSplash) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <SplashScreen
          onFinish={async () => {
            const completed = await getOnboardingCompleted();
            setHasCompletedOnboarding(completed);
            setShowSplash(false);
          }}
        />
      </SafeAreaProvider>
    );
  }

  const isCompleted = hasCompletedOnboarding === true;

  // While onboarding is still pending, deep-linking mapping "/" to MainTabs
  // would override initialRouteName on Web. Keep linking disabled until onboarding is completed.
  return (
    <SafeAreaProvider>
      <NavigationContainer linking={isCompleted ? (linking as any) : undefined}>
        <StatusBar style="auto" />
        <RootNavigator
          initialRouteName={isCompleted ? 'MainTabs' : 'Onboarding'}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
