// src/presentation/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  ActivityIndicator, useColorScheme, KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/StackNavigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const TOKEN_KEY = 'auth:token';

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const isDark = useColorScheme() === 'dark';

  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('admin123');
  const [seePass, setSeePass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onLogin = async () => {
    setErr(null);

    const mail = email.trim();
    const pass = password;

    const mailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
    if (!mailOk) { setErr('Correo inválido'); return; }
    if (!pass.trim()) { setErr('Ingresa tu contraseña'); return; }

    setLoading(true);
    try {
      // Mock de autenticación (reemplazar POR API)
      await new Promise<void>((res) => setTimeout(res, 700));
      if (!(mail === 'admin@demo.com' && pass === 'admin123')) {
        throw new Error('Credenciales incorrectas');
      }

      await AsyncStorage.setItem(TOKEN_KEY, 'demo-token');
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: isDark ? '#0E0F12' : '#F7F8FA' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[
        styles.card,
        { backgroundColor: isDark ? '#15171C' : '#FFFFFF', borderColor: isDark ? '#22252B' : '#E5E7EB' }
      ]}>
        <View style={styles.logo}>
          <MaterialCommunityIcons name="truck-cargo-container" size={36} color="#4C6EF5" />
          <Text style={[styles.brand, { color: isDark ? '#E5E7EB' : '#0E1116' }]}>LogiFlex</Text>
        </View>

        <Text style={[styles.title, { color: isDark ? '#E5E7EB' : '#0E1116' }]}>Iniciar sesión</Text>

        <Text style={[styles.label, { color: isDark ? '#E5E7EB' : '#111' }]}>Correo</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="usuario@empresa.com"
          placeholderTextColor={isDark ? '#7C8591' : '#9AA1AC'}
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#0F1115' : '#F9FAFB',
              borderColor: isDark ? '#272B33' : '#D1D5DB',
              color: isDark ? '#E5E7EB' : '#0E1116',
            },
          ]}
        />

        <Text style={[styles.label, { color: isDark ? '#E5E7EB' : '#111' }]}>Contraseña</Text>
        <View style={styles.passRow}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!seePass}
            placeholder="********"
            placeholderTextColor={isDark ? '#7C8591' : '#9AA1AC'}
            style={[
              styles.input,
              {
                flex: 1,
                marginBottom: 0,
                backgroundColor: isDark ? '#0F1115' : '#F9FAFB',
                borderColor: isDark ? '#272B33' : '#D1D5DB',
                color: isDark ? '#E5E7EB' : '#0E1116',
              },
            ]}
          />
          
          <Pressable
            onPress={() => setSeePass(v => !v)}
            style={[
              styles.eyeBtn,
              { backgroundColor: isDark ? '#0F1115' : '#F3F4F6', borderColor: isDark ? '#272B33' : '#D1D5DB' }
            ]}
          >
            <MaterialCommunityIcons name={seePass ? 'eye-off' : 'eye'} size={22} color={isDark ? '#9AA1AC' : '#6B7280'} />
          </Pressable>
        </View>

        {!!err && <Text style={styles.error}>{err}</Text>}

        <Pressable style={styles.loginBtn} onPress={onLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Ingresar</Text>}
        </Pressable>

        <Text style={[styles.hint, { color: isDark ? '#9AA1AC' : '#6B7280' }]}>
          Demo: admin@demo.com / admin123
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  card: {
    borderRadius: 18,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    elevation: 2,
  },
  logo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  brand: { fontSize: 20, fontWeight: '800' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  label: { fontWeight: '700', marginTop: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  passRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  error: { color: '#b91c1c', fontWeight: '700' },
  loginBtn: {
    marginTop: 6,
    backgroundColor: '#4C6EF5',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginText: { color: 'white', fontWeight: '800' },
  hint: { textAlign: 'center', marginTop: 8 },
});
