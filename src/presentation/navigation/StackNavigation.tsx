import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Empleado from '../screens/Empleado';
import EmpleadoForm from '../screens/EmpleadoForm';

export type RootStackParamList = {
  Empleado: undefined;
  EmpleadoForm:
    | { mode: 'create' }
    | { mode: 'edit'; id: number };
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
    </Stack.Navigator>
  );
}
