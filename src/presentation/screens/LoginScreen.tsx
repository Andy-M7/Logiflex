import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/StackNavigation';

import { signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { auth } from '../../firebase';
import { API_URL } from '../../services/api';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const TOKEN_KEY = "auth:token";
const USER_INFO = "auth:user";

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onLogin = async () => {
    setErr("");

    if (!email.trim()) return setErr("Ingresa tu correo");
    if (!password.trim()) return setErr("Ingresa tu contraseña");

    setLoading(true);

    try {
      // 1️⃣ Login Firebase
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const firebaseToken = await cred.user.getIdToken();

      // 2️⃣ Llamar al backend para validar token y devolver rol + usuario
      const res = await axios.post(
        `${API_URL}/auth/login`,
        {},
        { headers: { Authorization: `Bearer ${firebaseToken}` } }
      );

      // Respuesta del backend:
      // { ok: true, uid, email, role }

      // 3️⃣ Guardamos datos del backend
      await AsyncStorage.setItem(TOKEN_KEY, firebaseToken);
      await AsyncStorage.setItem(USER_INFO, JSON.stringify(res.data));

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });

    } catch (e: any) {
      console.log("LOGIN ERROR:", e?.response?.data || e.code);

      const mensajes: Record<string, string> = {
        "auth/invalid-email": "Correo inválido",
        "auth/missing-password": "Ingresa tu contraseña",
        "auth/wrong-password": "Contraseña incorrecta",
        "auth/user-not-found": "Usuario no registrado",
        "auth/too-many-requests": "Demasiados intentos. Intente luego"
      };

      setErr(
        mensajes[e.code] ||
        e?.response?.data?.message ||
        "Error al iniciar sesión"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>

        <Text style={styles.logo}>🏷 LogiFlex</Text>
        <Text style={styles.subtitle}>Bienvenido de nuevo</Text>

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="usuario@logiflex.com"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña</Text>
        <View style={styles.passWrapper}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="********"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
          />

          <Pressable onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
            <Text>👁️</Text>
          </Pressable>
        </View>

        {err ? <Text style={styles.error}>{err}</Text> : null}

        <Pressable style={styles.button} onPress={onLogin}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Ingresar</Text>
          }
        </Pressable>

        <Text style={styles.registerText}>
          ¿No tienes cuenta? <Text style={styles.registerLink}>Regístrate</Text>
        </Text>

      </View>
    </View>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  logo: {
    fontSize: 28,
    fontWeight: "800",
    alignSelf: "center",
    marginBottom: 6,
    color: "#3b82f6",
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#374151"
  },
  input: {
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    color: "#111827",
  },
  passWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeBtn: { padding: 10, marginLeft: -10 },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 12,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  registerText: { textAlign: "center", color: "#6b7280" },
  registerLink: { color: "#3b82f6", fontWeight: "700" }
});
