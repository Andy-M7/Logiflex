// src/presentation/navigation/BottomTabsNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
  const isDark = useColorScheme() === 'dark';

  const active = isDark ? '#9AB6FF' : '#4C6EF5';
  const inactive = isDark ? '#8D98A6' : '#9AA1AC';
  const bg = isDark ? '#0E0F12' : '#FFFFFF';
  const border = isDark ? '#1F2228' : '#E5E7EB';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarShowLabel: true,
        tabBarActiveTintColor: active,
        tabBarInactiveTintColor: inactive,
        tabBarStyle: {
          backgroundColor: bg,
          borderTopColor: border,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 6,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const s = size + 2;

          switch (route.name) {
            case 'UsuariosTab':
              return (
                <MaterialCommunityIcons
                  name={focused ? 'account-group' : 'account-group-outline'}
                  size={s}
                  color={color}
                />
              );
            case 'EmpleadosTab':
              return (
                <MaterialCommunityIcons
                  name={focused ? 'account-tie' : 'account-tie-outline'}
                  size={s}
                  color={color}
                />
              );
            case 'PackingTab':
              return (
                <MaterialCommunityIcons
                  name={focused ? 'file-document' : 'file-document-outline'}
                  size={s}
                  color={color}
                />
              );
            case 'ProductosTab':
              return (
                <MaterialCommunityIcons
                  name={focused ? 'cube' : 'cube-outline'}
                  size={s}
                  color={color}
                />
              );
            default:
              return null;
          }
        },
      })}
    >
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
