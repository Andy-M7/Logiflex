import 'react-native-gesture-handler';
import React from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';
import { StackNavigation } from './src/presentation/navigation';


// Usa solo uno:
//import DrawerNavigation from './src/presentation/navigation/DrawerNavigation';
//import StackNavigation from './src/presentation/navigation/StackNavigation';
//import BottomTabsNavigator from './src/presentation/navigation/BottomTabsNavigator';
//import { StackNavigation } from './src/presentation/navigation';
//import { TabBarIndicator } from 'react-native-tab-view';
//import TabsNavigator from './src/presentation/navigation/TabsNavigator';

export default function App() {
  const scheme = useColorScheme();
  const theme: Theme = scheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
        <StackNavigation/>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
