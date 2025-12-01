// src/presentation/screens/UsuariosScreen.tsx
import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  Modal, KeyboardAvoidingView, Platform, TextInput, Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/StackNavigation';

import { UsersApi } from "../../services/usersApi";

type Props = NativeStackScreenProps<RootStackParamList, 'Usuarios'>;

type Usuario = { 
  id: string; 
  email: string; 
  role: string; 
  isActive: boolean;
  name?: string;
};

const ROLES = ["Administrador", "Supervisor", "Logística", "Operaciones"];

export default function UsuariosScreen({ navigation }: Props) {

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState(ROLES[0]);

  // ================================
  // HEADER
  // ================================
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable style={styles.addBtn} onPress={handleOpenCreate}>
          <Text style={styles.addBtnText}>+ Añadir</Text>
        </Pressable>
      ),
    });
  }, []);

  // ================================
  // CARGA USUARIOS
  // ================================
  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await UsersApi.getAll(); // Puede venir undefined

      if (!res) {
        console.log("⚠ No hubo respuesta del servidor");
        return;
      }

      setUsuarios(res.data);

    } catch (e: any) {
      console.log("Error cargando usuarios:", e.message);
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // ABRIR CREAR
  // ======================================
  const handleOpenCreate = () => {
    setEditingId(null);
    setEmail("");
    setNombre("");
    setPassword("");
    setRol(ROLES[0]);
    setOpen(true);
  };

  // ======================================
  // ABRIR EDITAR
  // ======================================
  const handleOpenEdit = (user: Usuario) => {
    setEditingId(user.id);
    setEmail(user.email);
    setNombre(user.name ?? "");
    setPassword("");
    setRol(user.role);
    setOpen(true);
  };

  // ======================================
  // GUARDAR / EDITAR
  // ======================================
  const guardar = async () => {
    if (!email.trim()) return Alert.alert("Correo requerido");
    if (!nombre.trim()) return Alert.alert("Nombre requerido");

    if (!editingId && password.length < 6) {
      return Alert.alert("Contraseña mínima 6 caracteres");
    }

    try {
      if (editingId) {
        await UsersApi.update(editingId, {
          email,
          name: nombre,
          role: rol,
          ...(password ? { password } : {})
        });

        Alert.alert("Éxito", "Usuario actualizado correctamente");

      } else {
        await UsersApi.create({
          email,
          password,
          name: nombre,
          role: rol,
        });

        Alert.alert("Éxito", "Usuario creado correctamente");
      }

      setOpen(false);
      load();

    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  // ======================================
  // ELIMINAR
  // ======================================
  const eliminar = (id: string) => {
    Alert.alert(
      "Confirmar",
      "¿Deseas eliminar este usuario?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              await UsersApi.delete(id);
              load();
            } catch {
              Alert.alert("Error", "No se pudo eliminar");
            }
          }
        }
      ]
    );
  };

  // ======================================
  // RENDER ITEM
  // ======================================
  const renderItem = ({ item }: { item: Usuario }) => (
    <View style={styles.row}>
      <View>
        <Text style={styles.title}>{item.email}</Text>
        <Text style={styles.sub}>Nombre: {item.name ?? "—"}</Text>
        <Text style={styles.sub}>Rol: {item.role}</Text>
      </View>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <Pressable 
          style={[styles.btn, styles.ghost]} 
          onPress={() => handleOpenEdit(item)}
        >
          <Text style={styles.btnText}>Editar</Text>
        </Pressable>

        <Pressable 
          style={[styles.btn, styles.danger]} 
          onPress={() => eliminar(item.id)}
        >
          <Text style={[styles.btnText, { color: "white" }]}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );

  // ======================================
  // UI
  // ======================================
  return (
    <View style={styles.container}>

      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 30, color: "#888" }}>
          Cargando...
        </Text>
      ) : (
        <FlatList
          data={usuarios}
          keyExtractor={(i) => i.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          renderItem={renderItem}
        />
      )}

      {/* ============================
          BOTTOM SHEET
      =============================== */}
      <Modal visible={open} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.sheetBackdrop}
        >
          <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)} />

          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>
              {editingId ? "Editar Usuario" : "Añadir Usuario"}
            </Text>

            <Text style={styles.label}>Correo</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
            />

            <Text style={styles.label}>Nombre</Text>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              style={styles.input}
            />

            <Text style={styles.label}>
              {editingId ? "Contraseña (opcional)" : "Contraseña"}
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
            />

            <Text style={styles.label}>Rol</Text>
            <View style={styles.pickerWrap}>
              <Picker selectedValue={rol} onValueChange={setRol}>
                {ROLES.map(r => (
                  <Picker.Item key={r} label={r} value={r} />
                ))}
              </Picker>
            </View>

            <View style={styles.sheetActions}>
              <Pressable style={[styles.btn, styles.cancel]} onPress={() => setOpen(false)}>
                <Text style={styles.btnText}>Cancelar</Text>
              </Pressable>

              <Pressable style={[styles.btn, styles.save]} onPress={guardar}>
                <Text style={[styles.btnText, { color: "white" }]}>
                  {editingId ? "Actualizar" : "Guardar"}
                </Text>
              </Pressable>
            </View>

          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}


// ===========================
// ESTILOS
// ===========================
const styles = StyleSheet.create({
  container: { flex: 1 },

  row: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#2b2d31",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: { fontSize: 16, fontWeight: "700", color: "white" },
  sub: { color: "white", opacity: 0.85 },

  addBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#e9ecef",
  },
  addBtnText: { fontWeight: "700" },

  btn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  ghost: { backgroundColor: "#1f1f23" },
  danger: { backgroundColor: "#c92a2a" },
  btnText: { fontWeight: "600", color: "white" },

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
    gap: 10,
  },

  sheetTitle: { fontSize: 18, fontWeight: "800" },

  label: { fontWeight: "700" },

  input: {
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 10,
    padding: 10,
  },

  pickerWrap: {
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 10,
    overflow: "hidden",
  },

  sheetActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  cancel: { backgroundColor: "#f1f3f5" },
  save: { backgroundColor: "#4c6ef5" },
});
