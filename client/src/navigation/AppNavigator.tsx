import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import FinanceScreen from '../screens/FinanceScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          height: Platform.OS === 'ios' ? 88 : 72,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 8,
          elevation: 12,
          shadowColor: '#1E3A8A',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarIcon: ({ focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'grid';

          if (route.name === 'Home') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Schedule') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Chatbot') {
            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          } else if (route.name === 'Finance') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return (
            <View
              className={`w-12 h-7 rounded-full items-center justify-center ${
                focused ? 'bg-blue-600' : 'bg-transparent'
              }`}
            >
              <Ionicons
                name={iconName}
                size={18}
                color={focused ? '#FFFFFF' : '#64748B'}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Beranda' }} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} options={{ tabBarLabel: 'Jadwal' }} />
      <Tab.Screen name="Chatbot" component={ChatbotScreen} options={{ tabBarLabel: 'Asisten' }} />
      <Tab.Screen name="Finance" component={FinanceScreen} options={{ tabBarLabel: 'Keuangan' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: 'Setting' }} />
    </Tab.Navigator>
  );
}