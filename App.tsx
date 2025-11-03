import 'react-native-gesture-handler';
import React from 'react';
import { useColorScheme, StatusBar } from 'react-native';
import { NavigationContainer, DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';

// Usa solo uno:
//import DrawerNavigation from './src/presentation/navigation/DrawerNavigation';
import StackNavigation from './src/presentation/navigation/StackNavigation';
// import BottomTabsNavigator from './src/presentation/navigation/BottomTabsNavigator';

export default function App() {
  const scheme = useColorScheme();
  const theme: Theme = scheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={theme}>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
      <StackNavigation/>
    </NavigationContainer>
  );
}
