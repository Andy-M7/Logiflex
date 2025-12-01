import React, { useLayoutEffect, useState, useCallback, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable,
  Modal, KeyboardAvoidingView, Platform, TextInput, Alert, ActivityIndicator, Image
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/StackNavigation';

// Clean Architecture
import { Product } from '../../domain/entities/products';
import { 
  GetProductsUseCase, 
  CreateProductUseCase, 
  UpdateProductUseCase, 
  DeleteProductUseCase 
} from '../../domain/useCases/products';

type Props = NativeStackScreenProps<RootStackParamList, 'Productos'>; // Asegúrate de tener esta ruta

export default function ProductosScreen({ navigation }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  // Formulario
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [batch, setBatch] = useState('');
  
  // Cargar Productos
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await GetProductsUseCase();
      setProducts(data);
    } catch (error) {
      console.log('Error cargando productos', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
        headerRight: () => null, // Ocultamos el default si lo hubiera
    });
  }, [navigation]);

  // Filtro de búsqueda
  const filteredData = useMemo(() => {
    if (!query) return products;
    const lower = query.toLowerCase();
    return products.filter(p => 
        p.name.toLowerCase().includes(lower) || 
        p.batch.toLowerCase().includes(lower)
    );
  }, [products, query]);

  // --- ACCIONES ---
  const abrirModalCrear = () => {
    setEditingId(null);
    setName('');
    setBatch('');
    setOpen(true);
  };

  const abrirModalEditar = (prod: Product) => {
    setEditingId(prod.id);
    setName(prod.name);
    setBatch(prod.batch);
    setOpen(true);
  };

  const guardar = async () => {
    if (!name.trim() || !batch.trim()) {
      Alert.alert('Datos incompletos', 'Nombre y Lote son obligatorios.');
      return;
    }

    try {
      const payload = {
        name: name.trim(),
        batch: batch.trim(),
        isActive: true, // Por defecto activo
        // imageUrl: '...' // Aquí podrías agregar lógica de imagen
      };

      if (editingId) {
        await UpdateProductUseCase(editingId, payload);
        Alert.alert('Actualizado', 'Producto modificado correctamente');
      } else {
        await CreateProductUseCase(payload);
        Alert.alert('Creado', 'Producto registrado correctamente');
      }
      
      loadProducts();
      setOpen(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el producto');
    }
  };

  const eliminar = (id: string) => {
    Alert.alert('Eliminar', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Eliminar', 
        style: 'destructive', 
        onPress: async () => {
          try {
            await DeleteProductUseCase(id);
            loadProducts();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar');
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <View style={{flex: 1}}>
        <Text style={styles.prodName}>{item.name}</Text>
        <Text style={styles.prodBatch}>Lote {item.batch}</Text>
      </View>
      
      <View style={styles.actions}>
        <Pressable style={styles.iconBtn} onPress={() => abrirModalEditar(item)}>
            <MaterialCommunityIcons name="pencil-outline" size={20} color="#4c6ef5" />
        </Pressable>
        <Pressable style={[styles.iconBtn, {backgroundColor: '#333'}]} onPress={() => eliminar(item.id)}>
            <MaterialCommunityIcons name="trash-can-outline" size={20} color="#ff6b6b" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      
      {/* Buscador y Botón Nuevo */}
      <View style={styles.headerContainer}>
        <TextInput 
            style={styles.searchInput}
            placeholder="Buscar productos"
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
        />
        <Pressable style={styles.newBtn} onPress={abrirModalCrear}>
            <Text style={styles.newBtnText}>+ Nuevo</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color="#4c6ef5" />
      ) : (
        <FlatList
            data={filteredData}
            keyExtractor={(i) => i.id}
            contentContainerStyle={{ padding: 16, gap: 12 }}
            renderItem={renderItem}
            ListEmptyComponent={
              <Text style={{textAlign: 'center', color: '#888', marginTop: 20}}>
                No hay productos registrados
              </Text>
            }
        />
      )}

      {/* Modal */}
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetBackdrop}>
          <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>
              {editingId ? 'Editar Producto' : 'Nuevo Producto'}
            </Text>

            <Text style={styles.label}>Nombre del Producto</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ej. Producto A"
              style={styles.input}
            />

            <Text style={styles.label}>Número de Lote</Text>
            <TextInput
              value={batch}
              onChangeText={setBatch}
              placeholder="Ej. 12345"
              style={styles.input}
            />

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
  headerContainer: { padding: 16, gap: 12, backgroundColor: '#fff', elevation: 2 },
  searchInput: { backgroundColor: '#333', borderRadius: 10, padding: 12, color: 'white' },
  newBtn: { backgroundColor: '#4c6ef5', padding: 12, borderRadius: 10, alignItems: 'center' },
  newBtnText: { color: 'white', fontWeight: 'bold' },

  card: {
    backgroundColor: '#1a1a1a', // Fondo oscuro como tu imagen
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prodName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  prodBatch: { color: '#aaa', fontSize: 14, marginTop: 4 },
  
  actions: { flexDirection: 'row', gap: 8 },
  iconBtn: { 
    width: 36, height: 36, 
    borderRadius: 8, 
    backgroundColor: '#2a2a2a', 
    justifyContent: 'center', alignItems: 'center' 
  },

  // Modal Styles
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: 'white', padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, gap: 12 },
  sheetTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  label: { fontWeight: '700', color: '#333', marginTop: 4 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 16, color: '#333' },
  sheetActions: { flexDirection: 'row', gap: 12, marginTop: 20 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancel: { backgroundColor: '#f1f3f5' },
  save: { backgroundColor: '#4c6ef5' },
  btnText: { fontWeight: 'bold' },
});