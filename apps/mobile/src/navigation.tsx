import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from './screens/Dashboard';
import TransactionsScreen from './screens/Transactions';
import CategoriesScreen from './screens/Categories';
import AIChatScreen from './screens/AIChat';
import BankAccountsScreen from './screens/BankAccounts';
import AuthScreen from './screens/Auth';
import { useSession } from './session';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Transacties" component={TransactionsScreen} />
      <Tab.Screen name="Categorieën" component={CategoriesScreen} />
    </Tab.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="AIChat" component={AIChatScreen} />
      <Stack.Screen name="BankAccounts" component={BankAccountsScreen} />
    </Stack.Navigator>
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
          <Stack.Screen name="App" component={AppStack} />
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
