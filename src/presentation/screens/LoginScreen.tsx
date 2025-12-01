// src/presentation/screens/LoginScreen.tsx

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
import { auth } from '../../firebase';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const TOKEN_KEY = "auth:token";

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onLogin = async () => {
    setErr("");

    if (!email.trim()) {
      setErr("Ingresa tu correo");
      return;
    }
    if (!password.trim()) {
      setErr("Ingresa tu contraseña");
      return;
    }

    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      const idToken = await cred.user.getIdToken();

      await AsyncStorage.setItem(TOKEN_KEY, idToken);

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });

    } catch (e: any) {
      console.log(e.code);

      const mensajes: Record<string, string> = {
        "auth/invalid-email": "Correo inválido",
        "auth/missing-password": "Ingresa tu contraseña",
        "auth/wrong-password": "Contraseña incorrecta",
        "auth/user-not-found": "Usuario no registrado",
        "auth/too-many-requests": "Demasiados intentos. Espera un momento"
      };

      setErr(mensajes[e.code] || "Error al iniciar sesión");

    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {err ? <Text style={styles.error}>{err}</Text> : null}

      <Pressable style={styles.button} onPress={onLogin}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Ingresar</Text>
        }
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 26, marginBottom: 20 },
  input: { borderWidth: 1, padding: 12, marginVertical: 8, borderRadius: 8 },
  button: { backgroundColor: "black", padding: 12, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16 },
  error: { color: "red", marginBottom: 10 }
});
