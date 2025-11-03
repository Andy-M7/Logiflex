import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type Empleado = {
  id: string;
  dni: string;
  nombre: string;
};

type AsistenciaRegistro = {
  id: string; // empleado id
  fecha: string; // formato YYYY-MM-DD
  presente: boolean;
};

const FECHA_HOY = new Date().toISOString().slice(0, 10);

export default function AsistenciaScreen() {
  const navigation = useNavigation();

  const [empleados] = useState<Empleado[]>([
    { id: '1', dni: '45678901', nombre: 'Juan Pérez' },
    { id: '2', dni: '87654321', nombre: 'María Gómez' },
    { id: '3', dni: '11223344', nombre: 'Carlos Ruiz' },
  ]);

  const [asistencia, setAsistencia] = useState<AsistenciaRegistro[]>([
    { id: '1', fecha: FECHA_HOY, presente: true },
    { id: '2', fecha: FECHA_HOY, presente: false },
    { id: '3', fecha: FECHA_HOY, presente: true },
  ]);

  const toggleAsistencia = (empId: string) => {
    setAsistencia(arr =>
      arr.map(a =>
        a.id === empId && a.fecha === FECHA_HOY
          ? { ...a, presente: !a.presente }
          : a
      )
    );
  };

  const getRegistro = (empId: string) =>
    asistencia.find(a => a.id === empId && a.fecha === FECHA_HOY);

  const renderItem = ({ item }: { item: Empleado }) => {
    const reg = getRegistro(item.id);
    return (
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.empNombre}>{item.nombre}</Text>
          <Text style={styles.metaText}>DNI: {item.dni}</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text
            style={[
              styles.estado,
              reg?.presente ? styles.presente : styles.ausente,
            ]}
          >
            {reg?.presente ? 'Presente' : 'Ausente'}
          </Text>
          <Switch
            value={!!reg?.presente}
            onValueChange={() => toggleAsistencia(item.id)}
          />
        </View>
      </View>
    );
  };

  // Función para simular guardar asistencia
  const guardarAsistencia = () => {
    Alert.alert(
      'Guardar asistencia',
      'Asistencia del día guardada correctamente.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Asistencia de empleados</Text>
      <FlatList
        data={empleados}
        keyExtractor={e => e.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />
      <View style={styles.buttonRow}>
        <Pressable style={[styles.btn, styles.save]} onPress={guardarAsistencia}>
          <Text style={[styles.btnText, { color: 'white' }]}>Guardar asistencia</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.view]}
            //onPress={() => navigation.navigate('VisualizarAsistencia')}
        >
          <Text style={styles.btnText}>Ver asistencia mensual</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 36 },
  titulo: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  sep: { height: 1, backgroundColor: '#e5e5e5' },
  row: { paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center' },
  empNombre: { fontSize: 16, fontWeight: '700' },
  metaText: { color: '#666', marginTop: 2 },
  estado: { fontWeight: '700', marginBottom: 6 },
  presente: { color: '#1e7f34' },
  ausente: { color: '#9b2226' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 12 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginHorizontal: 8 },
  save: { backgroundColor: '#4c6ef5' },
  view: { backgroundColor: '#198754' },
  btnText: { fontWeight: '700' }
});
