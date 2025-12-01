import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Switch, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

// Clean Architecture Imports
import { GetEmployeesUseCase } from '../../domain/useCases';
import { GetDailyAttendanceUseCase, SaveAttendanceUseCase } from '../../domain/useCases/attendance';
import { Employee } from '../../domain/entities/employee';

const FECHA_HOY = new Date().toISOString().slice(0, 10);

type AsistenciaLocal = {
  employeeId: string;
  isPresent: boolean;
};

export default function AsistenciaScreen() {
  const [empleados, setEmpleados] = useState<Employee[]>([]);
  const [asistenciaMap, setAsistenciaMap] = useState<Record<string, boolean>>({}); // Mapa { id_empleado: true/false }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar datos iniciales
  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Obtener TODOS los empleados (activos e inactivos)
      const allEmployees = await GetEmployeesUseCase();
      
      // --- FILTRO: Solo nos quedamos con los ACTIVOS para la asistencia ---
      const activeEmployees = allEmployees.filter(emp => emp.isActive);

      // 2. Obtener asistencia de hoy
      const dailyRecords = await GetDailyAttendanceUseCase(FECHA_HOY);
      
      // 3. Crear mapa para acceso rápido
      const map: Record<string, boolean> = {};
      
      // Inicializar todo en false primero (usando solo la lista filtrada)
      activeEmployees.forEach(emp => { map[emp.id] = false; });
      
      // Sobreescribir con los registros reales
      dailyRecords.forEach(rec => {
        map[rec.employeeId] = rec.isPresent;
      });

      setEmpleados(activeEmployees); // Guardamos en el estado solo los activos
      setAsistenciaMap(map);

    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  // Cambiar estado localmente
  const toggleAsistencia = (empId: string) => {
    setAsistenciaMap(prev => ({
      ...prev,
      [empId]: !prev[empId]
    }));
  };

  // Guardar cambios en BD
  const guardarAsistencia = async () => {
    setSaving(true);
    try {
      // Enviamos uno por uno
      const promises = empleados.map(emp => {
        return SaveAttendanceUseCase({
          employeeId: emp.id,
          date: FECHA_HOY,
          isPresent: asistenciaMap[emp.id] || false
        });
      });

      await Promise.all(promises);
      
      Alert.alert('Éxito', 'Asistencia guardada correctamente');
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un problema al guardar');
    } finally {
      setSaving(false);
    }
  };

  const renderItem = ({ item }: { item: Employee }) => {
    const isPresent = asistenciaMap[item.id] || false;
    
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
              isPresent ? styles.presente : styles.ausente,
            ]}
          >
            {isPresent ? 'Presente' : 'Ausente'}
          </Text>
          <Switch
            value={isPresent}
            onValueChange={() => toggleAsistencia(item.id)}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isPresent ? "#4c6ef5" : "#f4f3f4"}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Asistencia ({FECHA_HOY})</Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#4c6ef5" style={{marginTop: 50}} />
      ) : (
        <FlatList
          data={empleados}
          keyExtractor={e => e.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          ListEmptyComponent={<Text style={{textAlign:'center', marginTop:20}}>No hay empleados activos</Text>}
        />
      )}

      <View style={styles.buttonRow}>
        <Pressable 
            style={[styles.btn, styles.save, saving && {opacity: 0.7}]} 
            onPress={guardarAsistencia}
            disabled={saving}
        >
          {saving ? (
             <ActivityIndicator color="white" />
          ) : (
             <Text style={[styles.btnText, { color: 'white' }]}>Guardar asistencia</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingTop: 10 },
  titulo: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: '#333' },
  sep: { height: 1, backgroundColor: '#e5e5e5' },
  row: { paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' },
  empNombre: { fontSize: 16, fontWeight: '700', color: '#333' },
  metaText: { color: '#666', marginTop: 2 },
  estado: { fontWeight: '700', marginBottom: 6, fontSize: 12 },
  presente: { color: '#1e7f34' },
  ausente: { color: '#9b2226' },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', padding: 16, backgroundColor: 'white', borderTopWidth: 1, borderColor: '#eee' },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginHorizontal: 8 },
  save: { backgroundColor: '#4c6ef5' },
  view: { backgroundColor: '#198754' },
  btnText: { fontWeight: '700' }
});