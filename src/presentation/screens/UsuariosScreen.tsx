import React, { useLayoutEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  Modal, KeyboardAvoidingView, Platform, TextInput, Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/StackNavigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Usuarios'>;

type Usuario = { id: string; correo: string; rol: string };

const ROLES_BASE = ['Administrador', 'Supervisor', 'Logística', 'Operaciones'];

export default function UsuariosScreen({ navigation }: Props) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    { id: '1', correo: 'admin@demo.com', rol: 'Administrador' },
    { id: '2', correo: 'jlopez@demo.com', rol: 'Supervisor' },
  ]);

  // bottom-sheet crear
  const [open, setOpen] = useState(false);
  const [correo, setCorreo] = useState('');
  const [rol, setRol] = useState<string>(ROLES_BASE[0]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable style={styles.addBtn} onPress={() => setOpen(true)}>
          <Text style={styles.addBtnText}>+ Añadir</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  const isEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const guardar = () => {
    const mail = correo.trim();
    if (!isEmail(mail)) {
      Alert.alert('Correo inválido', 'Ingresa un correo electrónico válido.');
      return;
    }
    if (usuarios.some(u => u.correo.toLowerCase() === mail.toLowerCase())) {
      Alert.alert('Duplicado', 'Ya existe un usuario con ese correo.');
      return;
    }
    const nuevo: Usuario = { id: String(Date.now()), correo: mail, rol };
    setUsuarios(prev => [nuevo, ...prev]);
    // reset
    setCorreo('');
    setRol(ROLES_BASE[0]);
    setOpen(false);
  };

  const renderItem = ({ item }: { item: Usuario }) => (
    <View style={styles.row}>
      <View>
        <Text style={styles.title}>{item.correo}</Text>
        <Text style={styles.sub}>Rol: {item.rol}</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable style={[styles.btn, styles.ghost]} onPress={() => navigation.navigate('Roles')}>
          <Text style={styles.btnText}>Cambiar rol</Text>
        </Pressable>
        <Pressable
          style={[styles.btn, styles.danger]}
          onPress={() => setUsuarios(list => list.filter(u => u.id !== item.id))}
        >
          <Text style={[styles.btnText, { color: 'white' }]}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={usuarios}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={renderItem}
      />

      {/* Acciones rápidas con Roles */}
      <View style={styles.footer}>
        <Pressable style={[styles.btn, styles.primary]} onPress={() => navigation.navigate('Roles')}>
          <Text style={[styles.btnText, { color: 'white' }]}>Gestionar Roles</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.outline]} onPress={() => navigation.navigate('Roles')}>
          <Text style={styles.btnText}>Agregar Rol</Text>
        </Pressable>
      </View>

      {/* Bottom-sheet crear usuario */}
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetBackdrop}
        >
          <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Añadir Usuario</Text>

            <Text style={styles.label}>Correo</Text>
            <TextInput
              value={correo}
              onChangeText={setCorreo}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="usuario@empresa.com"
              placeholderTextColor="#8a8a8a"
              style={styles.input}
            />

            <Text style={styles.label}>Rol</Text>
            <View style={styles.pickerWrap}>
              <Picker selectedValue={rol} onValueChange={(v) => setRol(v)}>
                {ROLES_BASE.map(r => <Picker.Item key={r} label={r} value={r} />)}
              </Picker>
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
  container: { flex: 1 },
  row: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#2b2d31',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 16, fontWeight: '700', color: 'white' },
  sub: { color: 'white', opacity: 0.85 },

  // botones de fila / footer
  btn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  btnText: { fontWeight: '600', color: 'white' },
  primary: { backgroundColor: '#4c6ef5' },
  outline: { backgroundColor: '#1f1f23', borderWidth: 1, borderColor: '#3a3a3a' },
  ghost: { backgroundColor: '#1f1f23' },
  danger: { backgroundColor: '#c92a2a' },
  footer: { padding: 16, gap: 10 },

  // headerRight
  addBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: '#e9ecef' },
  addBtnText: { fontWeight: '700' },

  // bottom-sheet
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: 'white', padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20, gap: 10 },
  sheetTitle: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  label: { fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#d1d1d1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  pickerWrap: { borderWidth: 1, borderColor: '#d1d1d1', borderRadius: 10, overflow: 'hidden' },

  sheetActions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  cancel: { backgroundColor: '#f1f3f5' },
  save: { backgroundColor: '#4c6ef5' },
});
