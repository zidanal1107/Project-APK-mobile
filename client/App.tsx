import "./global.css";
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/context/AppContext';

export default function App() {
  return (
    <SafeAreaProvider>
      {/* 2. AppProvider HARUS membungkus NavigationContainer di posisi paling luar */}
      <AppProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}