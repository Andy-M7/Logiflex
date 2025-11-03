import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { RootStackParamList } from '../navigation/StackNavigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const MODULES = [
  { key: 'Usuarios', title: 'Usuarios', subtitle: 'Gestión y Roles', icon: 'account-multiple-outline' },
  { key: 'Empleados', title: 'Empleados', subtitle: 'Altas y Ediciones', icon: 'account-cash-outline' },
  { key: 'PackingLists', title: 'Packing Lists', subtitle: 'Listado y Adjuntos', icon: 'package-variant-closed' },
  { key: 'Productos', title: 'Productos', subtitle: 'Catálogo y Lotes', icon: 'shopping-outline' },
  { key: 'Asistencia', title: 'Asistencia', subtitle: 'Personal', icon: 'calendar-check-outline' },
] as const;

export default function HomeScreen({ navigation }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {MODULES.map(item => (
        <Pressable
          key={item.key}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          onPress={() => navigation.navigate(item.key as any)}
        >
          <Icon name={item.icon} size={36} color="#4a4a4a" style={styles.icon} />
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSub}>{item.subtitle}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#f8f8f8',
    width: '48%',
    aspectRatio: 1,
    borderRadius: 14,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  pressed: {
    backgroundColor: '#e6e6e6',
  },
  icon: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  cardSub: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
