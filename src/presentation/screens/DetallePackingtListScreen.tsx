import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'DetallePackingList'>;

// Simulación de productos asociados al packing
type Producto = {
  id: number;
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

export default function DetallePackingListScreen({ route }: Props) {
  const { id } = route.params;
  const [numeroPacking] = useState('40802'); 

  // Simulación de productos
  const [productos, setProductos] = useState<Producto[]>([
    { id: 1, nombre: 'Producto A', lote: 'L-1830', cantidad: 10, estado: 'completo' },
    { id: 2, nombre: 'Producto B', lote: 'L-1830', cantidad: 5, estado: 'completo' },
    { id: 3, nombre: 'Producto C', lote: 'L-1830', cantidad: 8, estado: 'completo' },
  ]);

  const actualizarEstado = (prodId: number, estado: Producto['estado']) => {
    setProductos(prev =>
      prev.map(p =>
        p.id === prodId
          ? { ...p, estado, cantidadObservada: undefined, loteNuevo: undefined }
          : p
      )
    );
  };

  const actualizarCantidadObs = (prodId: number, value: string) => {
    const num = Number(value.replace(/[^0-9]/g, ''));
    setProductos(prev =>
      prev.map(p =>
        p.id === prodId ? { ...p, cantidadObservada: num } : p
      )
    );
  };

  const actualizarLoteNuevo = (prodId: number, lote: string) => {
    setProductos(prev =>
      prev.map(p =>
        p.id === prodId ? { ...p, loteNuevo: lote } : p
      )
    );
  };

  const renderProducto = ({ item }: { item: Producto }) => (
    <View style={styles.productCard}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.productName}>{item.nombre}</Text>
        <Text style={styles.productQty}>Cantidad: {item.cantidad}</Text>
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
      {(item.estado === 'faltante' || item.estado === 'sobrante' || item.estado === 'otro_lote') && (
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
          <Text style={styles.observadoLabel}>Lote observado:</Text>
          <TextInput
            placeholder="Ej. L-1835"
            style={styles.obsInput}
            value={item.loteNuevo ?? ''}
            onChangeText={val => actualizarLoteNuevo(item.id, val)}
          />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Packing List N° {numeroPacking}</Text>
      <FlatList
        data={productos}
        renderItem={renderProducto}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: '#f9f9f9' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12, color: '#202A44', alignSelf: 'center' },
  productCard: {
    marginBottom: 18,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#bebebe', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 4,
    elevation: 1,
  },
  productName: { fontWeight: '700', fontSize: 18, color: '#252525' },
  productQty: { color: '#3c3c3c', fontWeight: '300', fontSize: 14 },
  productLote: { marginTop: 4, color: '#5c7bc0', fontWeight: '500', fontSize: 13 },
  estadoRow: { flexDirection: 'row', marginTop: 10, gap: 6 },
  estadoBtn: {
    borderRadius: 8,
    borderWidth: 1, borderColor: '#bfc9dc',
    paddingHorizontal: 10, paddingVertical: 5,
    backgroundColor: '#f2f4fa',
    marginRight: 6,
  },
  estadoBtnActive: { backgroundColor: '#0b73de', borderColor: '#0b73de' },
  obsInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 7, gap: 6 },
  observadoLabel: { fontSize: 14, color: '#111', marginRight: 5 },
  obsInput: {
    flex: 1,
    backgroundColor: '#ececec',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cfd6e3',
    fontSize: 14,
  },
});
