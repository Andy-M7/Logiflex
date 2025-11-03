import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';

export default function RolesScreen() {
  const [roles, setRoles] = useState<string[]>(['Administrador', 'Supervisor', 'Logística']);
  const [nuevo, setNuevo] = useState('');

  const add = () => {
    const name = nuevo.trim();
    if (!name || roles.includes(name)) return;
    setRoles((r) => [...r, name]);
    setNuevo('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={roles}
        keyExtractor={(r) => r}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item }) => <View style={styles.pill}><Text style={{ color: 'white' }}>{item}</Text></View>}
      />
      <View style={styles.form}>
        <Text style={styles.label}>Nuevo rol</Text>
        <TextInput
          placeholder="Ej. Auxiliar"
          placeholderTextColor="#999"
          value={nuevo}
          onChangeText={setNuevo}
          style={styles.input}
        />
        <Button title="Agregar rol" onPress={add} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  pill: { padding: 12, borderRadius: 10, backgroundColor: '#2b2d31' },
  form: { padding: 16, gap: 8 },
  label: { fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#444', borderRadius: 10, padding: 12, color: 'white', backgroundColor: '#1f1f23' },
});
