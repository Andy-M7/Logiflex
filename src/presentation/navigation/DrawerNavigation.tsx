
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import StackNavigation from './StackNavigation';
import BottomTabsNavigator from './BottomTabsNavigator';

export type DrawerParamList = {
  Inicio: undefined;
  Modulos: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Inicio" component={StackNavigation} options={{ title: 'Inicio' }} />
    </Drawer.Navigator>
  );
}
