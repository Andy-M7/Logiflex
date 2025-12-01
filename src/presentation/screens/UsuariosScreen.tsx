import React, { useLayoutEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  Modal, KeyboardAvoidingView, Platform, TextInput, Alert, ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/StackNavigation';

// Imports actualizados
import { User } from '../../domain/entities/user';
import { GetUsersUseCase, CreateUserUseCase, DeleteUserUseCase, UpdateUserUseCase } from '../../domain/useCases/users';

type Props = NativeStackScreenProps<RootStackParamList, 'Usuarios'>;

const ROLES_BASE = ['Administrador', 'Supervisor', 'Logística', 'Operaciones'];

export default function UsuariosScreen({ navigation }: Props) {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados del Formulario
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState(''); // --- NUEVO: Estado para contraseña
  const [rol, setRol] = useState<string>(ROLES_BASE[0]); 

  // Cargar Usuarios
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await GetUsersUseCase();
      setUsuarios(data);
    } catch (error) {
      console.log('Error cargando usuarios', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUsers();
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

  // --- ACCIONES MODAL ---
  const abrirModalCrear = () => {
    setEditingId(null);
    setCorreo('');
    setNombre('');
    setPassword(''); // Limpiamos contraseña
    setRol(ROLES_BASE[0]);
    setOpen(true);
  };

  const abrirModalEditar = (usuario: User) => {
    setEditingId(usuario.id);
    setCorreo(usuario.email);
    setNombre(usuario.fullName || '');
    setPassword(''); // Al editar empieza vacía (si no escribe nada, no se cambia)
    setRol(ROLES_BASE[0]); 
    setOpen(true);
  };

  const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const guardar = async () => {
    const mail = correo.trim();
    const name = nombre.trim();
    const pass = password.trim();

    if (!isEmail(mail)) {
      Alert.alert('Correo inválido', 'Ingresa un correo electrónico válido.');
      return;
    }
    if (!name) {
      Alert.alert('Falta nombre', 'Ingresa el nombre del usuario.');
      return;
    }

    // Validación de contraseña solo al CREAR
    if (!editingId && pass.length < 6) {
        Alert.alert('Contraseña inválida', 'La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    try {
      if (editingId) {
        // --- CASO EDITAR ---
        // Preparamos el objeto a actualizar
        const updateData: any = {
            email: mail,
            fullName: name,
        };
        // Solo enviamos password si el usuario escribió algo nuevo
        if (pass.length > 0) {
            if (pass.length < 6) {
                Alert.alert('Error', 'La nueva contraseña es muy corta.');
                return;
            }
            updateData.password = pass;
        }

        await UpdateUserUseCase(editingId, updateData);
        Alert.alert('Actualizado', 'Usuario modificado correctamente.');
      } else {
        // --- CASO CREAR ---
        await CreateUserUseCase({ 
          email: mail, 
          fullName: name,
          password: pass // Aquí sí enviamos la contraseña escrita
        });
        Alert.alert('Creado', 'Usuario creado correctamente.');
      }
      
      loadUsers();
      setOpen(false);
    } catch (error: any) {
      // --- MEJORA EN EL MANEJO DE ERRORES ---
      console.log('Error detallado:', error);
      let msg = 'No se pudo procesar la solicitud.';

      if (error.response) {
        // El servidor respondió con un error (400, 401, 500, etc.)
        console.log('Datos respuesta servidor:', error.response.data);
        const serverData = error.response.data;
        
        // A veces NestJS devuelve los errores de validación como un array de strings
        if (Array.isArray(serverData.message)) {
            msg = serverData.message.join('\n'); // Unimos los errores con salto de línea
        } else if (serverData.message) {
            msg = serverData.message;
        }
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta (Error de red/conexión)
        msg = 'No se recibió respuesta del servidor. Verifica tu conexión a internet o la IP de la API.';
      } else {
        msg = error.message;
      }

      Alert.alert('Ocurrió un error', String(msg));
    }
  };

  const eliminar = (id: string) => {
    Alert.alert('Eliminar', '¿Estás seguro de eliminar este usuario?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Eliminar', 
        style: 'destructive', 
        onPress: async () => {
          try {
            await DeleteUserUseCase(id);
            loadUsers();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar');
          }
        }
      }
    ]);
  }

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.row}>
      <View style={{flex: 1}}>
        <Text style={styles.title}>{item.email}</Text>
        <Text style={styles.sub}>{item.fullName}</Text>
        <Text style={[styles.sub, {fontSize: 12, marginTop: 4, color: '#4c6ef5'}]}>
           {item.role || 'Usuario Sistema'}
        </Text>
      </View>
      
      <View style={styles.actions}>
        <Pressable style={styles.editBtn} onPress={() => abrirModalEditar(item)}>
          <Text style={styles.editBtnText}>Editar</Text>
        </Pressable>
        <Pressable style={styles.deleteBtn} onPress={() => eliminar(item.id)}>
          <Text style={styles.deleteBtnText}>Eliminar</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#4c6ef5" />
      ) : (
        <FlatList
            data={usuarios}
            keyExtractor={(i) => i.id}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={{textAlign: 'center', color: '#888', marginTop: 20}}>
                No hay usuarios registrados
              </Text>
            }
        />
      )}

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheetBackdrop}
        >
          <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>
              {editingId ? 'Editar Usuario' : 'Añadir Usuario'}
            </Text>

            <Text style={styles.label}>Nombre Completo</Text>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej. Juan Admin"
              placeholderTextColor="#8a8a8a"
              style={styles.input}
            />

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

            {/* --- NUEVO CAMPO: CONTRASEÑA --- */}
            <Text style={styles.label}>
                {editingId ? 'Nueva Contraseña (Opcional)' : 'Contraseña'}
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder={editingId ? "Dejar vacío para no cambiar" : "Mínimo 6 caracteres"}
              placeholderTextColor="#8a8a8a"
              style={styles.input}
            />

            <Text style={styles.label}>Rol (Visual)</Text>
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
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  row: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  title: { fontSize: 16, fontWeight: '700', color: '#333' },
  sub: { color: '#666', opacity: 0.9 },
  actions: { flexDirection: 'row', gap: 8 },
  editBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#ddd' },
  editBtnText: { fontWeight: '600', fontSize: 12, color: '#333' },
  deleteBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#ffc9c9' },
  deleteBtnText: { fontWeight: '600', fontSize: 12, color: '#d32f2f' },
  btn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  btnText: { fontWeight: '600', fontSize: 13 },
  addBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, backgroundColor: '#e9ecef' },
  addBtnText: { fontWeight: '700', color: '#333' },
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: 'white', padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, gap: 12 },
  sheetTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8, color: '#333' },
  label: { fontWeight: '700', color: '#333', marginTop: 4 },
  input: { borderWidth: 1, borderColor: '#d1d1d1', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#333' },
  pickerWrap: { borderWidth: 1, borderColor: '#d1d1d1', borderRadius: 10, overflow: 'hidden' },
  sheetActions: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 10 },
  cancel: { backgroundColor: '#f1f3f5', flex: 1, paddingVertical: 14, borderRadius: 12 },
  save: { backgroundColor: '#4c6ef5', flex: 1, paddingVertical: 14, borderRadius: 12 },
});