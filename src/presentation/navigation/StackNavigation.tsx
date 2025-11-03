// src/presentation/navigation/StackNavigation.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import UsuariosScreen from '../screens/UsuariosScreen';
import EmpleadosScreen from '../screens/EmpleadosScreen';
import PackingListsScreen from '../screens/PackingListsScreen';
import ProductosScreen from '../screens/ProductosScreen';
import AsistenciaScreen from '../screens/AsistenciaScreen';
//import VisualizarAsistenciaScreen from '../screens/VisualizarAsistenciaScreen';
import RolesScreen from '../screens/RolesScreen';

// ===== Tipado de rutas =====
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Usuarios: undefined;
  Empleados: undefined;
  PackingLists: undefined;
  Productos: undefined;
  Asistencia: undefined;
  Roles: undefined;
  //VisualizarAsistencia: { month?: string } | undefined; // ej. '2025-11'
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigation() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTitleAlign: 'left',
        headerShadowVisible: false,
      }}
    >
      {/* Auth */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      {/* App */}
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Stack.Screen name="Usuarios" component={UsuariosScreen} options={{ title: 'Usuarios' }} />
      <Stack.Screen name="Empleados" component={EmpleadosScreen} options={{ title: 'Empleados' }} />
      <Stack.Screen name="PackingLists" component={PackingListsScreen} options={{ title: 'Packing Lists' }} />
      <Stack.Screen name="Productos" component={ProductosScreen} options={{ title: 'Productos' }} />
      <Stack.Screen name="Asistencia" component={AsistenciaScreen} options={{ title: 'Asistencia' }} />
    </Stack.Navigator>
  );
}
