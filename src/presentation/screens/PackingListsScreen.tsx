import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList, Image, Pressable
} from 'react-native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

type PackingList = { id: number; numero: string; lote: string; isSurtido?: boolean; imageUri?: string | null; };

export default function PackingListsScreen() {
  const [data, setData] = useState<PackingList[]>([
    { id: 1, numero: '40802', lote: '10266-7-30', isSurtido: true, imageUri: null },
    { id: 2, numero: '40910', lote: '10270-8-01', isSurtido: false, imageUri: null },
  ]);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(p => p.numero.toLowerCase().includes(q) || p.lote.toLowerCase().includes(q));
  }, [query, data]);

  const attachImage = async (id: number) => {
    const options: ImageLibraryOptions = { mediaType: 'photo', selectionLimit: 1, quality: 0.7 };
    const res = await launchImageLibrary(options);
    const uri = res.assets?.[0]?.uri ?? null;
    if (uri) setData(prev => prev.map(p => (p.id === id ? { ...p, imageUri: uri } : p)));
  };

  const removeImage = (id: number) => {
    setData(prev => prev.map(p => (p.id === id ? { ...p, imageUri: null } : p)));
  };

  const renderItem = ({ item }: { item: PackingList }) => (
    <Pressable style={styles.row}>
      <View style={styles.thumbWrap}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.thumbPlaceholder]}>
            <Text style={{ color: '#888' }}>No img</Text>
          </View>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.num}>{item.numero}</Text>
        <Text style={styles.lote}>{item.lote}</Text>
        {typeof item.isSurtido === 'boolean' && (
          <Text style={[styles.tag, item.isSurtido ? styles.ok : styles.warn]}>
            {item.isSurtido ? 'Surtido' : 'Pendiente'}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.iconBtn} onPress={() => attachImage(item.id)}>
          <Text style={styles.icon}>🖼️</Text>
        </Pressable>
        {item.imageUri ? (
          <Pressable style={[styles.iconBtn, styles.remove]} onPress={() => removeImage(item.id)}>
            <Text style={styles.icon}>✖</Text>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Buscar"
          placeholderTextColor="#8a8a8a"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(p) => String(p.id)}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  searchBox: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#e9e9e9' },
  searchInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111',
  },
  row: { flexDirection: 'row', gap: 12, paddingHorizontal: 12, paddingVertical: 10, alignItems: 'center' },
  sep: { height: StyleSheet.hairlineWidth, backgroundColor: '#eee' },
  thumbWrap: { width: 74, height: 74, borderRadius: 10, overflow: 'hidden' },
  thumb: { width: '100%', height: '100%' },
  thumbPlaceholder: { backgroundColor: '#f6f6f6', alignItems: 'center', justifyContent: 'center' },
  num: { fontSize: 18, fontWeight: '800', color: '#111' },
  lote: { marginTop: 2, color: '#666' },
  tag: { marginTop: 4, fontWeight: '700' },
  ok: { color: '#1e7f34' },
  warn: { color: '#b45309' },
  actions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 16 },
  remove: { backgroundColor: '#f2dede' },
});
