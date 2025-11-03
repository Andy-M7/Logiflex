import React, { useLayoutEffect, useMemo, useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, FlatList, Pressable, Modal,
  KeyboardAvoidingView, Platform, Switch
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import type { RootStackParamList } from '../navigation/StackNavigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Empleados'>;

type Empleado = { id: string; dni: string; nombre: string; rol: 'Líder' | 'Auxiliar' | 'Supervisor'; activo: boolean; };
const ROLES: Empleado['rol'][] = ['Líder', 'Auxiliar', 'Supervisor'];

export default function EmpleadosScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Empleado[]>([
    { id: '1', dni: '45678901', nombre: 'Juan Pérez', rol: 'Líder', activo: true },
    { id: '2', dni: '87654321', nombre: 'María Gómez', rol: 'Auxiliar', activo: true },
    { id: '3', dni: '11223344', nombre: 'Carlos Ruiz', rol: 'Auxiliar', activo: false },
  ]);

  const [open, setOpen] = useState(false);
  const [dni, setDni] = useState(''); const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<Empleado['rol']>('Auxiliar'); const [activo, setActivo] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable style={styles.addBtn} onPress={() => setOpen(true)}>
          <Text style={styles.addBtnText}>+ Añadir</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(e => e.nombre.toLowerCase().includes(q) || e.dni.includes(q) || e.rol.toLowerCase().includes(q));
  }, [query, data]);

  const guardar = () => {
    if (!dni.trim() || !nombre.trim()) return;
    setData(a => [{ id: String(Date.now()), dni: dni.trim(), nombre: nombre.trim(), rol, activo }, ...a]);
    setDni(''); setNombre(''); setRol('Auxiliar'); setActivo(true); setOpen(false);
  };

  const eliminar = (id: string) => setData(a => a.filter(e => e.id !== id));

  const renderItem = ({ item }: { item: Empleado }) => (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.empNombre}>{item.nombre}</Text>
        <View style={styles.metaLine}>
          <Text style={styles.metaText}>DNI</Text>
          <Text style={styles.metaText}>{item.dni}</Text>
          <Text style={styles.metaText}>{item.rol}</Text>
          <Text style={[styles.estado, item.activo ? styles.activo : styles.inactivo]}>
            {item.activo ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.actionBtn}><Text style={styles.actionText}>Editar</Text></Pressable>
        <Pressable style={[styles.actionBtn, styles.deleteBtn]} onPress={() => eliminar(item.id)}>
          <Text style={styles.actionText}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput placeholder="Buscar empleados" placeholderTextColor="#8a8a8a" value={query} onChangeText={setQuery} style={styles.searchInput}/>
      </View>

      <FlatList data={filtered} keyExtractor={(e) => e.id} renderItem={renderItem} ItemSeparatorComponent={() => <View style={styles.sep} />} />

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetBackdrop}>
          <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Añadir Empleado</Text>

            <Text style={styles.label}>DNI</Text>
            <TextInput keyboardType="number-pad" value={dni} onChangeText={setDni} placeholder="87654321" placeholderTextColor="#8a8a8a" style={styles.input} maxLength={8}/>
            <Text style={styles.label}>Nombre</Text>
            <TextInput value={nombre} onChangeText={setNombre} placeholder="María Gómez" placeholderTextColor="#8a8a8a" style={styles.input}/>
            <Text style={styles.label}>Rol</Text>
            <View style={styles.pickerWrap}>
              <Picker selectedValue={rol} onValueChange={(v) => setRol(v)}>
                {ROLES.map(r => <Picker.Item key={r} label={r} value={r} />)}
              </Picker>
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.label}>Estado</Text>
              <Switch value={activo} onValueChange={setActivo} />
            </View>

            <View style={styles.sheetActions}>
              <Pressable style={[styles.btn, styles.cancel]} onPress={() => setOpen(false)}><Text style={styles.btnText}>Cancelar</Text></Pressable>
              <Pressable style={[styles.btn, styles.save]} onPress={guardar}><Text style={[styles.btnText, { color: 'white' }]}>Guardar</Text></Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1}, searchBox:{paddingHorizontal:16,paddingVertical:12},
  searchInput:{backgroundColor:'#eee',borderRadius:12,paddingHorizontal:12,paddingVertical:10},
  sep:{height:1,backgroundColor:'#e5e5e5'}, row:{paddingHorizontal:16,paddingVertical:14,flexDirection:'row',gap:12,alignItems:'center'},
  empNombre:{fontSize:16,fontWeight:'700'}, metaLine:{flexDirection:'row',gap:10,marginTop:2,flexWrap:'wrap'},
  metaText:{color:'#666'}, estado:{fontWeight:'700'}, activo:{color:'#1e7f34'}, inactivo:{color:'#9b2226'},
  actions:{gap:8}, actionBtn:{borderWidth:1,borderColor:'#bdbdbd',paddingHorizontal:12,paddingVertical:8,borderRadius:10,alignItems:'center'},
  deleteBtn:{backgroundColor:'#f2f2f2'}, actionText:{fontWeight:'600'},
  addBtn:{paddingHorizontal:12,paddingVertical:6,borderRadius:10,backgroundColor:'#e9ecef'}, addBtnText:{fontWeight:'700'},
  sheetBackdrop:{flex:1,backgroundColor:'rgba(0,0,0,0.35)',justifyContent:'flex-end'},
  sheet:{backgroundColor:'white',padding:16,borderTopLeftRadius:20,borderTopRightRadius:20,gap:8},
  sheetTitle:{fontSize:18,fontWeight:'800',marginBottom:6}, label:{fontWeight:'700'},
  input:{borderWidth:1,borderColor:'#d1d1d1',borderRadius:10,paddingHorizontal:12,paddingVertical:10},
  pickerWrap:{borderWidth:1,borderColor:'#d1d1d1',borderRadius:10,overflow:'hidden'},
  switchRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:6},
  sheetActions:{flexDirection:'row',gap:12,marginTop:12}, btn:{flex:1,paddingVertical:12,borderRadius:12,alignItems:'center'},
  cancel:{backgroundColor:'#f1f3f5'}, save:{backgroundColor:'#4c6ef5'}, btnText:{fontWeight:'700'},
});
