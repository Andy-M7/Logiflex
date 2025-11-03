import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList, Pressable, Modal,
  KeyboardAvoidingView, Platform, Image
} from 'react-native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

type Product = { id: string; nombre: string; lote?: string; imageUri?: string | null; };

export default function ProductosScreen() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<Product[]>([
    { id: 'a', nombre: 'Producto A', lote: '12345' },
    { id: 'b', nombre: 'Producto B', lote: '67890' },
    { id: 'c', nombre: 'Producto C' },
  ]);

  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [lote, setLote] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(p =>
      p.nombre.toLowerCase().includes(q) || (p.lote ?? '').toLowerCase().includes(q)
    );
  }, [query, data]);

  const pickImage = async () => {
    const options: ImageLibraryOptions = { mediaType: 'photo', selectionLimit: 1, quality: 0.7 };
    const res = await launchImageLibrary(options);
    const uri = res.assets?.[0]?.uri;
    if (uri) setImageUri(uri);
  };

  const guardar = () => {
    if (!nombre.trim()) return;
    const nuevo: Product = {
      id: String(Date.now()),
      nombre: nombre.trim(),
      lote: lote.trim() || undefined,
      imageUri,
    };
    setData(arr => [nuevo, ...arr]);
    setNombre(''); setLote(''); setImageUri(null); setOpen(false);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>
        {!!item.lote && <Text style={styles.cardSub}>Lote {item.lote}</Text>}
      </View>
      <View style={styles.cardActions}>
        <Pressable style={styles.iconBtn} onPress={() => { /* TODO: editar */ }}>
          <Text style={styles.icon}>✎</Text>
        </Pressable>
        <Pressable style={styles.iconBtn} onPress={() => { /* TODO: ver imagen */ }}>
          <Text style={styles.icon}>🖼️</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* buscador */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Buscar productos"
          placeholderTextColor="#8a8a8a"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      {/* botón nuevo */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <Pressable style={styles.newBtn} onPress={() => setOpen(true)}>
          <Text style={styles.newBtnText}>+ Nuevo</Text>
        </Pressable>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={p => p.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 12 }}
      />

      {/* bottom-sheet */}
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.sheetBackdrop}>
          <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)} />
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Nuevo Producto</Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ej. Producto D"
              placeholderTextColor="#8a8a8a"
              style={styles.input}
            />

            <Text style={styles.label}>Lote</Text>
            <TextInput
              value={lote}
              onChangeText={setLote}
              placeholder="Opcional"
              placeholderTextColor="#8a8a8a"
              style={styles.input}
            />

            <Text style={styles.label}>Imagen (opcional)</Text>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={{ width: '100%', height: 140, borderRadius: 10 }} />
            ) : null}
            <Pressable style={styles.secondaryBtn} onPress={pickImage}>
              <Text style={styles.secondaryText}>{imageUri ? 'Cambiar imagen' : 'Adjuntar imagen'}</Text>
            </Pressable>

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
  searchBox: { paddingHorizontal: 16, paddingTop: 12 },
  searchInput: {
    backgroundColor: '#2b2d31',
    color: 'white',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  newBtn: {
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#4c6ef5',
  },
  newBtnText: { color: 'white', fontWeight: '700' },

  card: {
    backgroundColor: '#1f1f23',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 18, fontWeight: '800', color: 'white' },
  cardSub: { color: 'white', opacity: 0.75, marginTop: 4 },
  cardActions: { flexDirection: 'row', gap: 10, marginLeft: 12 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#2b2d31',
  },
  icon: { color: '#7aa2ff', fontSize: 16 },

  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#0f0f10', padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20, gap: 10 },
  sheetTitle: { fontSize: 20, fontWeight: '800', color: 'white' },
  label: { fontWeight: '700', color: 'white' },
  input: {
    borderWidth: 1, borderColor: '#3a3a3a', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, color: 'white', backgroundColor: '#141416',
  },
  secondaryBtn: { borderWidth: 1, borderColor: '#3a3a3a', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  secondaryText: { color: 'white', fontWeight: '600' },
  sheetActions: { flexDirection: 'row', gap: 12, marginTop: 4 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  cancel: { backgroundColor: '#1f1f23' },
  save: { backgroundColor: '#4c6ef5' },
  btnText: { fontWeight: '700', color: 'white' },
});
