import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Empleado from '../screens/Empleado';
import EmpleadoForm from '../screens/EmpleadoForm';

export type RootStackParamList = {
  Empleado: undefined;
  EmpleadoForm:
    | { mode: 'create' }
    | { mode: 'edit'; id: number };

// Screens
import HomeScreen from '../screens/HomeScreen';
import UsuariosScreen from '../screens/UsuariosScreen';
import RolesScreen from '../screens/RolesScreen';
import EmpleadosScreen from '../screens/EmpleadosScreen';
import PackingListsScreen from '../screens/PackingListsScreen';
import ProductosScreen from '../screens/ProductosScreen';
import AsistenciaScreen from '../screens/AsistenciaScreen';

export type RootStackParamList = {
  Home: undefined;
  Usuarios: undefined;
  Roles: undefined;
  Empleados: undefined;
  PackingLists: undefined;
  Productos: undefined;
  Asistencia: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen name="Empleado" component={Empleado} options={{ title: 'Empleados' }} />
      <Stack.Screen
        name="EmpleadoForm"
        component={EmpleadoForm}
        options={({ route }) => ({
          title:
            'mode' in route.params && route.params.mode === 'edit'
              ? 'Editar empleado'
              : 'Nuevo empleado',
        })}
      />
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{ headerLargeTitle: true, headerTitleStyle: { fontWeight: '600' } }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'LogiFlex' }} />
      <Stack.Screen name="Usuarios" component={UsuariosScreen} options={{ title: 'Usuarios' }} />
      <Stack.Screen name="Roles" component={RolesScreen} options={{ title: 'Roles' }} />
      <Stack.Screen name="Empleados" component={EmpleadosScreen} options={{ title: 'Empleados' }} />
      <Stack.Screen name="PackingLists" component={PackingListsScreen} options={{ title: 'Packing Lists' }} />
      <Stack.Screen name="Productos" component={ProductosScreen} options={{ title: 'Productos' }} />
      <Stack.Screen name="Asistencia" component={AsistenciaScreen} options={{ title: 'Asistencia' }} />
    </Stack.Navigator>
  );
}
