import 'react-native-url-polyfill/auto';
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import RootNavigator from './src/navigation';
import { SessionProvider } from './src/session';
import { ToastProvider } from './src/toast';

export default function App() {
  return (
    <SessionProvider>
      <ToastProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
          <StatusBar barStyle="dark-content" />
          <RootNavigator />
        </SafeAreaView>
      </ToastProvider>
    </SessionProvider>
  );
}
