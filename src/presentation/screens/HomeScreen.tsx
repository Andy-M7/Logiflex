import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/StackNavigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const MODULES = [
  { key: 'Usuarios', title: 'Usuarios', subtitle: 'Gestión y Roles' },
  { key: 'Empleados', title: 'Empleados', subtitle: 'Altas y Ediciones' },
  { key: 'PackingLists', title: 'Packing Lists', subtitle: 'Listado y Adjuntos' },
  { key: 'Productos', title: 'Productos', subtitle: 'Catálogo y Lotes' },
  { key: 'Asistencia', title: 'Asistencia', subtitle: 'Asistencia del Personal' },
] as const;

export default function HomeScreen({ navigation }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {MODULES.map(item => (
        <Pressable
          key={item.key}
          style={styles.card}
          onPress={() => navigation.navigate(item.key as any)}
        >
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSub}>{item.subtitle}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#2b2d31',
    width: '40%', // Dos columnas ajustables
    aspectRatio: 1, // Cuadrado perfecto
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
  },
  cardSub: {
    marginTop: 8,
    opacity: 0.85,
    color: 'white',
    textAlign: 'center',
  },
});
