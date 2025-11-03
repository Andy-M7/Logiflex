import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput,
  TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/StackNavigation';
import { Menu } from 'react-native-paper';

// ====== Mini RoleMenu ( usando paper) ======
function RoleMenu({
  value, onChange, label = 'Rol', placeholder = 'Selecciona un rol',
}: { value?: string; onChange: (v: string) => void; label?: string; placeholder?: string }) {
  const [visible, setVisible] = useState(false);
  const roles = ['Administrador','Supervisor','Logística','Operario','Auxiliar'];

  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TouchableOpacity
            style={styles.select}
            onPress={() => setVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={[styles.selectValue, !value && { color: '#9ca3af' }]} numberOfLines={1}>
              {value || placeholder}
            </Text>
            <Text style={styles.caret}>▾</Text>
          </TouchableOpacity>
        }
      >
        {roles.map(r => (
          <Menu.Item key={r} title={r} onPress={() => { onChange(r); setVisible(false); }} />
        ))}
      </Menu>
    </View>
  );
}
// =====================================================

type R = RouteProp<RootStackParamList, 'EmpleadoForm'>;

export default function EmpleadoForm() {
  const nav = useNavigation<any>();
  const route = useRoute<R>();

  const isEdit = route.params.mode === 'edit';
  const id = isEdit ? route.params.id : undefined;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dni: '',
    email: '',
    phone: '',
    role: '',
  });

  useEffect(() => {
    if (isEdit && id) {
      // Simula carga (en real: fetch por id)
      setLoading(true);
      setTimeout(() => {
        setForm({
          firstName: 'Nombre',
          lastName: 'Apellido',
          dni: '00000000',
          email: 'correo@correo.com',
          phone: '900000000',
          role: 'Supervisor',
        });
        setLoading(false);
      }, 400);
    }
  }, [isEdit, id]);

  const onSave = async () => {
    if (!form.firstName || !form.lastName || !form.dni || !form.email || !form.role) {
      Alert.alert('Faltan datos', 'Completa los campos obligatorios');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(isEdit ? 'Actualizado' : 'Registrado', 'Operación realizada correctamente');
      nav.goBack();
    }, 400);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>{isEdit ? 'Editar empleado' : 'Nuevo empleado'}</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <TextInput
            placeholder="Nombres*"
            style={styles.input}
            value={form.firstName}
            onChangeText={(t) => setForm({ ...form, firstName: t })}
          />
          <TextInput
            placeholder="Apellidos*"
            style={styles.input}
            value={form.lastName}
            onChangeText={(t) => setForm({ ...form, lastName: t })}
          />
          <TextInput
            placeholder="DNI*"
            style={styles.input}
            value={form.dni}
            onChangeText={(t) => setForm({ ...form, dni: t })}
            keyboardType="number-pad"
          />
          <TextInput
            placeholder="Correo*"
            style={styles.input}
            value={form.email}
            onChangeText={(t) => setForm({ ...form, email: t })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Teléfono"
            style={styles.input}
            value={form.phone}
            onChangeText={(t) => setForm({ ...form, phone: t })}
            keyboardType="phone-pad"
          />

          <RoleMenu
            value={form.role}
            onChange={(v) => setForm({ ...form, role: v })}
            label="Rol"
            placeholder="Selecciona un rol"
          />

          <TouchableOpacity style={styles.primary} onPress={onSave}>
            <Text style={styles.primaryTxt}>{isEdit ? 'Guardar cambios' : 'Crear'}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7fb', padding: 16, gap: 12 },
  h1: { fontSize: 22, fontWeight: '700' },
  input: {
    backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12,
    height: 44, borderWidth: 1, borderColor: '#e6e6e6',
  },
  label: { fontSize: 12, color: '#374151', fontWeight: '600' },
  select: {
    backgroundColor: '#fff', borderRadius: 12, height: 44, borderWidth: 1,
    borderColor: '#e6e6e6', paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center',
  },
  selectValue: { flex: 1, color: '#111827' },
  caret: { marginLeft: 8, fontSize: 14, color: '#111827' },
  primary: {
    backgroundColor: '#2363eb', paddingVertical: 12, borderRadius: 12,
    alignItems: 'center', marginTop: 8,
  },
  primaryTxt: { color: '#fff', fontWeight: '700' },
});
