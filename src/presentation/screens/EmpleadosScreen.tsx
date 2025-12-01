import React, { useLayoutEffect, useMemo, useState, useCallback } from 'react';
import {
  View, Text, TextInput, StyleSheet, FlatList, Pressable, Modal,
  KeyboardAvoidingView, Platform, Switch, ActivityIndicator, Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/StackNavigation';

// Importaciones de Clean Architecture
import { Employee } from '../../domain/entities/employee';
import { 
  GetEmployeesUseCase, 
  CreateEmployeeUseCase, 
  UpdateEmployeeUseCase, 
  DeleteEmployeeUseCase 
} from '../../domain/useCases';

type Props = NativeStackScreenProps<RootStackParamList, 'Empleados'>;

const ROLES = ['Líder', 'Auxiliar', 'Supervisor'];

export default function EmpleadosScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados del Formulario
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // Para saber si editamos
  
  const [dni, setDni] = useState(''); 
  const [fullName, setFullName] = useState(''); // Usamos fullName como en el backend
  const [rol, setRol] = useState<any>('Auxiliar'); 
  const [activo, setActivo] = useState(true);

  // --- CARGAR DATOS ---
  const loadEmployees = async () => {
    setLoading(true);
    try {
      const employees = await GetEmployeesUseCase();
      setData(employees);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEmployees();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable style={styles.addBtn} onPress={abrirModalCrear}>
          <Text style={styles.addBtnText}>+ Añadir</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  // --- FILTRO ---
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(e => 
      e.fullName.toLowerCase().includes(q) || 
      e.dni.includes(q) || 
      e.role.toLowerCase().includes(q)
    );
  }, [query, data]);

  // --- ACCIONES ---
  const abrirModalCrear = () => {
    setEditingId(null); // Modo crear
    setDni(''); setFullName(''); setRol('Auxiliar'); setActivo(true);
    setOpen(true);
  };

  const abrirModalEditar = (item: Employee) => {
    setEditingId(item.id); // Modo editar
    setDni(item.dni);
    setFullName(item.fullName);
    setRol(item.role);
    setActivo(item.isActive);
    setOpen(true);
  };

  const guardar = async () => {
    if (!dni.trim() || !fullName.trim()) return;

    try {
      if (editingId) {
        // ACTUALIZAR
        await UpdateEmployeeUseCase(editingId, {
          dni: dni.trim(),
          fullName: fullName.trim(),
          role: rol,
          isActive: activo
        });
      } else {
        // CREAR
        await CreateEmployeeUseCase({
          dni: dni.trim(),
          fullName: fullName.trim(),
          role: rol,
          isActive: activo
        });
      }
      // Recargar lista y cerrar
      loadEmployees();
      setOpen(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el empleado. Verifica el DNI.');
    }
  };

  const eliminar = (id: string) => {
    Alert.alert('Confirmar', '¿Deseas eliminar este empleado?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Eliminar', 
        style: 'destructive', 
        onPress: async () => {
          try {
            await DeleteEmployeeUseCase(id);
            loadEmployees(); // Recargar lista
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: Employee }) => (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.empNombre}>{item.fullName}</Text>
        <View style={styles.metaLine}>
          <Text style={styles.metaText}>DNI: {item.dni}</Text>
          <Text style={styles.metaText}>• {item.role}</Text>
          <Text style={[styles.estado, item.isActive ? styles.activo : styles.inactivo]}>
            {item.isActive ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={() => abrirModalEditar(item)}>
            <Text style={styles.actionText}>Editar</Text>
        </Pressable>
        <Pressable style={[styles.actionBtn, styles.deleteBtn]} onPress={() => eliminar(item.id)}>
          <Text style={styles.actionText}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput 
            placeholder="Buscar empleados..." 
            placeholderTextColor="#8a8a8a" 
            value={query} 
            onChangeText={setQuery} 
            style={styles.searchInput}
        />
      </View>

      {loading ? (
        <ActivityIndicator style={{marginTop: 20}} size="large" color="#4c6ef5" />
      ) : (
        <FlatList 
            data={filtered} 
            keyExtractor={(e) => e.id} 
            renderItem={renderItem} 
            ItemSeparatorComponent={() => <View style={styles.sep} />} 
        />
      )}

      {/* MODAL */}
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetBackdrop}>
          <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>
                {editingId ? 'Editar Empleado' : 'Añadir Empleado'}
            </Text>

            <Text style={styles.label}>DNI</Text>
            <TextInput 
                keyboardType="number-pad" 
                value={dni} 
                onChangeText={setDni} 
                placeholder="87654321" 
                placeholderTextColor="#8a8a8a" 
                style={styles.input} 
                maxLength={8}
                editable={!editingId} // Bloquear DNI al editar si lo deseas
            />
            
            <Text style={styles.label}>Nombre</Text>
            <TextInput 
                value={fullName} 
                onChangeText={setFullName} 
                placeholder="María Gómez" 
                placeholderTextColor="#8a8a8a" 
                style={styles.input}
            />
            
            <Text style={styles.label}>Rol</Text>
            <View style={styles.pickerWrap}>
              <Picker selectedValue={rol} onValueChange={(v) => setRol(v)}>
                {ROLES.map(r => <Picker.Item key={r} label={r} value={r} />)}
              </Picker>
            </View>
            
            <View style={styles.switchRow}>
              <Text style={styles.label}>Estado (Activo)</Text>
              <Switch value={activo} onValueChange={setActivo} />
            </View>

            <View style={styles.sheetActions}>
              <Pressable style={[styles.btn, styles.cancel]} onPress={() => setOpen(false)}>
                <Text style={styles.btnText}>Cancelar</Text>
              </Pressable>
              <Pressable style={[styles.btn, styles.save]} onPress={guardar}>
                <Text style={[styles.btnText, { color: 'white' }]}>Guardar</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'#F7F8FA'}, searchBox:{paddingHorizontal:16,paddingVertical:12},
  searchInput:{backgroundColor:'#FFF',borderRadius:12,paddingHorizontal:12,paddingVertical:10, borderWidth:1, borderColor:'#ddd'},
  sep:{height:1,backgroundColor:'#e5e5e5'}, row:{paddingHorizontal:16,paddingVertical:14,flexDirection:'row',gap:12,alignItems:'center', backgroundColor: 'white'},
  empNombre:{fontSize:16,fontWeight:'700', color: '#333'}, metaLine:{flexDirection:'row',gap:10,marginTop:2,flexWrap:'wrap', alignItems:'center'},
  metaText:{color:'#666', fontSize: 13}, estado:{fontWeight:'700', fontSize:12}, activo:{color:'#1e7f34'}, inactivo:{color:'#9b2226'},
  actions:{gap:8}, actionBtn:{borderWidth:1,borderColor:'#bdbdbd',paddingHorizontal:12,paddingVertical:6,borderRadius:8,alignItems:'center'},
  deleteBtn:{backgroundColor:'#FFF0F0', borderColor: '#FFCDD2'}, actionText:{fontWeight:'600', fontSize: 12, color:'#555'},
  addBtn:{paddingHorizontal:12,paddingVertical:6,borderRadius:10,backgroundColor:'#e9ecef'}, addBtnText:{fontWeight:'700', color:'#333'},
  sheetBackdrop:{flex:1,backgroundColor:'rgba(0,0,0,0.35)',justifyContent:'flex-end'},
  sheet:{backgroundColor:'white',padding:20,borderTopLeftRadius:24,borderTopRightRadius:24,gap:12, elevation:10},
  sheetTitle:{fontSize:20,fontWeight:'800',marginBottom:6, color:'#333'}, label:{fontWeight:'700', color:'#444', marginTop:4},
  input:{borderWidth:1,borderColor:'#d1d1d1',borderRadius:10,paddingHorizontal:12,paddingVertical:12, fontSize:16, color:'#333', backgroundColor:'#FAFAFA'},
  pickerWrap:{borderWidth:1,borderColor:'#d1d1d1',borderRadius:10,overflow:'hidden', backgroundColor:'#FAFAFA'},
  switchRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:6, paddingVertical:4},
  sheetActions:{flexDirection:'row',gap:12,marginTop:20, marginBottom: 20}, btn:{flex:1,paddingVertical:14,borderRadius:12,alignItems:'center'},
  cancel:{backgroundColor:'#f1f3f5'}, save:{backgroundColor:'#4c6ef5'}, btnText:{fontWeight:'700'},
});