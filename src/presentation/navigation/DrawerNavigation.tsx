
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import StackNavigation from './StackNavigation';

export type DrawerParamList = {
  Inicio: undefined;
   Usuarios: undefined;
  Empleados: undefined;
  PackingLists: undefined;
  Productos: undefined;
  Asistencia: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigation() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Inicio" component={StackNavigation} options={{ title: 'Inicio' }} />
      <Drawer.Screen name="Usuarios" component={StackNavigation} options={{ title: 'Usuarios' }} />
      <Drawer.Screen name="Empleados" component={StackNavigation} options={{ title: 'Empleados' }} />
      <Drawer.Screen name="PackingLists" component={StackNavigation} options={{ title: 'Packing Lists' }} />
      <Drawer.Screen name="Productos" component={StackNavigation} options={{ title: 'Productos' }} />
      <Drawer.Screen name="Asistencia" component={StackNavigation} options={{ title: 'Asistencia' }} />
    </Drawer.Navigator>
  );
}
