import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
  Alert
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

import { PackingApi } from '../../services/packingApi';

type Props = NativeStackScreenProps<RootStackParamList, 'DetallePackingList'>;

type Producto = {
  id: string;
  nombre: string;
  lote: string;
  cantidad: number;
  estado: 'completo' | 'faltante' | 'sobrante' | 'otro_lote';
  cantidadObservada?: number;
  loteNuevo?: string;
};

const ESTADOS = [
  { key: 'completo', label: 'Completo' },
  { key: 'faltante', label: 'Faltantes' },
  { key: 'sobrante', label: 'Sobrantes' },
  { key: 'otro_lote', label: 'Otro lote' },
];

export default function PackingListScreen({ route }: Props) {
  const { id } = route.params;

  const [numeroPacking, setNumeroPacking] = useState('');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // 🔥 CARGAR DETALLE DESDE BACKEND
  // =====================================================
  const loadDetalle = async () => {
    try {
      const res = await PackingApi.getDetalle(id.toString());

      setNumeroPacking(res.data.numero);
      setProductos(res.data.productos);

    } catch (e) {
      Alert.alert("Error", "No se pudo cargar el detalle del packing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetalle();
  }, []);

  // =====================================================
  // 🔥 ACTUALIZAR ESTADO LOCAL
  // =====================================================
  const actualizarEstado = (prodId: string, estado: Producto['estado']) => {
    setProductos(prev =>
      prev.map(p =>
        p.id === prodId
          ? { ...p, estado, cantidadObservada: undefined, loteNuevo: undefined }
          : p
      )
    );
  };

  const actualizarCantidadObs = (prodId: string, value: string) => {
    const num = Number(value.replace(/[^0-9]/g, ''));
    setProductos(prev =>
      prev.map(p => (p.id === prodId ? { ...p, cantidadObservada: num } : p))
    );
  };

  const actualizarLoteNuevo = (prodId: string, lote: string) => {
    setProductos(prev =>
      prev.map(p => (p.id === prodId ? { ...p, loteNuevo: lote } : p))
    );
  };

  // =====================================================
  // 🔥 GUARDAR DETALLE EN EL BACKEND
  // =====================================================
  const guardarCambios = async () => {
    try {
      const payload = { productos };

      await PackingApi.saveDetalle(String(id), payload);

      Alert.alert("Éxito", "Cambios guardados correctamente.");
    } catch (e) {
      Alert.alert("Error", "No se pudieron guardar los cambios.");
    }
  };

  // =====================================================
  // 🔥 FINALIZAR PACKING
  // =====================================================
  const cerrarPacking = async () => {
    try {
      const payload = { productos };

      await PackingApi.cerrarPacking(String(id), payload);

      Alert.alert("Packing cerrado", "El packing fue finalizado correctamente.");
    } catch (e) {
      Alert.alert("Error", "No se pudo cerrar el packing.");
    }
  };

  // =====================================================
  // 🔥 RENDER PRODUCTO
  // =====================================================
  const renderProducto = ({ item }: { item: Producto }) => (
    <View style={styles.productCard}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.productName}>{item.nombre}</Text>
        <Text style={styles.productQty}>Cant: {item.cantidad}</Text>
      </View>

      <Text style={styles.productLote}>Lote: {item.lote}</Text>

      <View style={styles.estadoRow}>
        {ESTADOS.map(opt => (
          <Pressable
            key={opt.key}
            style={[
              styles.estadoBtn,
              opt.key === item.estado && styles.estadoBtnActive,
            ]}
            onPress={() => actualizarEstado(item.id, opt.key as Producto['estado'])}
          >
            <Text
              style={{
                color: opt.key === item.estado ? 'white' : '#585858',
                fontWeight: '600',
              }}
            >
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Inputs según estado */}
      {(item.estado === 'faltante' ||
        item.estado === 'sobrante' ||
        item.estado === 'otro_lote') && (
        <View style={styles.obsInputRow}>
          <Text style={styles.observadoLabel}>
            {item.estado === 'faltante'
              ? 'Cantidad faltante:'
              : item.estado === 'sobrante'
              ? 'Cantidad sobrante:'
              : 'Cantidad otro lote:'}
          </Text>

          <TextInput
            placeholder="0"
            keyboardType="numeric"
            style={styles.obsInput}
            value={item.cantidadObservada ? String(item.cantidadObservada) : ''}
            onChangeText={val => actualizarCantidadObs(item.id, val)}
          />
        </View>
      )}

      {item.estado === 'otro_lote' && (
        <View style={styles.obsInputRow}>
          <Text style={styles.observadoLabel}>Nuevo lote:</Text>
          <TextInput
            placeholder="Ej. L1859"
            style={styles.obsInput}
            value={item.loteNuevo ?? ''}
            onChangeText={val => actualizarLoteNuevo(item.id, val)}
          />
        </View>
      )}
    </View>
  );

  if (loading) return <Text style={{ marginTop: 50, textAlign: "center" }}>Cargando...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Packing List N° {numeroPacking}</Text>

      <FlatList
        data={productos}
        renderItem={renderProducto}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ paddingBottom: 24 }}
      />

      <Pressable style={styles.saveBtn} onPress={guardarCambios}>
        <Text style={styles.saveBtnText}>Guardar Cambios</Text>
      </Pressable>

      <Pressable style={styles.finishBtn} onPress={cerrarPacking}>
        <Text style={styles.finishBtnText}>Finalizar Packing</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: '#f9f9f9' },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    color: '#202A44',
    alignSelf: 'center'
  },

  productCard: {
    marginBottom: 18,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    elevation: 1,
  },

  productName: { fontWeight: '700', fontSize: 18 },
  productQty: { fontSize: 14, color: '#3c3c3c' },
  productLote: { marginTop: 4, color: '#5c7bc0', fontWeight: '500' },

  estadoRow: { flexDirection: 'row', marginTop: 10 },
  estadoBtn: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfc9dc',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f2f4fa',
    marginRight: 6,
  },
  estadoBtnActive: { backgroundColor: '#0b73de', borderColor: '#0b73de' },

  obsInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    gap: 6,
  },

  observadoLabel: { fontSize: 14, color: '#111' },

  obsInput: {
    flex: 1,
    backgroundColor: '#ececec',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cfd6e3',
  },

  saveBtn: {
    backgroundColor: '#0066ff',
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  saveBtnText: {
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
  },

  finishBtn: {
    backgroundColor: '#198754',
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  finishBtnText: {
    color: 'white',
    fontWeight: '700',
    textAlign: 'center',
  },
});
