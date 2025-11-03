import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
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
};

const TopTab = createMaterialTopTabNavigator<TopTabsParamList>();

export default function TabsNavigator() {
  return (
    <TopTab.Navigator>
      <TopTab.Screen name="Usuarios" component={UsuariosScreen} />
      <TopTab.Screen name="Empleados" component={EmpleadosScreen} />
      <TopTab.Screen name="Packing" component={PackingListsScreen} />
      <TopTab.Screen name="Productos" component={ProductosScreen} />
      <TopTab.Screen name="Asistencia" component={AsistenciaScreen} />
    </TopTab.Navigator>
  );
}
