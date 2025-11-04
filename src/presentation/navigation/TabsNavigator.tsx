// src/presentation/navigation/TabsNavigator.tsx
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import UsuariosScreen from '../screens/UsuariosScreen';
import EmpleadosScreen from '../screens/EmpleadosScreen';
import PackingListsScreen from '../screens/PackingListsScreen';
import ProductosScreen from '../screens/ProductosScreen';
import AsistenciaScreen from '../screens/AsistenciaScreen';

export type TopTabsParamList = {
  Usuarios: undefined;
  Empleados: undefined;
  Packing: undefined;
  Productos: undefined;
  Asistencia: undefined;
};

const TopTab = createMaterialTopTabNavigator<TopTabsParamList>();

export default function TabsNavigator() {
  const isDark = useColorScheme() === 'dark';
  const insets = useSafeAreaInsets();

  const active = isDark ? '#9AB6FF' : '#4C6EF5';
  const inactive = isDark ? '#A0A7B2' : '#6B7280';
  const bg = isDark ? '#0E0F12' : '#FFFFFF';
  const border = isDark ? '#1F2228' : '#E5E7EB';

  return (
    <TopTab.Navigator
      initialRouteName="Usuarios"
      // SOLO props válidas:
      style={{ paddingTop: insets.top, backgroundColor: bg }}
      screenOptions={{
        swipeEnabled: true,
        lazy: true,
        tabBarScrollEnabled: true,
        tabBarActiveTintColor: active,
        tabBarInactiveTintColor: inactive,
        tabBarPressColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        tabBarIndicatorStyle: { backgroundColor: active, height: 3, borderRadius: 3 },
        tabBarItemStyle: { width: 'auto' }, // ancho según el texto
        tabBarStyle: {
          backgroundColor: bg,
          borderBottomWidth: 1,
          borderBottomColor: border,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontWeight: '700',
          textTransform: 'none',
          fontSize: 13,
          marginHorizontal: 8,
        },
      }}
    >
      <TopTab.Screen name="Usuarios" component={UsuariosScreen} options={{ title: 'Usuarios' }} />
      <TopTab.Screen name="Empleados" component={EmpleadosScreen} options={{ title: 'Empleados' }} />
      <TopTab.Screen name="Packing" component={PackingListsScreen} options={{ title: 'Packing Lists' }} />
      <TopTab.Screen name="Productos" component={ProductosScreen} options={{ title: 'Productos' }} />
      <TopTab.Screen name="Asistencia" component={AsistenciaScreen} options={{ title: 'Asistencia' }} />
    </TopTab.Navigator>
  );
}
