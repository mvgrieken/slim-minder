import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from './screens/Dashboard';
import TransactionsScreen from './screens/Transactions';
import CategoriesScreen from './screens/Categories';
import GoalsScreen from './screens/Goals';
import BadgesScreen from './screens/Badges';
import AIChatScreen from './screens/AIChat';
import AuthScreen from './screens/Auth';
import { useSession } from './session';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: '#e5e7eb',
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📊</Text>,
          tabBarLabel: 'Dashboard'
        }}
      />
      <Tab.Screen 
        name="Transacties" 
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💳</Text>,
        }}
      />
      <Tab.Screen 
        name="Doelen" 
        component={GoalsScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🎯</Text>,
        }}
      />
      <Tab.Screen 
        name="Badges" 
        component={BadgesScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏆</Text>,
        }}
      />
      <Tab.Screen 
        name="AI Coach" 
        component={AIChatScreen}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🤖</Text>,
          tabBarLabel: 'Coach'
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { userId, loading } = useSession();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {loading ? (
          <Stack.Screen name="Loading" component={() => null} />
        ) : userId ? (
          <Stack.Screen name="App" component={Tabs} />
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
