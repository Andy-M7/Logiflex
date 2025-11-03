// src/presentation/navigation/BottomTabsNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import UsuariosScreen from '../screens/UsuariosScreen';
import EmpleadosScreen from '../screens/EmpleadosScreen';
import PackingListsScreen from '../screens/PackingListsScreen';
import ProductosScreen from '../screens/ProductosScreen';


export type BottomTabsParamList = {
  UsuariosTab: undefined;
  EmpleadosTab: undefined;
  PackingTab: undefined;
  ProductosTab: undefined;
};

const Tab = createBottomTabNavigator<BottomTabsParamList>();

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen
        name="UsuariosTab"
        component={UsuariosScreen as unknown as React.ComponentType<any>}
        options={{ title: 'Usuarios' }}
      />
      <Tab.Screen
        name="EmpleadosTab"
        component={EmpleadosScreen as unknown as React.ComponentType<any>}
        options={{ title: 'Empleados' }}
      />
      <Tab.Screen
        name="PackingTab"
        component={PackingListsScreen as unknown as React.ComponentType<any>}
        options={{ title: 'Packing' }}
      />
      <Tab.Screen
        name="ProductosTab"
        component={ProductosScreen as unknown as React.ComponentType<any>}
        options={{ title: 'Productos' }}
      />

    </Tab.Navigator>
  );
}
