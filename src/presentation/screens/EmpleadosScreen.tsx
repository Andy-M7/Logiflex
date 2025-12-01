import React, { useLayoutEffect, useMemo, useState, useEffect } from 'react';
import {
  View, Text, TextInput, StyleSheet, FlatList, Pressable, Modal,
  KeyboardAvoidingView, Platform, Switch, Alert
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';

import { EmployeesApi } from '../../services/employeesApi';
import type { RootStackParamList } from '../navigation/StackNavigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Empleados'>;

type Empleado = { 
  id: string;
  dni: string;
  fullName: string;
  role: 'Líder' | 'Auxiliar' | 'Supervisor';
  active: boolean;
};

const ROLES: Empleado['role'][] = ['Líder', 'Auxiliar', 'Supervisor'];

export default function EmpleadosScreen({ navigation }: Props) {

  // Estado general
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Empleado[]>([]);

  // Modal
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Campos
  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<Empleado['role']>('Auxiliar');
  const [activo, setActivo] = useState(true);

  // ============================================================
  // 🔥 Cargar empleados
  // ============================================================
  const cargarEmpleados = async () => {
    try {
      const res = await EmployeesApi.getAll();
      setData(res.data);
    } catch (err) {
      Alert.alert("Error", "No se pudo cargar empleados");
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  // ============================================================
  // 🔥 Abrir modal en modo CREAR
  // ============================================================
  const abrirCrear = () => {
    setEditMode(false);
    setEditId(null);
    setDni('');
    setNombre('');
    setRol('Auxiliar');
    setActivo(true);
    setOpen(true);
  };

  // ============================================================
  // 🔥 Abrir modal en modo EDITAR
  // ============================================================
  const abrirEditar = (emp: Empleado) => {
    setEditMode(true);
    setEditId(emp.id);

    setDni(emp.dni);            // 👈 Se muestra pero no se podrá modificar
    setNombre(emp.fullName);
    setRol(emp.role);
    setActivo(emp.active);

    setOpen(true);
  };

  // ============================================================
  // 🔥 Cerrar modal
  // ============================================================
  const cerrarModal = () => {
    setOpen(false);
    setEditMode(false);
    setEditId(null);
  };

  // ============================================================
  // 🔥 Guardar (Crear)
  // ============================================================
  const guardar = async () => {
    if (!dni.trim() || !nombre.trim()) {
      Alert.alert("Campos incompletos", "DNI y Nombre son obligatorios");
      return;
    }

    const payload = {
      dni,
      fullName: nombre,
      role: rol,
      active: activo,
    };

    try {
      await EmployeesApi.create(payload);
      Alert.alert("Éxito", "Empleado registrado correctamente");
      cerrarModal();
      cargarEmpleados();
    } catch (err: any) {
      const backendMsg = err.response?.data?.message;
      const msg = Array.isArray(backendMsg)
        ? backendMsg.join("\n")
        : typeof backendMsg === "string"
        ? backendMsg
        : "No se pudo crear empleado";

      Alert.alert("Error", msg);
    }
  };

  // ============================================================
  // 🔥 Actualizar (sin DNI)
  // ============================================================
  const actualizar = async () => {
    if (!editId) return;

    const payload = {
      fullName: nombre,
      role: rol,
      active: activo,
    };

    try {
      await EmployeesApi.update(editId, payload);

      Alert.alert("Éxito", "Empleado actualizado correctamente");
      cerrarModal();
      cargarEmpleados();

    } catch (err: any) {
      const backendMsg = err.response?.data?.message;
      const msg = Array.isArray(backendMsg)
        ? backendMsg.join("\n")
        : typeof backendMsg === "string"
        ? backendMsg
        : "No se pudo actualizar empleado";

      Alert.alert("Error", msg);
    }
  };

  // ============================================================
  // 🔥 Eliminar
  // ============================================================
  const eliminar = async (id: string) => {
    try {
      await EmployeesApi.delete(id);
      cargarEmpleados();
    } catch (err) {
      Alert.alert("Error", "No se pudo eliminar empleado");
    }
  };

  // ============================================================
  // 🔍 Filtro
  // ============================================================
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;

    return data.filter(e =>
      e.fullName.toLowerCase().includes(q) ||
      e.dni.includes(q) ||
      e.role.toLowerCase().includes(q)
    );
  }, [query, data]);

  // ============================================================
  // HeaderRight
  // ============================================================
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable style={styles.addBtn} onPress={abrirCrear}>
          <Text style={styles.addBtnText}>+ Añadir</Text>
        </Pressable>
      ),
    });
  }, [navigation]);

  // ============================================================
  // Render de cada empleado
  // ============================================================
  const renderItem = ({ item }: { item: Empleado }) => (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.empNombre}>{item.fullName}</Text>

        <View style={styles.metaLine}>
          <Text style={styles.metaText}>DNI {item.dni}</Text>
          <Text style={styles.metaText}>{item.role}</Text>

          <Text style={[styles.estado, item.active ? styles.activo : styles.inactivo]}>
            {item.active ? "Activo" : "Inactivo"}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={() => abrirEditar(item)}>
          <Text style={styles.actionText}>Editar</Text>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => eliminar(item.id)}
        >
          <Text style={styles.actionText}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );

  // ============================================================
  // UI
  // ============================================================
  return (
    <View style={styles.container}>
      {/* Buscador */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Buscar empleados"
          placeholderTextColor="#8a8a8a"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(e) => e.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />

      {/* Modal Crear / Editar */}
      <Modal visible={open} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.sheetBackdrop}
        >
          <Pressable style={{ flex: 1 }} onPress={cerrarModal} />

          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>
              {editMode ? "Editar Empleado" : "Añadir Empleado"}
            </Text>

            {/* DNI - bloqueado en edición */}
            <Text style={styles.label}>DNI</Text>
            <TextInput
              keyboardType="number-pad"
              value={dni}
              onChangeText={setDni}
              style={[
                styles.input,
                editMode && { backgroundColor: "#e6e6e6", color: "#666" }
              ]}
              editable={!editMode}
              placeholder="87654321"
              maxLength={8}
            />

            {/* Nombre */}
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              style={styles.input}
              placeholder="Juan Pérez"
            />

            {/* Rol */}
            <Text style={styles.label}>Rol</Text>
            <View style={styles.pickerWrap}>
              <Picker selectedValue={rol} onValueChange={(v) => setRol(v)}>
                {ROLES.map(r => (
                  <Picker.Item key={r} label={r} value={r} />
                ))}
              </Picker>
            </View>

            {/* Estado */}
            <View style={styles.switchRow}>
              <Text style={styles.label}>Estado</Text>
              <Switch value={activo} onValueChange={setActivo} />
            </View>

            {/* Botones */}
            <View style={styles.sheetActions}>
              <Pressable style={[styles.btn, styles.cancel]} onPress={cerrarModal}>
                <Text style={styles.btnText}>Cancelar</Text>
              </Pressable>

              <Pressable
                style={[styles.btn, styles.save]}
                onPress={editMode ? actualizar : guardar}
              >
                <Text style={[styles.btnText, { color: "white" }]}>
                  {editMode ? "Actualizar" : "Guardar"}
                </Text>
              </Pressable>
            </View>

          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

//
// ============================================================
// 🎨 ESTILOS COMPLETOS
// ============================================================
const styles = StyleSheet.create({
  container: { flex: 1 },

  searchBox: { paddingHorizontal: 16, paddingVertical: 12 },
  searchInput: {
    backgroundColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  sep: { height: 1, backgroundColor: "#e5e5e5" },

  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

  empNombre: { fontSize: 16, fontWeight: "700" },

  metaLine: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2,
    flexWrap: "wrap",
  },

  metaText: { color: "#666" },

  estado: { fontWeight: "700" },
  activo: { color: "#1e7f34" },
  inactivo: { color: "#9b2226" },

  actions: { gap: 8 },

  actionBtn: {
    borderWidth: 1,
    borderColor: "#bdbdbd",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteBtn: { backgroundColor: "#f2f2f2" },

  actionText: { fontWeight: "600" },

  addBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#e9ecef",
  },
  addBtnText: { fontWeight: "700" },

  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    gap: 8,
  },

  sheetTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },

  label: { fontWeight: "700", marginTop: 6 },

  input: {
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  pickerWrap: {
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 10,
    overflow: "hidden",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },

  sheetActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  cancel: { backgroundColor: "#f1f3f5" },
  save: { backgroundColor: "#4c6ef5" },

  btnText: { fontWeight: "700" },
});
