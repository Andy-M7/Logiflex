import React from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/StackNavigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const MODULES = [
  { key: 'Usuarios', title: 'Usuarios', subtitle: 'Gestión y Roles' },
  { key: 'Empleados', title: 'Empleados', subtitle: 'Altas y Ediciones' },
  { key: 'PackingLists', title: 'Packing Lists', subtitle: 'Listado y Adjuntos' },
  { key: 'Productos', title: 'Productos', subtitle: 'Catálogo y Lotes' },
] as const;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <FlatList
        data={MODULES as any}
        contentContainerStyle={{ gap: 12, padding: 16 }}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => navigation.navigate(item.key as any)}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSub}>{item.subtitle}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { padding: 18, borderRadius: 16, backgroundColor: '#2b2d31' },
  cardTitle: { fontSize: 20, fontWeight: '700', color: 'white' },
  cardSub: { marginTop: 4, opacity: 0.85, color: 'white' },
});
