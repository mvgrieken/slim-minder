import 'react-native-url-polyfill/auto';
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import RootNavigator from './src/navigation';
import { SessionProvider } from './src/session';
import { ToastProvider } from './src/toast';

// Import NativeWind styles
import './global.css';

export default function App() {
  return (
    <SessionProvider>
      <ToastProvider>
        <SafeAreaView className="flex-1 bg-white">
          <StatusBar barStyle="dark-content" />
          <RootNavigator />
        </SafeAreaView>
      </ToastProvider>
    </SessionProvider>
  );
}
