import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, Pressable, Alert } from 'react-native';
import { EmployeesApi } from '../../services/employeesApi';

type Empleado = {
  id: string;
  dni: string;
  fullName: string;
  role: string;
  active: boolean;
};

type AsistenciaRegistro = {
  empleadoId: string;
  fecha: string; // YYYY-MM-DD
  presente: boolean;
};

const FECHA_HOY = new Date().toISOString().slice(0, 10);

export default function AsistenciaScreen() {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [asistencia, setAsistencia] = useState<AsistenciaRegistro[]>([]);

  // ============================================================
  // 🔥 Cargar empleados activos
  // ============================================================
  const cargarEmpleados = async () => {
    try {
      const res = await EmployeesApi.getAll({ active: true });

      // Crear registros iniciales de asistencia
      const inicial = res.data.map((emp: Empleado) => ({
        empleadoId: emp.id,
        fecha: FECHA_HOY,
        presente: false, // por defecto
      }));

      setEmpleados(res.data);
      setAsistencia(inicial);

    } catch (err) {
      Alert.alert("Error", "No se pudieron cargar los empleados activos");
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  // ============================================================
  // 🔥 Cambiar estado de asistencia
  // ============================================================
  const toggleAsistencia = (empId: string) => {
    setAsistencia(prev =>
      prev.map(r =>
        r.empleadoId === empId && r.fecha === FECHA_HOY
          ? { ...r, presente: !r.presente }
          : r
      )
    );
  };

  const getRegistro = (empId: string) =>
    asistencia.find(a => a.empleadoId === empId && a.fecha === FECHA_HOY);

  // ============================================================
  // 🔥 Guardar asistencia (enviar al backend)
  // ============================================================
  const guardarAsistencia = async () => {
    try {
      const payload = {
        fecha: FECHA_HOY,
        registros: asistencia,
      };

      // más adelante: enviar al backend
      // await axios.post(`${API_URL}/attendance`, payload);

      Alert.alert("Éxito", "Asistencia del día guardada.");
    } catch (err) {
      Alert.alert("Error", "No se pudo guardar la asistencia.");
    }
  };

  const renderItem = ({ item }: { item: Empleado }) => {
    const reg = getRegistro(item.id);

    return (
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.empNombre}>{item.fullName}</Text>
          <Text style={styles.metaText}>DNI: {item.dni}</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Text
            style={[
              styles.estado,
              reg?.presente ? styles.presente : styles.ausente,
            ]}
          >
            {reg?.presente ? "Presente" : "Ausente"}
          </Text>

          <Switch
            value={reg?.presente ?? false}
            onValueChange={() => toggleAsistencia(item.id)}
          />
        </View>
      </View>
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
          <Text style={[styles.btnText, { color: "white" }]}>Guardar asistencia</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ESTILOS IGUAL QUE LOS TUYOS….


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
