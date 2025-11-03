import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList,
  TouchableOpacity, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/StackNavigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Empleado'>;

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  dni: string;
  role: string;
  status: 'Activo' | 'Inactivo';
}

const seed: Employee[] = [
  { id: 1, firstName: 'Juan', lastName: 'Pérez', dni: '12345678', role: 'Líder', status: 'Activo' },
  { id: 2, firstName: 'María', lastName: 'Gómez', dni: '87654321', role: 'Auxiliar', status: 'Activo' },
  { id: 3, firstName: 'Carlos', lastName: 'Ruiz', dni: '45678912', role: 'Operario', status: 'Inactivo' },
];

export default function Empleado() {
  const nav = useNavigation<Nav>();
  const [items, setItems] = useState<Employee[]>(seed);
  const [query, setQuery] = useState('');

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(e =>
      `${e.firstName} ${e.lastName} ${e.dni} ${e.role}`.toLowerCase().includes(q)
    );
  }, [items, query]);

  const onDelete = (id: number) => {
    const emp = items.find(i => i.id === id);
    Alert.alert('Eliminar', `¿Deseas eliminar a ${emp?.firstName}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => setItems(prev => prev.filter(x => x.id !== id)) },
    ]);
  };

  const openCreate = () => nav.navigate('EmpleadoForm', { mode: 'create' });
  const openEdit = (id: number) => nav.navigate('EmpleadoForm', { mode: 'edit', id });

  // Handlers para recibir resultados al volver (usando focus/params sería más complejo; aquí simplificamos con prompts simulados)
  // En tu app real conectarás con backend y refrescarás desde API.

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Empleados</Text>

      <View style={styles.row}>
        <TextInput
          placeholder="Buscar empleados"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.addBtn} onPress={openCreate}>
          <Text style={styles.addTxt}>+ Añadir</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(x) => String(x.id)}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <View style={[styles.card, item.status === 'Inactivo' && { opacity: 0.6 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.firstName} {item.lastName}</Text>
              <Text style={styles.meta}>DNI {item.dni} • {item.role} • {item.status}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btn} onPress={() => openEdit(item.id)}>
                <Text style={styles.btnTxt}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnGhost]} onPress={() => onDelete(item.id)}>
                <Text style={[styles.btnTxt, styles.btnGhostTxt]}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No hay empleados</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7fb', padding: 16, gap: 12 },
  h1: { fontSize: 22, fontWeight: '700' },
  row: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, height: 44, borderWidth: 1, borderColor: '#e6e6e6' },
  addBtn: { backgroundColor: '#111827', paddingHorizontal: 14, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  addTxt: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: 16, fontWeight: '700' },
  meta: { fontSize: 12, opacity: 0.8, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 8 },
  btn: { backgroundColor: '#111827', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  btnTxt: { color: '#fff', fontWeight: '600' },
  btnGhost: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  btnGhostTxt: { color: '#111827' },
});
